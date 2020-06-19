#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-9-25 下午4:09
# @Author  : nan
# @File    : env_deploy.py

import os
import time
import json

from app_projects.deploy.get_config import config, get_all_path, create_influxdb
from app_projects.tools.bigdata import push_bigdata_db
from app_projects.tools.cloud import ClearAwCloud
from app_projects.tools.ssh_open import get_cmd, ssh_popen_1
from app_projects.tools.file_path import PathDir, GetModel
from app_projects.tools.cloud import push_message
from app_projects.tools.sqlite_queue import q
from app_projects.tools.utils import generate_random
from flask import current_app


# mariadb_con = """
# ssh -i {id_rsa} root@{panacube_ip} -o stricthostkeychecking=no <<EOF
# sed -i '3a\skip-name-resolve' /etc/my.cnf
# sed -i '3a\\\nameserver 192.168.1.1' /etc/resolv.conf
# EOF
# """

# 重启数据库
restart_mariadb = """
ssh -i {id_rsa} root@{panacube_ip} -o stricthostkeychecking=no <<EOF
systemctl restart mariadb
EOF
"""

# 重启所有的服务
restart_supervisord_all = """
ssh -i {id_rsa} root@{panacube_ip} -o stricthostkeychecking=no <<EOF
supervisorctl update
supervisorctl restart all
EOF
"""

# 更新数据库 导入数据库sql
update_db = """
ssh -i {id_rsa} root@{panacube_ip} -o stricthostkeychecking=no <<EOF
mysql -u udsafe -pudsafe <<EFo
use panacube;
source /home/udsafe/projects/panacube/sqls/{sql_name};
EFo
EOF
"""

# 数据智能存储的类型
set_bigdata_type = """
ssh -i {id_rsa} root@{panacube_ip} -o stricthostkeychecking=no <<EOF
mysql -u udsafe -pudsafe <<EFo
use panacube;
delete from param_setting where param_name=\'gateway_system\';
insert into param_setting(param_name, param_value, description, level, update_time, parent_id) values('gateway_system', '{gateway_system}', null, 1, '0000-00-00 00:00:00.000000', null);
EFo
EOF
"""

del_param_name = """
ssh -i {id_rsa} root@{panacube_ip} -o stricthostkeychecking=no <<EOF
mysql -u udsafe -pudsafe <<EFo
use panacube;
delete from param_setting where param_name=\'bigdata\' or param_name=\'node\' or param_name=\'panaocs\';
EFo
EOF
"""

update_pip_packages = """
ssh -i {id_rsa} root@{panacube_ip} -o stricthostkeychecking=no <<EOF
source /home/udsafe/venv/py36/bin/activate
cd /home/udsafe/projects/panacube
pip install -r requirements.txt --no-index --find-links=./packages
EOF
"""


def deploy_docker():
    """
    docker升级
    :return:
    """
    create_influxdb()
    from app_projects.deploy.get_config import copy_template
    copy_template()
    os.system('nomad stop saas-container')
    q.put({"type": "Docker升级", "speed": "stop", "percentage": "{}".format(2)})
    node_list = os.popen("consul members | awk '{ print $1 }'").read().split('\n')[1:-1]
    f = l = 13
    for item in node_list:
        if l >= 87:
            f += (100 - 13) / len(node_list) - 5
            l += (100 - 13) / len(node_list) + 5
        q.put({"type": "Docker升级", "speed": "stop", "percentage": "{}".format(generate_random(f, l))})
        ssh_popen_1(item, 'docker rmi panacube:3.0')
        os.system('scp {docker_path} {node}:/var/admin'.format(
            docker_path=PathDir.docker_path(),
            node=item
        ))
        ssh_popen_1(item, 'cd /var/admin && docker load -i {}'.format(config.get('version').get('dockerImage')))
    # 启动docker镜像
    os.system('nomad  run  /etc/kolla/nomad/saas-container.hcl')


