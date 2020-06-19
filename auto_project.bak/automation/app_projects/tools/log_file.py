#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-5-10 下午4:07
# @Author  : nan
# @File    : log_file.py


import re
import os
import logging
from logging.handlers import TimedRotatingFileHandler

path = os.path.join(os.path.dirname(os.path.abspath(__name__)) + '/logs')
# path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__name__))) + '/logs')

if not os.path.exists(path):
    os.mkdir(path)


# def log(name):
    # 日志
logging.basicConfig(level=logging.INFO)
log_fmt = '%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s'
formatter = logging.Formatter(log_fmt)
log_file_handler = TimedRotatingFileHandler(filename=path + '/%s.log' % 'logs', when="D", backupCount=7)
log_file_handler.suffix = "%Y-%m-%d.log"
log_file_handler.extMatch = re.compile(r"^\d{4}-\d{2}-\d{2}.log$")
log_file_handler.setFormatter(formatter)
logger = logging.getLogger(__name__)
    # logger.addHandler(log_file_handler)
    # return logger
