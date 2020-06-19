#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 19-4-10 下午5:49
# @Author  : nan
# @File    : create_cloud.py

import json
import os
import sys
import base64
from thread import start_new_thread

from app_projects.tools.bigdata import push_bigdata_db, deploy_bigdata

sys.path.append("{}/flask_packages".format(sys.path[0]))
from flask import current_app
from flask import Response, request, Blueprint

from app_projects.tools.get_awcloud_img import AWCloudManage
from app_projects.tools.get_U import get_usb_info, verify_usb, get_usb_mount
from app_projects.tools.cloud import ClearAwCloud, Panacube, push_message
from app_projects.tools.get_network_card import get_not_exits_network_card, get_system_info
from app_projects.tools.file_path import GetModel
from app_projects.models.model import ParamsData as model
from app_projects.tools.sqlite_queue import q


mod = Blueprint('create_cloud', __name__)
"""
{"type": "镜像上传"， size: "上传大小", "speed_p": start/stop/conducting， "percentage": "100" }

"""
default_dict = {}


@mod.route('/message_code/')
def return_code():
    try:
        print('message_code function')
        t = q.get_nowait()
        if t is None:
            return json.dumps({'code': 1})
        return json.dumps({"data": t, "code": 0})
    except Exception as e:
        print('q.get_nowait Error')
        print(str(e))
        print('xx' * 30)
        return json.dumps({'code': 1})


def deployment_complete():
    """
    查哪些部署完成
    :return:
    """
    if not os.path.exists('/usr/local/udsafe/automatedDeployment.txt'):
        if not os.path.exists('/usr/local/udsafe'):
            os.makedirs('/usr/local/udsafe')
            os.chdir('/usr/local/udsafe')
            os.system('touch automatedDeployment.txt')
    os.chdir('/usr/local/udsafe')
    with open('/usr/local/udsafe/automatedDeployment.txt', 'w') as f:
        f.write(json.dumps(default_dict))


@mod.route('/node/')
def get_node_info():
    """
    获取所有的node节点信息 
    :return:
    """
    if GetModel.deploy_type() == 'kvm':
        headers = GetModel.get_auth_header()
        return json.dumps({"code": 0, "data": ClearAwCloud(headers).get_node_info()})
    else:
        return json.dumps({"code": 0, "data": Panacube().get_node()})


@mod.route('/verify_pw/', methods=['POST', 'GET'])
def verify_code_img():
    """
    获取和验证验证码 -> 验证连通性
    :return:
    """
    if request.method == 'POST':
        r_data = request.json
        model.update_or_create('username', r_data.get('username'))
        model.update_or_create('password', base64.b64decode(r_data.get('password')))
        manager = AWCloudManage(r_data.get('code_key'), r_data.get('code'))
        login_data = manager._login()
        if login_data['code'] != 0:
            return json.dumps(login_data)
        model.update_or_create('get_auth_header', manager.get_auth_header())
        return json.dumps({'code': 0})


@mod.route('/network_card_info/', methods=["GET"])
def get_network_card():
    """
    返回字段static 网卡状态
    mac_address mac地址
    speed       网卡兆数
    network_name 网卡名字
    :return:
    """
    if request.method == 'GET':
        ip = request.args.get('ip')
        data = get_not_exits_network_card(ip)
        return json.dumps({"code": 0, "exits_network_name": data})


@mod.route('/get_system_node/', methods=["GET", "POST"])
def get_or_set_system_info():
    if request.method == 'GET':
        """
            字符串拼接ip=192.168.102.91
            返回对应服务器的数据
        """
        ip = request.args.get("ip")
        data =get_system_info(ip)
        print 'cpu总数: ', GetModel.cpu_count()
        return json.dumps({"code": 0, "data": data})

    elif request.method == 'POST':
        """
        设置节点信息
        # _ = [{
        #     bigdata: 2
        #     cpu: 2
        #     ip: "192.168.66.11"
        #     mem: 2
        #     netmask: "255.255.255.0"
        #     network_ip: "192.168.56.66"
        #     network_name: "eno3"
        #     node-name: "node-1"
        # }]
        """
        r_data = request.json
        current_app.logger.info("server accept node data: {}".format(r_data))
        node_obj = r_data['node']
        print '接受node节点数据', node_obj
        for item in node_obj:
            if isinstance(item, list):
                return json.dumps({"code": 1, 'message': '数据有误'})
        current_app.logger.info(r_data)
        model.update_or_create('node', json.dumps(node_obj))
        return json.dumps({"code": 0, 'message': 'Successful'})


