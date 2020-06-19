#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-7-3 下午6:10
# @Author  : nan
# @File    : start_project.py

import sys
import os
import shutil
import socket
import fcntl
import struct


def get_ip_address(ifname):
    '返回网卡ip地址'
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    ipaddr = socket.inet_ntoa(fcntl.ioctl(
        s.fileno(),
        0x8915,  # SIOCGIFADDR
        struct.pack('256s', ifname[:15])
    )[20:24])
    s.close()
    return ipaddr


def main():

    os.system("systemctl stop iptables.service")
    os.system("mkdir -p /var/log/socketServer")
    if os.path.exists('/var/admin/queue'):
        os.remove('/var/admin/queue')

    pwd = os.popen('pwd').read().split('\n')[0]
    print pwd
    if not os.path.exists(pwd):
        os.makedirs(pwd + '/projects')
    #不用版本太旧的waitress
    os.system('mv /usr/lib/python2.7/site-packages/waitress /usr/lib/python2.7/site-packages/waitress.bak')
    if os.path.exists('/var/automation'):
        shutil.rmtree('/var/automation')
        shutil.copytree(os.path.abspath(os.path.dirname(__file__)) + '/automation', '/var/automation')
    else:
        shutil.copytree(os.path.abspath(os.path.dirname(__file__)) + '/automation', '/var/automation')
    print os.popen('ls /var/automation/app_project').read().strip()

    print("""
    ===============================
                                   
            -开始启动项目-
          {}:5559 

    ===============================
    """.format(get_ip_address('br_mgmt')))
    os.system('python /var/automation/manage.py runserver')
    # os.system('python automation/manage.py runserver')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt as e:
        print(e)
    finally:
        try:
            os.system('rm -rf /var/automation.zip')
            if os.path.exists('/var/automation'):
                try:
                    shutil.rmtree('/var/deploy')
                except:
                    pass
            shutil.rmtree('/var/automation')
            node_list = os.popen("consul members | awk '{ print $1 }' | grep -v Node").read().split('\n')[1:-1]
            for item in node_list:
                os.system('ssh -T {node} rm -rf /var/deploy'.format(node=item))
                os.system('ssh -T {node} rm -rf /var/admin/panacube.tar'.format(node=item))
            os.system('mv /usr/lib/python2.7/site-packages/waitress.bak /usr/lib/python2.7/site-packages/waitress')
        except Exception as e:
            print(e)

