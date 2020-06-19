#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-5-17 下午5:44
# @Author  : nan
# @File    : ssh_open.py

import os
import commands
import paramiko
import pexpect

from flask import current_app

from app_projects.tools.file_path import PathDir


def get_cmd(cmd):
    _, r = commands.getstatusoutput(cmd)
    return r


def ssh_popen_1(host, cmd, port=22, hostname='root'):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, port, hostname, key_filename=PathDir.awlcoud_idrsa())
    stdin, stdout, stderr = ssh.exec_command(cmd)
    return stdout.read().decode().strip()


def auto_code(ssh, code_key, _type='p'):
    """

    :param ssh: ssh对象
    :param code_key: 执行结果状态吗
    :param _type: p / y  p为密码验证 y为yes
    :return:
    """
    if code_key == 1:
        if _type == 'p':
            ssh.sendline('udsafe\n')
        elif _type == 'y':
            ssh.sendline('yes\n')
        index = ssh.expect(["#", pexpect.EOF, pexpect.TIMEOUT])
    else:
        index = ssh.expect(["#", pexpect.EOF, pexpect.TIMEOUT])

    if index == 0:
        current_app.logger.info('logging error connect')
    elif index == 1:
        current_app.logger.info("上传3.0项目成功!")
    elif index == 2:
        current_app.logger.info("logging timeout exit")


def y_ssh(cmd):
    # ssh = pexpect.spawn('scp -r {project_path} root@{panacube_ip}:/home/udsafe/'.format(
    #         project_path=project_path,
    #         panacube_ip=get_values('data', 'data').get('panacube').get('panacube_ip')
    #         )
    #     )
    ssh = pexpect.spawn(cmd)
    ssh.logfile = open('log.txt', 'w')
    # code_key = ssh.expect([pexpect.TIMEOUT,'continue connecting (yes/no)?'], timeout=3)
    code_pw = ssh.expect([pexpect.TIMEOUT, 'password:'], timeout=3)
    auto_code(ssh, code_pw)

    # if index == 0:
    #     current_app.logger.info('上传3.0项目成功')
    # elif index == 1:
    #     current_app.logger.info("logging process exit!")
    # elif index == 2:
    #     current_app.logger.info("logging timeout exit")


if __name__ == '__main__':
    y_ssh('ls')
