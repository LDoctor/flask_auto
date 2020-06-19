#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-6-28 下午5:26
# @Author  : nan
# @File    : m_insert.py

import json
import MySQLdb

from app_projects.tools.log_file import logger
from app_projects.tools.file_path import GetModel

table = 'param_setting'


insert_bigdata_type = """

"""


def re_conn():
    db_ip = str(GetModel.kvm_ip())
    _conn_status = True
    _max_retries_count = 10  # 设置最大重试次数
    _conn_retries_count = 0  # 初始重试次数
    _conn_timeout = 10  # 连接超时时间为3秒
    while _conn_status and _conn_retries_count <= _max_retries_count:
        try:
            db = MySQLdb.connect(db_ip, 'udsafe', 'udsafe', 'panacube', charset='utf8', connect_timeout=_conn_timeout)
            _conn_status = False
            return db
        except Exception as e:
            print e
            _conn_retries_count += 1
            print _conn_retries_count

        print 'connect db is error!!'
        continue


def save(sql, values):
    db = re_conn()
    curr = db.cursor()
    try:
        dict_to_json = []
        for i in values:
            if isinstance(i, dict):
                dict_to_json.append(json.dumps(i))
            else:
                dict_to_json.append(i)
        curr.execute(sql, tuple(dict_to_json))
        db.commit()
        # db.close()
    except Exception as e:
        logger.error(e)
        raise e


def insert_sql(data):
    if isinstance(data, dict):
        keys = ','.join(['`' + i + '`' for i in data.keys()])
        values = ','.join(["%s"] * len(data))
        sql = 'INSERT INTO {table}({keys}) VALUES ({values})'.format(
            table=table,
            keys=keys,
            id=id,
            values=values
        )
        try:
            save(sql, data.values())
        except Exception as e:
            print e
            sql = 'UPDATE {table} SET `param_value`={values} WHERE `param_name`={keys}'.format(
                table=table,
                keys=keys,
                values=values
            )
            save(sql, data.values())
        logger.info('写入数据库成功')
    else:
        logger.info('写入数据库参数类型有误')
        return False


def insert_sqls(data):
    print 'KVM>>>IP>>> {}'.format(GetModel.kvm_ip())
    db = re_conn()
    curr = db.cursor()
    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict):
                insert_sql(item)
            else:
                logger.info('写入数据库参数类型有误---dict类型')
                return False
        db.close()
    else:
        logger.info('写入数据库参数类型有误----list类型')
        return False


def delete_sql():
    db = re_conn()
    curr = db.cursor()
    sql = """delete from param_setting where `param_name`='bigdata' or `param_name`='node' or `param_name`='panaocs'"""
    try:
        curr.execute(sql)
        db.commit()
    except Exception as e:
        print e
    finally:
        db.close()


if __name__ == '__main__':
    pass
    data = [
        {
            "param_name": "bigdata",
            "param_value": {u'panacube_ip': u'70', u'network_segment': u'192.168.91.*', u'zfs_pool': u'bigdata', u'netmask': 24, u'link': u'br0', u'repo_ip': u'69', u'start_ip': u'74', u'panacube_nic_name': u'eth2'},
            "description": None,
            "level": 1,
            "update_time": "0000-00-00 00:00:00.000000",
            "parent_id": None
        },
        {
            "param_name": "panaocs",
            "param_value": {u'panacube_ip': u'70', u'network_segment': u'192.168.91.*', u'zfs_pool': u'bigdata', u'netmask': 24, u'link': u'br0', u'repo_ip': u'69', u'start_ip': u'74', u'panacube_nic_name': u'eth2'},
            "description": None,
            "level": 1,
            "update_time": "0000-00-00 00:00:00.000000",
            "parent_id": None
        },
        {
            "param_name": "node",
            "param_value": {u'node-1': {u'mem': 2, u'cpu_stop': 23, u'cpu_start': 23}, u'node-3': {u'mem': 2, u'cpu_stop': 23, u'cpu_start': 23}, u'node-2': {u'mem': 2, u'cpu_stop': 23, u'cpu_start': 23}},
            "description": None,
            "level": 1,
            "update_time": "0000-00-00 00:00:00.000000",
            "parent_id": None
        }
    ]
    insert_sqls(data)
    # q.put({"type": "大数据", "speed_p": "stop", "percentage": 100})