@mod.route('/panacube/', methods=["POST", "GET"])
def accept_info():
    """
    获取获取2.0或者3.0的账号密码 -> GET获取外部网络信息
    # {
    #     "awcloud_ip": "",
    #     "username": "1",
    #     "password": "2",
    #     "panacube_ip": 3
    # }
    :return:
    """
    if request.method == "GET":
        r_data = ClearAwCloud(GetModel.get_auth_header()).get_external_network()
        if 'code' in r_data:
            return json.dumps({'code': 1})
        return json.dumps({'data': r_data, 'code': 0})

    r_data = request.json
    model.update_or_create('panacube', r_data)
    return json.dumps({"code": 0, 'message': 'Successful'})


@mod.route('/verify_ip/', methods=['GET'])
def verify_ip():
    """
    验证ip是否可用
    :return:
    """
    ip = request.args.get("ip")
    network_id = request.args.get("network_id")
    model.update_or_create('network_id', network_id)
    model.update_or_create('kvm_ip', ip)
    data = ClearAwCloud(GetModel.get_auth_header()).get_network_card(ip, network_id)
    return json.dumps({"code": 0, "data": data})


@mod.route('/usb/', methods=["GET", "POST"])
def get_usb():
    """
    获取usb信息
    :return:
    """
    model.update_or_create('u_path', '/mnt')
    if request.method == "POST":
        # _ = {
        #     "usb": "",
        #     "message": ""
        # }
        data = request.json
        d = os.popen("which sdparm").read().strip("\n")
        if not d:
            return json.dumps({"code": 1, "message": "没有安装sdparm包 "})
        else:
            if data.get("usb_id", None) and data.get('lsscsi_id'):
                if verify_usb(data.get('lsscsi_id'), data.get('usb_id')):
                    get_usb_mount(data.get('lsscsi_id'))
                    return json.dumps({'code': 0, 'message': 'Successful'})
                return json.dumps({'code': 1, 'message': 'U盘数据验证不通过'})
            return json.dumps({"code": 1, "message": "参数有误"})
    return json.dumps(get_usb_info())


@mod.route('/upload_storage_image/', methods=['POST'])
def upload_storage_image():
    from app_projects.tools.image import update_storage_image
    q.put({"type": "镜像上传", "size": "上传大小", "speed": "start", "percentage": "0"})
    update_storage_image()
    q.put({"type": "镜像上传", "size": "上传大小", "speed": "stop", "percentage": "100"})
    global default_dict
    default_dict['upload_storage_image'] = 'yes'
    deployment_complete()
    return json.dumps({"code": 0, 'message': 'Successful'})


@mod.route('/deploy_docker/', methods=["POST"])
def deplot_docker_env():
    q.put({"type": "Docker升级", "size": "上传大小", "speed": "start", "percentage": "0"})
    from app_projects.tools.env_deploy import deploy_docker
    deploy_docker()
    q.put({"type": "Docker升级", "size": "上传大小", "speed": "stop", "percentage": "100"})
    push_message()
    global default_dict
    default_dict['deploy_docker'] = 'yes'
    deployment_complete()
    return json.dumps({"code": 0, 'message': 'Successful'})


@mod.route('/deploy_cloud/', methods=["POST"])
def create_cloud():
    """
    创建云平台
    :return:
    """
    from app_projects.tools.image import kvm_image_upload
    q.put({"type": "云主机部署", "size": "上传大小", "speed": "start", "percentage": "{}".format(0)})
    kvm_image_upload()
    from app_projects.tools.env_deploy import deploy_kvm
    deploy_kvm()

    global default_dict
    if 'bigData' in default_dict:
        push_bigdata_db()
    default_dict['cloudPlatform'] = 'yes'
    deployment_complete()
    w_kvm = {
        'ip': GetModel.kvm_ip()
    }
    q.put({"type": "云主机部署", "size": "上传大小", "speed": "stop", "percentage": "{}".format(100)})
    return json.dumps({"code": 0, 'message': 'Successful'})


