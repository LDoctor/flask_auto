#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-5-7 下午2:30
# @Author  : nan
# @File    : return_html.py

from flask import Blueprint, render_template

mod = Blueprint('return_html', __name__)


@mod.route('/')
def hello_world():
    return render_template("index.html")
