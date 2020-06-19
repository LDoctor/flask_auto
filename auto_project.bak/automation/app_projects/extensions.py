#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-6-28 下午3:11
# @Author  : nan
# @File    : extensions.py

import os
from flask_sqlalchemy import SQLAlchemy
from flask_moment import Moment
from flask_migrate import Migrate


db = SQLAlchemy()
#相当于Django的migrate
migrate = Migrate(db=db)
#时间渲染模块 需要前端装相应的支持包
moment = Moment()


def config_extensions(app):
    db.init_app(app)
    # try:
    #     db.create_all()
    # except Exception as e:
    #     print e
    migrate.init_app(app)
    moment.init_app(app)