@mod.route('/update_cloud/', methods=['POST'])
def update_cloud():
    q.put({"type": "云主机升级", "size": "上传大小", "speed": "stop", "percentage": "{}".format(6)})
    from app_projects.tools.env_deploy import deploy_kvm
    deploy_kvm(True)
    q.put({"type": "云主机升级", "size": "上传大小", "speed": "stop", "percentage": "{}".format(100)})
    return json.dumps({"code": 0, 'message': 'Successful'})


@mod.route('/deploy_bigdata/', methods=["POST"])
def start_bigdata():
    """
    开启大数据
    :return:
    """
    global default_dict
    q.put({"type": "大数据", "size": "上传大小", "speed": "start", "percentage": "{}".format(0)})
    deploy_bigdata()
    default_dict['bigData'] = 'yes'
    deployment_complete()
    q.put({"type": "大数据", "size": "上传大小", "speed": "start", "percentage": "{}".format(100)})
    return json.dumps({"code": 0, 'message': 'Successful'})


@mod.route('/verify_bigdata/', methods=['POST'])
def deploy_inspect():
    r_data = request.json
    inspect = r_data.get('inspect')
    if inspect == 'bigdata':
        if os.path.exists('/usr/local/udsafe/parent_bigdata_info'):
            with open('/usr/local/udsafe/parent_bigdata_info', "r") as f:
                data = json.loads(f.read())
            return json.dumps({"code": 0, 'message': "已经存在数据，是否接着部署", 'data': data})
        return json.dumps({"code": 0, 'message': 'Successful', 'data': []})
    return json.dumps({"code": 1, 'message': '参数有误'})


@mod.route('/deploy_separate_bigdata/', methods=['GET', 'POST'])
def deploy_separate_bigdata():
    if request.method == "GET":
        """
            get获取所有的物理磁盘、排除当前移动硬盘
        """
        headers = GetModel.get_auth_header()
        return json.dumps({"data": ClearAwCloud(headers).get_sds_partitions(), "code": 0})
    # else:
    #     """
    #         dev_path为物理磁盘对应文件路径名称 类型为list
    #     """
    #     data = request.json
    #     if 'dev_path' in data and isinstance(data.get('dev_path'), list):
    #         model.update_or_create('dev_path', ','.join(data.get('dev_path')))
    #         return json.dumps({'code': 0, 'message': 'Successful'})
    #     return json.dumps({'code': 1, 'message': '缺少必要参数`dev_path`或数据类型有误'})


@mod.route('/deploy_status/', methods=["GET"])
def search_status():
    """
    查询部署状态
    :return:
    """
    if os.path.exists('/usr/local/udsafe/automatedDeployment.txt'):
        with open('/usr/local/udsafe/automatedDeployment.txt', 'r') as f:
            data = json.loads(f.read())
        if not data:
            data = {}
        return json.dumps({"data": json.dumps(data)})
    return json.dumps({"data": []})


@mod.route('/deploy_type/', methods=["POST"])
def start_deploy():
    # 数据的类型  kvm还是docker
    _type = request.json.get('type')
    if _type == 'docker':
        model.update_or_create('type', _type)
    elif _type == 'kvm':
        model.update_or_create('type', _type)
    else:
        return json.dumps({'code': 1, 'message': "数据类型有误"})
    return json.dumps({"code": 0, 'message': 'Successful'})


@mod.route('/update_db/', methods=['POST'])
def update_db():
    if os.path.exists("/usr/local/udsafe/automatedkvm.txt"):
        with open('/usr/local/udsafe/automatedkvm.txt', 'r') as f:
            ip = f.read()
        model.update_or_create('kvm_ip', ip)
    push_bigdata_db()
    return json.dumps({"code": 0, 'message': 'Successful'})


@mod.route('/block/', methods=['POST'])
def block():
    if str(GetModel.deploy_type()) == 'kvm':
        if os.path.exists('/usr/local/udsafe/automatedkvm.txt'):
            with open('/usr/local/udsafe/automatedkvm.txt', 'r') as f:
                kvm_ip = f.read()
            return json.dumps({'ip': kvm_ip})
        else:
            w_kvm = {
                'ip': GetModel.kvm_ip()
            }
            os.system('mkdir -p /usr/local/udsafe/')
            with open('/usr/local/udsafe/automatedkvm.txt', 'wb') as f:
                f.write(GetModel.kvm_ip())
            return json.dumps(w_kvm)
    else:
        return json.dumps({'ip': GetModel.panacube_ip()})
