#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 19-4-18 上午10:01
# @Author  : nan
# @File    : cloud.py

import functools
import json
import sys
import time

import requests
from requests import ConnectionError

from app_projects.tools.get_awcloud_img import AWCloudManage
from app_projects.tools.utils import generate_random
from flask import current_app

sys.path.append("{}/flask_packages".format(sys.path[0]))
from requests_toolbelt import MultipartEncoderMonitor, MultipartEncoder

from app_projects.tools.sqlite_queue import q
from app_projects.globalvar import *
from app_projects.tools.file_path import GetModel
from app_projects.models.model import ParamsData as model

"""
    1、创建一个项目
    2、创建规格
    3、新建安全组
    5、创建云主机
"""
requests.adapters.DEFAULT_RETRIES = 5  # 增加重连次数
requests = requests.session()
POOL_LIST = []

OPEN_PORT = ["22", "80", '3306', "443", "-1"]

# 规格参数
flavor_info = {
    "is_public": IS_PUBLIC,
    "name": FLAVOR_NAME,
    "ram": RAM,
    "ram_max": RAM_MAX,
    "vcpus": CPU,
    "vcpus_max": CPU_MAX
}


def redirect_login_or_code(fun):
    @functools.wraps(fun)
    def warp(*args, **kwargs):
        is_login = fun(*args, **kwargs)
        if isinstance(is_login, dict) and 'code' in is_login:
            if is_login['code'] == '0':
                return is_login['data']['data']
            if is_login['code'] == '00010102':
                pass
            if 'code' in is_login and is_login['code'] == '00010105':
                manager = AWCloudManage()
                manager._login()
                model.update_or_create('get_auth_header', manager.get_auth_header())
            else:
                return is_login
        else:
            return is_login
        return is_login

    return warp


def shell_get_node():
    """
    通过配置文件获取node节点信息
    :return: List
    """
    return os.popen("consul members | awk '{ print $1 }'").read().split('\n')[1:-1]


def push_message():
    """
    消息推送
    :return:
    """
    URL = 'http://{}/awstack-user/v1/params'.format(GetModel.awcloud_ip())
    current_app.logger.info('message push API: {}'.format(URL))
    manager = AWCloudManage('', '')
    is_login = True
    while is_login:
        try:
            manager._login()
            is_login = False
        except ConnectionError as e:
            print "docker 未启动连接失败"
            time.sleep(3)
    headers = manager.get_auth_header()
    body = {
        "enterpriseUid": "66666666666666666666666666666666",
        "paramValue": "http://{}/v1/awcloud-message/".format(GetModel.panacube_ip()),
        "paramName": "resource_pass",
        "parentId": 939,
        "regionUid": "8b4f22a536f845769820b5777d549238",
        "paramLevel": 2,
        "paramDesc": "消息推送",
        "regionKey": 0
    }
    resp = requests.post(URL, data=json.dumps(body), headers=headers)
    current_app.logger.info("message return info: {}".format(resp.json()))
    if resp.json().get('code') == '01170101':
        print 'push message: 参数名称已存在'
    current_app.logger.info('push message: 添加消息推送成功')


