#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 19-4-12 上午11:33
# @Author  : nan
# @File    : get_awcloud_img.py

import json
import requests

from flask import current_app

from requests.adapters import HTTPAdapter
from app_projects.tools.file_path import GetModel

requests.packages.urllib3.disable_warnings()
import sys
reload(sys)
sys.setdefaultencoding('utf8')


DEFAULT_POOLBLOCK = False
DEFAULT_POOLSIZE = 30
DEFAULT_RETRIES = 0


class Session(requests.sessions.Session):
    def __init__(self, pool_connections=DEFAULT_POOLSIZE,
                 pool_maxsize=DEFAULT_POOLSIZE, max_retries=DEFAULT_RETRIES,
                 pool_block=DEFAULT_POOLBLOCK):
        super(Session, self).__init__()
        self.mount('http://', HTTPAdapter(pool_connections=pool_connections,
                                           pool_maxsize=pool_maxsize,
                                           pool_block=pool_block,
                                           max_retries=max_retries))
        self.mount('http://', HTTPAdapter(pool_connections=pool_connections,
                                          pool_maxsize=pool_maxsize,
                                          pool_block=pool_block,
                                          max_retries=max_retries))


class AWCloudManage(object):

    def __init__(self, key=None, code=None):
        self._session = requests.Session()
        self._session.keep_alive = False
        self._headers = {}
        self.request_data = {
            "enterpriseLoginName": "awcloud",
            "userName": GetModel.account()[0],
            "password": GetModel.account()[1],
            "verificationCode": code,
            "verificationKey": key
        }

    def login_params(self):
        authUrl = 'http://{}'.format(GetModel.awcloud_ip())

        return {
            "url": authUrl + "/awstack-user/v1/login",
            "json": self.request_data,
            "headers": {"Content-Type": "application/json"}
        }

    def is_cache(self, auto_login=False):
        if not auto_login:
            self._login()
        else:
            self._login()

    def _login(self):
        log_d = self.login_params()
        current_app.logger.info('开始登录---登录参数为: {}'.format(log_d))

        resp = self._session.post(**log_d)

        current_app.logger.info('登录返回参数: {}'.format(str(resp.text)))
        try:
            result = json.loads(resp.text)
        except Exception as e:
            raise ValueError('登录IP或者参数有问题: {}'.format(e))

        if result['code'] == '01030702':
            print result
            raise ValueError('用户名或密码错误')

        elif result['code'] == '01030706':
            raise ValueError('错误登录次数超过限制次数')

        elif result['code'] == '00010102':
            self._session.keep_alive = False
            resp = self._session.post(**self.login_params())
            result = json.loads(resp.text)
            print 'result:', result
            current_app.logger.info('result:{}'.format(str(result)))
            self._login()
            self._headers = result['data']['data']
            return

        # current_app.logger.info('登录得到的参数----{}'.format(result['data']['data']))

        self._headers = result['data']['data']
        self.get_auth_header()
        return {'code': 0}

    def get_auth_header(self, project_id=None, project_name=None):
        # current_app.logger.info("get awcloud headers: {}".format(self._headers))
        if project_name is None:
            project_name = "admin"
        return {
            'X-Auth-Token': self._headers['authToken'],
            'X-Register-Code': self._headers['regionKey'],
            'enterprise_uid': self._headers['enterpriseUid'],
            'enterprise_id': self._headers['enterpriseUid'],
            'domain_id': self._headers['domainUid'],
            'domain_name': self._headers['domainName'],
            'project_id': project_id if project_id else self._headers['defaultProjectUid'],
            'project_name': str(project_name).encode('utf-8') if project_name else self._headers['defaultProjectName'].encode('utf-8'),
            'regionUid': self._headers['regionUid'],
            'userUid': self._headers['userUid'],
            'userName': self._headers['userName'],
            'regionName': self._headers['regionName'],
            'Content-Type': 'application/json'
        }

    def r_session(self):
        return self._session

    def get_default_project_id(self):
        return self.get_auth_header().get('project_id', None)


def clear_code(token):
    """
    清除验证码
    :param token:
    :return:
    """
    url = 'http://{}:80/awstack-user/v1/params'.format(GetModel.awcloud_ip())

    headers = {
        "Content-Type": "application/json",
        "X-Auth-Token": token,
    }
    body = {
        "paramId": 917,
        "enterpriseUid": "0",
        "regionUid": "0",
        "regionKey": "0",
        "parentId": 1,
        "paramName": "LOGIN_CAPTCHA_ISOPEN",
        "path": "1/917/",
        "paramValue": "-1"
    }
    resp = requests.put(url, headers=headers, data=json.dumps(body))
    if resp.status_code == 200:
        return True
    return False


if __name__ == '__main__':
    # type(get_img())
    # print get_img()
    o = AWCloudManage()
    # print o.get_default_project_id()