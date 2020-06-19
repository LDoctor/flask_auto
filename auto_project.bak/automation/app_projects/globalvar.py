#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 19-4-28 下午6:22
# @Author  : nan
# @File    : globalvar.py

import os
import re
from logging.handlers import TimedRotatingFileHandler

base_dir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))


class Config(object):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///auto.sqlite"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TEMPLATES_AUTO_RELOAD = True

    @staticmethod
    def init_app(app):
        pass


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(base_dir, 'data.sqlite')

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)

        # email errors to the administrators
        import logging
        logging.basicConfig(level=logging.INFO)
        log_fmt = '%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s'
        formatter = logging.Formatter(log_fmt)
        log_file_handler = TimedRotatingFileHandler(filename=base_dir + '/%s.log' % 'error', when="D", backupCount=7)
        log_file_handler.suffix = "%Y-%m-%d.log"
        log_file_handler.extMatch = re.compile(r"^\d{4}-\d{2}-\d{2}.log$")
        log_file_handler.setFormatter(formatter)



# 项目CPU配置
# CPU_QUOTA = 8
# MEMORY_QUOTA = 16 * 1024
# STORAGE_QUOTA = 1024 * 16
CPU_QUOTA = 32
MEMORY_QUOTA = 18 * 1024
STORAGE_QUOTA = 1024 * 18

# flavors配置
FLAVOR_NAME = 'panacube3.0'
CPU = 4
CPU_MAX = 8
RAM = 4 * 1024
RAM_MAX = 8 * 1024
IS_PUBLIC = False  # 是否公用


if __name__ == '__main__':
    print os.path.join(base_dir, 'db/data.sqlite')