class ClearAwCloud(object):

    def __init__(self, get_auth_header):
        self.headers = get_auth_header
        self.project_name = None
        self.project_name = None

    def append_headers(self):
        self.create_project()
        self.headers['project_id'] = self.project_id
        self.headers['project_name'] = self.project_name
        return self.headers

    def get_cloud_status(self, cloud_id):
        url = 'http://{}/awstack-resource/v1/server/{}'.format(GetModel.awcloud_ip(), cloud_id)
        resp = requests.get(url, headers=self.append_headers(), verify=False)
        current_app.logger.info(
            "get cloud ID {} status: {}".format(cloud_id, resp.json().get('data').get('data').get('status')))
        if resp.json()['data']['data'].get('status') == 'ACTIVE':
            return True
        return False

    @redirect_login_or_code
    def get_volume_type(self):
        """
        获取云硬盘ID
        :return:
        """
        GET_VOLUMES = "http://{}/awstack-user/v1/storage/list".format(GetModel.awcloud_ip())

        resp = requests.get(GET_VOLUMES, headers=self.append_headers(), verify=False)
        return resp.json()

    @redirect_login_or_code
    def get_node_info(self):
        """
        获取node物理节点
        :return:
        """
        GET_NODE = "http://{}/awstack-user/v1/enterprises/66666666666666666666666666666666/regions/8b4f22a536f845769820b5777d549238/nodes/list".format(
            GetModel.awcloud_ip())

        resp = requests.get(GET_NODE, verify=False)
        return resp.json()

    def set_rule(self, id, port):
        """
        设置安全组的开放端口
        :param id:
        :param port:
        :return:
        """
        ADD_GROUP_RULE = "http://{}/awstack-resource/v1/security_groups/rule".format(GetModel.awcloud_ip())

        if isinstance(port, list):
            for i in port:
                rule_body = {
                    "cidr": "0.0.0.0/0",
                    "direction": "ingress",
                    "enabled": "1",
                    "ethertype": "IPV4",
                    "fromPort": i,
                    "groupId": id,
                    "ipProtocol": "tcp",
                    "toPort": i
                }
                if i == "-1":
                    rule_body['ipProtocol'] = "icmp"
                requests.post(ADD_GROUP_RULE, data=json.dumps(rule_body), headers=self.append_headers(), verify=False)

    @redirect_login_or_code
    def get_security_group_id(self):
        """新建安全组"""
        CREATE_SECURITY_GROUPS = "http://{}/awstack-resource/v1/security_groups".format(GetModel.awcloud_ip())

        security_group = {
            "name": "panacube3.0",
            "description": "3.0项目部署"
        }

        q.put({"type": "云平台", "speed_p": "stop", "percentage": "69"})
        resp = requests.post(CREATE_SECURITY_GROUPS, data=json.dumps(security_group), headers=self.append_headers(),
                             verify=False)
        # ['id]
        group_obj = resp.json()

        if 'code' in group_obj:
            if group_obj['code'] == '02310100':
                _url = "http://{}/awstack-resource/v1/security_groups".format(GetModel.awcloud_ip())
                data = requests.get(_url, headers=self.append_headers(), verify=False)
                js_data = data.json()['data']['data']
                _id = None
                for i in js_data:
                    if i['name'] == 'default':
                        self.set_rule(i['id'], OPEN_PORT)
                        _id = i['id']
                return {'id': _id}

        if group_obj['data'] is not None:
            self.set_rule(group_obj['data']['data']['id'], OPEN_PORT)
        return group_obj

    @redirect_login_or_code
    def get_external_network(self):
        """
        获取外部网络
        :return:
        """
        # ip = model.get_params('awcloud_ip')
        ip = GetModel.awcloud_ip()
        current_app.logger.info('海云IP地址为--->{}'.format(ip))
        GET_EXTERNAL_NETWORK = "http://{}/awstack-resource/v1/getExternalNetworks".format(ip)

        resp = requests.get(GET_EXTERNAL_NETWORK, headers=self.headers, verify=False)
        return resp.json()

    @redirect_login_or_code
    def create_project(self):
        """创建项目"""
        project_info = {
            "project": {
                "name": "panacube_3.0",
                "nameNe": "panacube_3.0",
                "domainUid": self.headers.get('domain_id'),
                "enabled": True,
                "description": "panacube3.0项目"
            },
            "quotas": [
                {
                    "enterpriseUid": self.headers.get('enterprise_id'),
                    "type": "project_quota",
                    "name": "cores",
                    "isShow": True,
                    "hardLimit": CPU_QUOTA,
                    "domainUid": self.headers.get('domain_id')
                },
                {
                    "enterpriseUid": self.headers.get('enterprise_id'),
                    "type": "project_quota",
                    "name": "                                    ",
                    "isShow": True,
                    "hardLimit": MEMORY_QUOTA,  # 内存大小
                    "domainUid": self.headers.get('domain_id')
                },
                {
                    "enterpriseUid": self.headers.get('enterprise_id'),
                    "type": "project_quota",
                    "name": "gigabytes",
                    "isShow": True,
                    "hardLimit": STORAGE_QUOTA,  # 存储配额
                    "domainUid": self.headers.get('domain_id')
                }
            ]
        }

        CREATE_PROJECT_URL = "http://{}/awstack-user/v1/enterprises/66666666666666666666666666666666/projects/check?enterpriseUid=66666666666666666666666666666666".format(
            GetModel.awcloud_ip())
        current_app.logger.info('开始创建项目')
        try:
            requests.keep_alive = False
            resp = requests.post(CREATE_PROJECT_URL, data=json.dumps(project_info), headers=self.headers, verify=False)
        except Exception as e:
            raise e

        if resp.json()['code'] == "##":
            re = requests.get("http://{}/awstack-user/v1/enterprises/66666666666666666666666666666666/projects"
                              .format(GetModel.awcloud_ip()), headers=self.headers, verify=False)
            for i in re.json()['data']['data']:
                if i['name'] == 'panacube_3.0':
                    self.project_id = i['projectUid']
                    self.project_name = i['name']
        elif resp.json()['code'] == '00010105':
            # docker重启会导致token失效
            manager = AWCloudManage()
            login_data = manager._login()
            if login_data['code'] == 0:
                self.headers = manager.get_auth_header()
                model.update_or_create('get_auth_header', manager.get_auth_header())
                self.create_project()
            time.sleep(2)
        else:
            self.project_id = resp.json()['data']['data']['project']['projectUid']
            self.project_name = resp.json()['data']['data']['project']['name']

    def get_network_card(self, ip, network_id):
        """
        查询该ip是否可用
        :param ip: ip是需要设置panacube3.0的IP  network_id是外部网络ｉｄ
        :return:
        """
        _url = 'http://{}/awstack-resource/v1/networks/{}'.format(GetModel.awcloud_ip(), network_id)
        resp = requests.get(_url, headers=self.headers, verify=False)
        for i in resp.json()['data']['data']:
            if ip in i['ip']:
                current_app.logger.info('创建云主机Ip已存在---{}'.format(ip))
                return "null"
        current_app.logger.info('验证KVM　ＩＰ: {}'.format(ip))
        return ip

    @redirect_login_or_code
    def create_flavor(self):
        """创建规格"""
        CREATE_FLAVOR = "http://{}/awstack-resource/v1/flavor".format(GetModel.awcloud_ip())

        q.put({"type": "云平台", "speed_p": "stop", "percentage": "49"})
        resp = requests.post(CREATE_FLAVOR, data=json.dumps(flavor_info), headers=self.append_headers(), verify=False)
        js_data = resp.json()
        current_app.logger.info('create flavor return data: {}'.format(js_data))
        if js_data['code'] == '02013201':
            d = requests.get("http://{}/awstack-resource/v1/flavors"
                             .format(GetModel.awcloud_ip()), headers=self.headers, verify=False)
            for i in d.json()['data']['data']:
                if i['name'] == 'panacube3.0':
                    return {"id": i['id']}
        return js_data

    @redirect_login_or_code
    def get_sds_partitions(self):
        import copy
        url = 'http://{}/awstack-user/v1/region/FFFFF/ceph'.format(GetModel.awcloud_ip())
        headers = copy.deepcopy(self.headers)
        headers['X-Register-Code'] = 'FFFFF'
        resp = requests.get(url, headers=headers, verify=False)
        resp_data = resp.json()
        if resp_data['code'] == '02120701':
            raise ValueError('获取osd tree信息失败')
        return resp_data

    @redirect_login_or_code
    def upload_image(self, path, _type="bigdata"):
        """
        上传镜像
        :param path: 镜像path
        :param name: 镜像名字
        :param _t:   镜像类型
        :param size: 镜像大小
        :return:
        """
        UPLOAD_IMAGE = "http://{}/awstack-resource/v1/uploadimagez".format(GetModel.awcloud_ip())

        self.create_project()
        image_data = {
            'file': ('demo.iso', open(path, 'rb')),
            "videoQueue": "false",
            "qemu": "false",
            "diskCtrl": "false",
            "disk_format": "qcow2",
            "architecture": "x86_64",
            "os_distro": "CentOS X64",
            "os_type": "Linux",
        }
        if _type == "bigdata":
            image_data.update(
                name="智能存储镜像",
                vol_size="3",
                is_public="true",
                minimum_disk="3"
            )
        else:
            image_data.update(
                name="panacube3.0",
                vol_size="2",
                is_public="false",
                minimum_disk="2"
            )
        m = MultipartEncoder(fields=image_data, boundary='---------------------------7de1ae242c06ca')
        _headers = self.append_headers()
        m = MultipartEncoderMonitor(m)
        _headers["Content-Type"] = m.content_type
        resp = requests.post(UPLOAD_IMAGE, data=m, headers=_headers, verify=False)

        return resp.json()

    def update_image_info(self, image_id):
        current_app.logger.info("storage image id: {}".format(image_id))
        url = 'http://{}/awstack-resource/v1/image/{}'.format(GetModel.awcloud_ip(), image_id)
        request_data = {"name": "智能存储镜像", "disk_format": "qcow2", "architecture": "x86_64", "os_version": None,
                        "os_type": "Linux", "os_distro": "CentOS X64", "is_public": True, "is_protected": False,
                        "imageUid": "a5eb23fb-0b3b-4cb2-b4ce-5886b191994c", "vol_size": "10", "minimum_disk": "10",
                        "hw_disk_bus": "scsi", "hw_video_model": "vga", "hw_vif_model": "virtio",
                        "hw_qemu_guest_agent": "true", "hw_boot_menu": "false", "hw_vif_multiqueue_enabled": "false"}
        headers = self.headers
        headers['Content-Type'] = 'application/json;charset=UTF-8'
        resp = requests.put(url, data=json.dumps(request_data), headers=headers, verify=False)
        current_app.logger.info("update storage image info: {}".format(resp.json()))
        return resp.json()

    def run(self):
        q.put({"type": "云主机部署", "percentage": "37", "speed": "conducting", "size": "上传大小"})
        url = "http://{}/awstack-resource/v1/server".format(GetModel.awcloud_ip())
        q.put({"type": "云主机部署", "size": "上传大小", "speed": "conducting", "percentage": "{}".format(generate_random(37, 58))})
        self.create_project()
        flavor_id = self.create_flavor()['id']
        q.put({"type": "云主机部署", "size": "上传大小", "speed": "conducting", "percentage": "{}".format(generate_random(59, 71))})
        current_app.logger.info("flavor ID: {}".format(flavor_id))

        server_info = {
            "admin_pass": "",
            "name": "panacube3",
            "hostname": "panacube3",
            "fixed_ip": GetModel.kvm_ip(),
            "count": 1,
            "network_id": GetModel.network_id(),
            "keypair_id": "",
            "use_local": False,
            "flavor": flavor_id,
            "security_id": self.get_security_group_id()['id'],
            "dataVolumes": [],
            "block_device_mapping": {"disk_bus": ""},  # 硬盘控制器映射
            "os_type": "linux",
            "image_id": GetModel.image_id(None),  # 镜像ID
            "volumeSize": 100,  # 硬盘大小
            "volume_type": self.get_volume_type()[0]['volumeTypeId']  # 硬盘ID
        }
        current_app.logger.info("create cloud info: {}".format(server_info))
        resp = requests.post(url, data=json.dumps(server_info), headers=self.append_headers(), verify=False)
        current_app.logger.info('create cloud return data: {}'.format(resp.json()))
        if resp.json()['code'] == '02010303':
            raise ValueError("创建云主机所选规格不足")
        current_app.logger.info('创建云主机{}'.format(resp.json()))
        q.put({"type": "云主机部署", "size": "上传大小", "speed": "conducting",
               "percentage": "{}".format(generate_random(72, 80))})
        with open('/usr/local/udsafe/automatedkvm.txt', 'w') as f:
            f.write(GetModel.kvm_ip())
        return resp.json()


