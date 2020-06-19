#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-6-28 下午1:42
# @Author  : nan
# @File    : __init__.py.py

import sys


from flask import Flask


from app_projects.globalvar import Config
from app_projects.views import config_blueprint
from app_projects.extensions import config_extensions
from tools.log_file import log_file_handler


def create_app():
    sys.path.append("{}/flask_packages".format(sys.path[0]))
    app = Flask(__name__)
    # 执行额外的初始化
    config_extensions(app)
    app.config.from_object(Config)

    config_blueprint(app)
    app.logger.addHandler(log_file_handler)

    return app
