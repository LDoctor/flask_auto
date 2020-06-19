#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-4-19 下午2:56
# @Author  : nan
# @File    : get_U.py

from __future__ import print_function
import os
from flask import current_app

from app_projects.tools.ssh_open import get_cmd
from app_projects.tools.file_path import PathDir
from app_projects.models.model import ParamsData as model


def exchange_mask(mask):
    # 计算二进制字符串中 '1' 的个数
    count_bit = lambda bin_str: len([i for i in bin_str if i == '1'])
    # 分割字符串格式的子网掩码为四段列表
    mask_splited = mask.split('.')
    # 转换各段子网掩码为二进制, 计算十进制
    mask_count = [count_bit(bin(int(i))) for i in mask_splited]
    return sum(mask_count)


def verify_usb(lsscsi_id, usb_id):
    """
    验证硬盘ID
    :param lsscsi_id: lsscsi查询对应的ID
    :param usb_id: 硬盘ID
    :return:
    """
    from app_projects.tools.get_privkey import key_verify
    current_app.logger.info(key_verify(usb_id))
    return key_verify(usb_id)


def get_usb_mount(lsscsi_id):
    cmd = "lsscsi | grep '{id}'".format(id=lsscsi_id.strip('[]'))
    dev_path = get_cmd(cmd).split(' ')[-2]
    current_app.logger.info("get usb dev path: {}".format(dev_path))
    # 如果挂在则能拿到路径、否则去挂载
    mount_num = 0
    u_path = get_cmd('mount | grep {}'.format(dev_path))
    if u_path:
        current_app.logger.info({'code': 1, 'message': '该U盘已被挂载'})
        current_app.logger.info('当前u盘挂在路径----{}'.format(u_path.split(' ')[2]))
        model.update_or_create('u_path', u_path.split(' ')[2])
        current_app.logger.info('-----model U盘地址-----{}'.format(model.get_params('u_path')))
        return True
    else:
        mount_num += 1
        get_cmd('sudo mount {usb}1 /mnt{num}'.format(usb=dev_path, num=mount_num))
        model.update_or_create('u_path', '/mnt{}'.format(mount_num))
        current_app.logger.info('-----model U盘地址-----{}'.format(model.get_params('u_path')))
        return True


def get_usb_info():
    """
    获取U盘信息
    :return:
    """
    data = []
    k_usb = get_cmd("lsscsi | egrep 'Kingston | SanDisk | My Passport 261B'")
    if not k_usb:
        raise ValueError('没有USB设备')
        # return {'code': 1, 'message': '没有找到要求的USB设备'}

    for item_usb in k_usb.split('\n'):
        k_id = item_usb.split(' ')[0].replace('[', '').split(':')[0]
        if os.path.exists('/proc/scsi/usb-storage/{}'.format(k_id)):
            r = get_cmd("cat /proc/scsi/usb-storage/{}".format(k_id))
            k_to_v = ','.join(r.split('\n')).replace(' ', '')
            d_data = {}
            for i in k_to_v.split(','):
                d_data['id'] = item_usb.split(' ')[0]
                d_data[i.split(':')[0]] = i.split(':')[1]
            data.append(d_data)
        else:
            r = get_cmd("sdparm -i {dev} | grep 'vendor specific: My Passport'"
                        .format(dev=item_usb.split(' ')[-2]))
            try:
                d_data = dict(SerialNumber=r.split('   ')[-2].split(' ')[-1],
                              id=item_usb.split(' ')[0],
                              Vendor=item_usb.split(' ')[-7] + item_usb.split(' ')[-6] + item_usb.split(' ')[-5]
                )
            except Exception as e:
                raise e
            data.append(d_data)
            cmd = "lsscsi | grep '{id}'".format(id=item_usb.split(' ')[0].strip('[]'))
            dev_path = get_cmd(cmd).split(' ')[-2]
            current_app.logger.info("get dev path {}".format(dev_path))
            u_path = get_cmd('mount | grep {}'.format(dev_path))
            model.update_or_create('u_path', u_path.split(' ')[2])
    os.system("chmod 600 {}".format(PathDir.panacube_idrsa()))
    return data


if __name__ == '__main__':
    # l = ssh_popen_1("192.168.102.91", "lsscsi | grep Kingston")
    # s = l.split(' ')
    # print s[0][1]
    # print ','.join(get_usb_info().split('\n')).replace(' ', '')
    # print get_usb_info()
    # print deploy_path

    # set_big_data()
    # get_usb_info()

    # print verify_usb('dsadsadas', '[5:0:0:0]')
    # get_usb_mount('[8:0:0:0]')
    pass
    get_usb_info()
