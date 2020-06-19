#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-9-25 下午6:45
# @Author  : nan
# @File    : file_path.py

import os
import json
from app_projects.models.model import ParamsData as model
from app_projects.deploy.get_config import get_all_path, defaultDeployPath


class GetModel(object):

    @staticmethod
    def awcloud_ip():
        p = os.popen('cat /etc/kolla/nomad/saas-container.hcl | grep SAAS_IP').read().replace(' ', '') \
            .replace('"', '').split('\n')[0].split('=')[1]
        return p

    @staticmethod
    def kvm_ip():
        return model.get_params('kvm_ip')

    @staticmethod
    def panacube_ip():
        if GetModel.deploy_type() == "docker":
            return open('/usr/local/bin/panacube-pipework.sh').readlines()[3].strip().split(' ')[-1]
        return GetModel.kvm_ip()

    @staticmethod
    def network_id():
        return model.get_params('network_id')

    @staticmethod
    def image_id(_type='storage'):
        if _type == 'storage':
            return model.get_params('storage_img_id')
        return model.get_params('panacube_img_id')

    @staticmethod
    def account():
        username, password = model.get_params('username'), model.get_params('password')
        return username, password

    @staticmethod
    def cpu_count():
        return int(model.get_params('count_cpu'))

    @staticmethod
    def get_privkey():
        return model.get_params('privkey')

    @staticmethod
    def get_node():
        try:
            return json.loads(model.get_params('node'))
        except:
            return model.get_params('node')

    @staticmethod
    def get_panaocs():
        return model.get_params('panaocs')

    @staticmethod
    def deploy_type():
        return model.get_params('type')

    @staticmethod
    def get_auth_header():
        data = model.get_params('get_auth_header')
        if data:
            return data
        from app_projects.tools.get_awcloud_img import AWCloudManage
        model.update_or_create('username', 'admin')
        model.update_or_create('password', 'P@ssw0rd')
        manager = AWCloudManage()
        manager._login()
        model.update_or_create('get_auth_header', manager.get_auth_header())
        return GetModel.get_auth_header()

    @staticmethod
    def u():
        return model.get_params('u_path')

    @staticmethod
    def dev_abs_path():
        return model.get_params('dev_path')


class PathDir(object):

    @staticmethod
    def auto_project():
        return '{u_path}/auto_project'.format(u_path=model.get_params('u_path'))

    @staticmethod
    def local_settings():
        return os.path.join(PathDir.auto_project(), 'projects/panacube/panacube/local_settings.py')

    @staticmethod
    def panacube_idrsa():
        return os.path.join(PathDir.auto_project(), 'conf', 'panacube_rsa')

    @staticmethod
    def awlcoud_idrsa():
        return os.path.join(PathDir.auto_project(), 'conf/awcloud_rsa')

    @staticmethod
    def project_path():
        return os.path.join(PathDir.auto_project(), 'projects')

    @staticmethod
    def docker_path():
        return get_all_path().get('dockerImagePath')

    @staticmethod
    def image_path(_type='storage'):
        if _type == 'storage':
            return get_all_path().get('bigdataPath')
        return get_all_path().get('kvmImagePath')

    @staticmethod
    def tag_shell_path():
        return os.path.join(PathDir.auto_project(), 'conf', 'tag', 'tag.sh')

    @staticmethod
    def openstack():
        return os.path.join(PathDir.auto_project(), 'conf', 'tag', 'tag.py')

    @staticmethod
    def prk(name):
        return os.path.join(PathDir.auto_project(), 'usb_verify', '{}.pem'.format(name))

    @staticmethod
    def deploy():
        # return os.path.join(PathDir.auto_project(), 'conf', 'deploy')
        # return '/var/deploy'
        return defaultDeployPath

    @staticmethod
    def install():
        return os.path.join(PathDir.auto_project(), 'automation/app_projects/deploy/install.py')

    @staticmethod
    def exclude_list():
        return os.path.join(PathDir.auto_project(), 'conf', 'exclude.list')
