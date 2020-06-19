#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 19-9-4 下午4:00
# @Author  : nan
# @File    : utils.py


import random


def generate_random(s, e):
    """
    生成随机进度
    :param s: 开始
    :param e: 结束
    :return:  取开始结束区间
    """
    if s == e:
        s = s - 2

    return random.randint(s, e)


if __name__ == '__main__':
    print generate_random(20, 23)
