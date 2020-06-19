#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-9-25 下午8:55
# @Author  : nan
# @File    : bigdata.py

import os
import time
import json
import shutil

from app_projects.models.model import ParamsData as model
from app_projects.tools.file_path import GetModel, PathDir
from app_projects.tools.get_U import exchange_mask
from app_projects.tools.get_network_card import set_system_info
from app_projects.tools.sqlite_queue import q
from app_projects.tools.ssh_open import ssh_popen_1
from app_projects.tools.utils import generate_random
from flask import current_app

del_param_name = """
mysql -u udsafe -pudsafe <<EOF
use panacube;
delete from param_setting where param_name='bigdata' or param_name='node' or param_name='panaocs';
select * from param_setting;
EOF
"""

# 写入大数据节点配置
write_db = """
mysql -u udsafe -pudsafe <<EOF
use panacube;
insert into param_setting(param_name, param_value, description, level, update_time, parent_id) values('{}', '{}', null, 1, '0000-00-00 00:00:00.000000', null);
select * from param_setting;
EOF
"""

# shell 跨节点
ssh_node = """
ssh {} <<EOF
{}
EOF
"""


def db_update_panaocs():
    """
    Write the assembled panaocs data to SQLite and return data
    :return:
    """
    node = GetModel.get_node()
    # File last data before overwriting data
    with open('/usr/local/udsafe/parent_bigdata_info', 'w') as f:
        f.write(json.dumps(node))
    try:
        max_node_ip = max(int(i["network_ip"].split('.')[-1]) for i in node)
    except Exception:
        max_node_ip = max(int(i["network_ip"].split('.')[-1]) for i in node['node'])
    panaocs_data = {
        "zfs_pool": "bigdata",
        "repo_ip": str(max_node_ip + 1),
        "netmask": node[0]['netmask'],
        "start_ip": str(max_node_ip + 1 + 5),
        "link": "br0",
        "panacube_ip": str(max_node_ip + 2),
        "panacube_nic_name": "eth2",
        "network_segment": '.'.join(node[0]['network_ip'].split('.')[:-1]) + '.*'
    }
    current_app.logger.info(panaocs_data)
    model.update_or_create('panaocs', panaocs_data)
    current_app.logger.info('大数据配置写入文件')
    return panaocs_data


def get_nodes():
    db_update_panaocs()
    insert_node = {}
    node = GetModel.get_node()
    count_cpu = GetModel.cpu_count()
    for item in node:
        # 将node节点数据写入数据库
        insert_node[item['node-name']] = {
            "cpu_start": int(count_cpu) - int(item['cpu']) + 1,
            "mem": item['mem'],
            "cpu_stop": count_cpu
        }
    current_app.logger.info('更新写入数据库的node数据 >>> {}'.format(insert_node))
    model.update_or_create('node', insert_node)


