#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-6-28 下午1:42
# @Author  : nan
# @File    : __init__.py.py

from .create_cloud import mod as cloud_mod
from .return_html import mod as html_mod


def config_blueprint(app):
    app.register_blueprint(cloud_mod)
    app.register_blueprint(html_mod)
