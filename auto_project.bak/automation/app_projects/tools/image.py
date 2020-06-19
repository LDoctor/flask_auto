#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-9-25 下午3:34
# @Author  : nan
# @File    : image.py

import os
import shutil
import time

from flask import current_app

from app_projects.models.model import ParamsData as model
from app_projects.tools.file_path import PathDir, GetModel
from app_projects.tools.utils import generate_random
from app_projects.tools.cloud import Panacube, push_message, ClearAwCloud
from app_projects.tools.sqlite_queue import q


move_storage_code = """

"""


def kvm_image_upload():
    """
    上传panacube镜像  需要2.0的账号密码
    :return:
    """
    id2 = ClearAwCloud(GetModel.get_auth_header()).upload_image(PathDir.image_path(None), 'panacube3.0')
    q.put({"type": "镜像上传", "size": "上传大小", "speed": "conducting", "percentage": "{}".format(generate_random(4, 15))})
    current_app.logger.info('upload kvm image: {}'.format(id2))
    model.update_or_create('panacube_img_id', id2['id'])
    q.put({"type": "镜像上传", "size": "上传大小", "speed": "conducting", "percentage": "{}".format(generate_random(16, 32))})


def update_storage_image():
    """
    更新智能存储镜像
    :return:
    """
    q.put({"type": "镜像上传", "size": "上传大小", "speed": "conducting", "percentage": "{}".format(generate_random(1, 6))})
    if GetModel.deploy_type() == 'kvm':
        awcloud = ClearAwCloud(GetModel.get_auth_header())
        q.put({"type": "镜像上传", "size": "上传大小", "speed": "conducting", "percentage": "{}".format(generate_random(17, 36))})
        image_obj = awcloud.upload_image(PathDir.image_path())
        print '上传的镜像信息: %s' % image_obj
        image_id = image_obj['id']
        q.put({"type": "镜像上传", "size": "上传大小", "speed": "conducting", "percentage": "{}".format(generate_random(38, 52))})
        model.update_or_create('storage_img_id', image_id)
        q.put({"type": "镜像上传", "size": "上传大小", "speed": "conducting", "percentage": "{}".format(generate_random(57, 78))})
        f = l = 79
        while True:
            resp = awcloud.update_image_info(image_id)
            f += 4
            l += 10
            if l >= 90:
                q.put({"type": "镜像上传", "size": "上传大小", "speed": "conducting", "percentage": "{}".format(generate_random(f, l))})
            else:
                f -= 2
                l -= 3
                q.put({"type": "镜像上传", "size": "上传大小", "speed": "conducting", "percentage": "{}".format(generate_random(f, l))})
            if resp.get('status') != 415:
                if resp['code'] == '0':
                    current_app.logger.info('update storage image property successful')
                else:
                    current_app.logger.info('update storage image property fail')
                break
            else:
                time.sleep(2)
        os.system("sh {set_tag} {openstack} {id}".format(
            set_tag=PathDir.tag_shell_path(),
            openstack=PathDir.openstack(),
            id=image_id
        ))
    else:
        awcloud = ClearAwCloud(GetModel.get_auth_header())
        q.put({"type": "镜像上传", "size": "上传大小", "speed": "conducting", "percentage": "23"})
        model.update_or_create('awcloud_ip', GetModel.awcloud_ip())
        q.put({"type": "镜像上传", "size": "上传大小", "speed": "conducting", "percentage": "48"})
        image_id = awcloud.upload_image(PathDir.image_path()).get('id')
        q.put({"type": "镜像上传", "size": "上传大小", "speed": "conducting", "percentage": "{}".format(generate_random(56, 88))})
        model.update_or_create('storage_img_id', image_id)
        while True:
            resp = awcloud.update_image_info(image_id)
            if resp.get('status') != 415:
                if resp['code'] == '0':
                    current_app.logger.info('update storage image property successful')
                else:
                    current_app.logger.info('update storage image property fail')
                break
            else:
                time.sleep(2)
        os.system("sh {set_tag} {openstack} {id}".format(
            set_tag=PathDir.tag_shell_path(),
            openstack=PathDir.openstack(),
            id=image_id
        ))
    from app_projects.deploy.get_config import move_storage_code
    storage_code_name = move_storage_code()
    node_list = os.popen("consul members | awk '{ print $1 }'").read().split('\n')[1:-1]
    for item in node_list:
        os.system("scp -r /var/deploy/%s %s:/usr/local/udsafe/%s" % (storage_code_name, item, storage_code_name))
        q.put({"type": "镜像上传", "size": "上传大小", "speed": "conducting", "percentage": "{}".format(generate_random(89, 96))})