def deploy_bigdata():
    """
    上传lxc安装包，安装lxc环境
    :d  网关
    ：y  预留集群ip数
    :network_name 网卡名字
    :netmask      子网掩码
    :bigdata_size 存储大小
    """
    # 获取cpu总数
    count_cpu = GetModel.cpu_count()
    panaocs_data = db_update_panaocs()
    node = GetModel.get_node()
    current_app.logger.info('node 节点信息 >>> {}'.format(node))
    insert_node = {}
    deploy_path = PathDir.deploy()
    exclude_path = PathDir.exclude_list()
    q.put({"type": "大数据", "size": "上传大小", "speed": "start", "percentage": "{}".format(generate_random(5, 13))})
    _start = 14
    _stop = 17
    for item in node:
        # 将node节点数据写入数据库
        insert_node[item['node-name']] = {
            "cpu_start": int(count_cpu) - int(item['cpu']) + 1,
            "mem": item['mem'],
            "cpu_stop": count_cpu
        }
        set_system_info(item['ip'], item['cpu'], item['mem'])
        q.put({"type": "大数据", "size": "上传大小", "speed": "start", "percentage": "{}".format(generate_random(_start, _start))})
        _start += 4
        _stop += 11

        namenode = ssh_popen_1(item['ip'], "hostname")
        install_path = '/var/deploy/install.py'
        if namenode == "node-1":
            current_app.logger.info('节点一开始移动deploy到/var目录')
            from app_projects.deploy.get_config import move_file
            move_file()
            # if os.path.exists('/var/deploy'):
            #     shutil.rmtree('/var/deploy')
                # shutil.copytree(deploy_path, '/var/deploy')
            # else:
                # shutil.copytree(deploy_path, '/var/deploy')
            shutil.copy(PathDir.install(), '/var/deploy')
            current_app.logger.info('node-1 项目copy完成')

            q.put({"type": "大数据", "size": "", "speed": "start", "percentage": "{}".format(generate_random(_start, _start))})
            _start += 4
            _stop += 11
        else:
            current_app.logger.info("{node} move deploy to /var".format(node=item['node-name']))
            os.system('rsync -av -e ssh  {deploy} --exclude-from={exclude_path} {node_name}:/var/'.format(
                exclude_path=exclude_path, deploy='/var/deploy', node_name=item['node-name']
            ))
            q.put({"type": "大数据", "size": "上传大小", "speed": "start", "percentage": "{}".format(generate_random(_start, _start))})
            _start += 4
            _stop += 11

            current_app.logger.info(
                'rsync -av -e ssh  {deploy} --exclude-from={exclude_path} {node_name}:/var/'.format(
                    exclude_path=exclude_path, deploy='/var/deploy', node_name=item['node-name']
                )
            )
            current_app.logger.info(item['node-name'] + '>>>文件移动完成')

        q.put({"type": "大数据", "size": "上传大小", "speed": "start",
               "percentage": "{}".format(generate_random(_start, _start))})
        _start += 4
        _stop += 11

        # install_cmd = 'sh /var/deploy/install.sh -d {namenode} {bigdata_size} {network_name} {ip} {netmask} {d} {y}'
        install_cmd = 'python {py_shell} {size} {network_name} {ip} {netmask} {geteway} {repo_ip} {pack_path}'
        dev_path = None
        if isinstance(item.get('dev_path'), list) and item.get('dev_path'):
            dev_path = ','.join(item.get('dev_path'))
            install_cmd = 'python {py_shell} {size} {network_name} {ip} {netmask} {geteway} {repo_ip} {pack_path} --disk={disk}'
        install_yum_or_create_network = install_cmd.format(
            py_shell=install_path,
            size=item.get('bigdata', None),
            network_name=item.get('network_name'),
            ip=item.get('network_ip'),  # lxc网卡ip
            netmask=item.get('netmask'),
            disk=dev_path,
            geteway=panaocs_data.get('network_segment').replace('*', '1'),
            repo_ip=panaocs_data.get('network_segment').replace('*', str(panaocs_data.get('repo_ip'))),
            pack_path='/var/deploy'
        )

        q.put({"type": "大数据", "size": "上传大小", "speed": "start",
               "percentage": "{}".format(generate_random(_start, _start))})
        _start += 4
        _stop += 11

        current_app.logger.info('deploy bigdata install params: {}'.format(install_yum_or_create_network))
        ssh_popen_1(item['ip'], "\cp /var/deploy/rsync.pass /usr/local/udsafe/")
        ssh_popen_1(item['ip'], "\cp /var/deploy/lxc-create-bigdata.py /usr/local/udsafe/")
        if namenode == "node-1":
            os.system(install_yum_or_create_network)
        else:
            os.system(ssh_node.format(item['ip'], install_yum_or_create_network))

        q.put({"type": "大数据", "speed": "start", "percentage": "{}".format(generate_random(_start, _start))})
        _start += 4
        _stop += 11

        r = ssh_popen_1(item['ip'], "lxc-ls")
        if r == "repo":
            current_app.logger.info("""
                    ——————————————————————————————————————————————————
                    |                   已经有数据了                   |
                    ——————————————————————————————————————————————————
                """)
    current_app.logger.info('更新写入数据库的node数据 >>> {}'.format(insert_node))
    model.update_or_create('node', insert_node)
    current_app.logger.info('update node information')
    q.put({"type": "大数据", "size": "上传大小", "speed": "start", "percentage": "{}".format(generate_random(_start, _start))})
    from app_projects.deploy.get_config import copy_template
    copy_template()
    push_bigdata_db()


def push_bigdata_db():
    # get_nodes()
    time.sleep(4)
    panaocs = GetModel.get_panaocs()
    panaocs['netmask'] = exchange_mask(panaocs['netmask'])
    # del panaocs['panacube_ip']
    data = [
        {
            "param_name": "bigdata",
            "param_value": panaocs,
            "description": None,
            "level": 1,
            "update_time": "0000-00-00 00:00:00.000000",
            "parent_id": None
        },
        {
            "param_name": "panaocs",
            "param_value": panaocs,
            "description": None,
            "level": 1,
            "update_time": "0000-00-00 00:00:00.000000",
            "parent_id": None
        },
        {
            "param_name": "node",
            "param_value":  GetModel.get_node(),
            "description": None,
            "level": 1,
            "update_time": "0000-00-00 00:00:00.000000",
            "parent_id": None
        }
    ]
    if GetModel.deploy_type() == 'docker':
        if os.path.exists('/usr/local/udsafe/parent_bigdata_info'):
            node_list = os.popen("consul members | awk '{ print $1 }'").read().split('\n')[1:-1]
            for node in node_list:
                ssh_popen_1(node, del_param_name)
                os.system(del_param_name)

        for _list in data:
            os.system(write_db.format(_list['param_name'], json.dumps(_list['param_value'])))
    else:
        from app_projects.models.m_insert import insert_sqls, delete_sql
        if os.path.exists('/usr/local/udsafe/parent_bigdata_info'):
            delete_sql()
        insert_sqls(data)
    current_app.logger.info('写入数据配置开始')
    current_app.logger.info(data)
    current_app.logger.info('写入数据配置结束')
    q.put({"type": "大数据", "speed_p": "stop", "percentage": "100"})