class Panacube(object):

    def get_token(self):
        panacube_ip = "http://" + GetModel.panacube_ip()
        url = '{}/v1/management/login/'.format(panacube_ip)
        username, password = GetModel.account()
        current_app.logger.info('panacube登录username={}, password={}'.format(username, password))
        if username and password:
            try:
                resp = requests.post(
                    url,
                    data={
                        "username": username,
                        "password": password
                    },
                    verify=False
                )
            except Exception as e:
                raise e
            current_app.logger.info(resp.json())
            return resp.json().get('data').get('token')
        current_app.logger.error('参数有误--->username={}, password={}'.format(username, password))
        return {'code': 1, 'message': '参数有误--->username={}, password={}'.format(username, password)}

    def get_node(self):
        panacube_ip = "http://" + GetModel.panacube_ip()
        ip_data = []
        url = '{}/v1/monitor/undefined/TubePhyHost/'.format(panacube_ip)
        get_token = self.get_token()
        if 'code' in get_token and get_token['code'] == 1:
            return get_token
        resp = requests.get(url, headers={"Authorization": 'TOKEN ' + self.get_token()}, verify=False)
        current_app.logger.info("get nodes info: {}".format(resp.json()))
        for i in resp.json()['data']:
            ip_data.append({
                "node-name": i['hostName'],
                "ip": i['hostInfo']['ips']['br_mgmt']
            })
        return ip_data

    # def upload_images(self, path=None, size="3"):
    #     url = 'http://{}/v1/cloud/images/upload/'.format(GetModel.panacube_ip())
    #
    #     m = MultipartEncoder(fields={
    #         "name": "智能存储镜像",
    #         'file': ('demo.iso', open(path, 'rb')),
    #         "disk_format": "qcow2",
    #         "arch": "x86_64",
    #         "os_type": "Linux",
    #         "os_distro": "CentOS X64",
    #         "min_disk": size,
    #         "visibility": "public"
    #     }, boundary='---------------------------7de1ae242c06ca')
    #     _headers = {"Authorization": 'TOKEN ' + self.get_token()}
    #     m = MultipartEncoderMonitor(m)
    #     _headers["Content-Type"] = m.content_type
    #     _headers["PROJECT_NAME"] = 'admin'
    #     resp = requests.post(url, data=m, headers=_headers, verify=False)
    #     current_app.logger.info('upload storage image: {}'.format(resp.text))
    #     return resp.json()


if __name__ == '__main__':
    # print Panacube().upload_images()
    import os

    demo = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__)), ),
                        'image/Storage.qcow2')
    # print demo
    Panacube().upload_images(demo)
    # ClearAwCloud().run()
    # print manager().get_auth_header()
    # c = create_network("da914bd0-0dda-4efc-a747-93b6aa88e5af")
    # print c

    # g = create_security_group()
    # print g

    # l = ClearAwCloud()
    # l.create_project()
    # l.create_flavor()
    # _callback()
    # print l.create_private('192.168.4.32/21', '192.168.1.1'), '--'
    # print json.dumps(l.get_external_network())
    # print l.create_project()
    # storage_img = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__)), ),
    #                            'image/Storage-API-20190402.qcow2')
    # print l.upload_image(storage_img)
    # l.run()
    # print l.get_node_info()
    # print l.get_volume_type()[0]['volumeTypeId']
    # print l.get_security_group_id()
    # set_value('panacube_img_id', '05e28317-2a8e-41ce-8c8c-a8ec1774be9c')
    # l.run()
    # print l.get_network_card('192.168.6.220')
