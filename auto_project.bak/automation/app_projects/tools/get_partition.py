#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-10-9 下午4:17
# @Author  : nan
# @File    : get_partition.py


import os

import paramiko
# from app_projects.tools.ssh_open import ssh_popen_1


def ssh_popen_1(host, cmd, port=22, hostname='root'):
    p = '/home/nan/.ssh/66.11'
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    # ssh.connect(host, port, hostname, key_filename=PathDir.awlcoud_idrsa())
    ssh.connect(host, port, hostname, key_filename=p)
    stdin, stdout, stderr = ssh.exec_command(cmd)
    return stdout.read().decode().strip()


def get_sds_partitions(ip):
    """
    获取所有的物理磁盘地址、不包括scsi接口移动的硬盘
    :return:
    """
    rest_list = []
    usb_dev = ssh_popen_1(ip, "lsscsi | egrep 'Kingston | SanDisk | My Passport 261B'")
    if usb_dev:
        not_dev_path = usb_dev.split(' ')[-1].split('/')[-1]
    rest = ssh_popen_1(ip, 'ls /dev/disk/by-id/')
    for item in rest.split('\n'):
        abs_path = 'readlink -f /dev/disk/by-id/' + item
        link_path = ssh_popen_1(ip, abs_path)
        if usb_dev is not True:
            if link_path.strip('../dev').startswith('sd'):
                rest_list.append(dict(dev=link_path.strip('../'), file_id=abs_path))
        else:
            if link_path.strip('../').startswith('sd') and not_dev_path not in link_path.strip('../'):
                rest_list.append(dict(dev=link_path.strip('../'), file_id=abs_path))
    return rest_list


if __name__ == '__main__':
    print get_sds_partitions('192.168.66.12')