def deploy_kvm(update=False):
    """
    部署虚拟机
    :return:
    """
    print update, '正在执行操作'
    if update is False:
        panacube_ip = GetModel.kvm_ip()
    else:
        with open('/usr/local/udsafe/automatedkvm.txt', 'r') as f:
            panacube_ip = f.read()

    if update is False:
        awcloud_obj = ClearAwCloud(GetModel.get_auth_header())
        q.put({"type": "云主机部署", "speed": "conducting", "percentage": "{}".format(generate_random(33, 37))})
        res_data = awcloud_obj.run()  # 创建云主机
        if res_data['code'] != u'0':
            return json.dumps({"code": 1, 'message': res_data['message']})

    # 替换配置文件ip
    if update is True:
        parent_speed = 98
        _type = '云主机升级'
    else:
        parent_speed = 86
        _type = '云主机部署'

    q.put({"type": _type, "speed": "conducting", "percentage": "{}".format(generate_random(81, 86))})
    is_docker = get_cmd("cat {} | grep 'IS_DOCKER = ' | grep -v os".format(PathDir.local_settings())).split('=')[-1]
    os.system("""sed -i "s/{}/ {}/" {file}""".format(
        is_docker, "False", file=PathDir.local_settings()
    ))

    saas_ip = get_cmd("cat {} | grep 'SAAS_IP = ' | grep -v os".format(PathDir.local_settings())).split('= ')[-1]
    os.system("""sed -i "s/{}/{}/" {file} | grep -v os""".format(saas_ip, "\\'{}\\'".format(GetModel.awcloud_ip()), file=PathDir.local_settings()))

    mysql_ip = get_cmd("cat {} | grep 'MYSQL_IP = ' | grep -v open".format(PathDir.local_settings()))
    os.system("""sed -i "s/{}/    MYSQL_IP = {}/" {file} | grep -v os""".format(mysql_ip, "\\'{}\\'".format(panacube_ip), file=PathDir.local_settings()))

    mysql_port = get_cmd("cat {} | grep 'MYSQL_PORT = ' | grep -v os".format(PathDir.local_settings())).split('= ')[-1]
    os.system("""sed -i "s/{}/{}/" {file}""".format(
        mysql_port, 3306, file=PathDir.local_settings()
    ))
    if update is False:
        cloud_id = res_data.get('data').get('data')[0]
        f = l = 86
        while True:
            if l >= 97:
                f -= 7
                l -= 15
            else:
                f += 7
                l += 15
            if l == f:
                f -= 3
            d = generate_random(f, l)
            if d > parent_speed:
                parent_speed = d
            if parent_speed > 100:
                parent_speed = 98
            q.put({"type": "云主机部署", "speed": "conducting", "percentage": "{}".format(parent_speed)})
            current_app.logger.info('正在等待虚拟机启动')
            if awcloud_obj.get_cloud_status(cloud_id) is True:
                current_app.logger.info('虚拟机启动成功')
                break
            time.sleep(3)

    chmod_id_rsa = 'chmod 600 {id_rsa}'.format(id_rsa=PathDir.panacube_idrsa())
    os.system(chmod_id_rsa)
    # 添加mysql配置文件
    # append_mariadb = mariadb_con.format(id_rsa=PathDir.panacube_idrsa(), panacube_ip=panacube_ip)
    # os.system(append_mariadb)
    copy_panacube = "scp -i {id_rsa} -r {project_path} root@{panacube_ip}:/home/udsafe/".format(id_rsa=PathDir.panacube_idrsa(), project_path=PathDir.project_path(), panacube_ip=panacube_ip)
    time.sleep(60)
    os.system(copy_panacube)
    # 重启mariadb
    os.system(restart_mariadb.format(id_rsa=PathDir.panacube_idrsa(), panacube_ip=panacube_ip))
    # 更新数据库
    os.system(update_db.format(id_rsa=PathDir.panacube_idrsa(), panacube_ip=panacube_ip, sql_name=config.get('pancube_sql')['sql_name']))
    if 'TrueOS' in get_all_path()['bigdataPath']:
        gateway_system = 'FreeBSD'
    else:
        gateway_system = 'CentOS'
    # os.system(del_param_name.format(id_rsa=PathDir.panacube_idrsa(), panacube_ip=panacube_ip))
    os.system(set_bigdata_type.format(id_rsa=PathDir.panacube_idrsa(), panacube_ip=panacube_ip, gateway_system=gateway_system))
    print '更新3.0 packages安装包'
    os.system(update_pip_packages.format(id_rsa=PathDir.panacube_idrsa(), panacube_ip=panacube_ip))
    print 'pip 安装结束'
    # 重启服务
    os.system(restart_supervisord_all.format(id_rsa=PathDir.panacube_idrsa(), panacube_ip=panacube_ip))
    # if update is False:
    # 更新数据库
    # os.system(update_db.format(id_rsa=PathDir.panacube_idrsa(), panacube_ip=panacube_ip))
    if update is False:
        # 添加消息推送
        push_message()
        # 添加大数据配置
        push_bigdata_db()


if __name__ == '__main__':
    id_rsa_path = os.path.join(
        os.path.dirname(
            os.path.dirname(
                os.path.abspath(__file__)
            )
        ), 'conf/id_rsa'
    )
