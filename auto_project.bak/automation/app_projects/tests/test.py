#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2020/6/2 下午3:36
# @Author  : nan
# @Site    : 
# @File    : test.py
# @Software: PyCharm

import os
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

from configobj import ConfigObj
from mako.template import Template


config = ConfigObj('/etc/telegraf/telegraf.conf', list_values=False)

global_tags = config['global_tags']
hostname = config['agent']['hostname']

fil = "/var/admin/auto_template/telegraf.conf.tpl"

if os.path.exists(fil):
    print '========='


class BaseTemplate(object):

    def __init__(self):
        self.template = Template(filename=fil)
        self.output_filename = "/var/admin/telegraf.conf"

    def render(self, *args, **kwargs):
        with open(self.output_filename, 'w+') as f:
            f.write(self.template.render(**kwargs))


if __name__ == '__main__':

    b = BaseTemplate()

    b.render(**{
        "global_tags": global_tags,
        "hostname": hostname
    })
    os.system("cat /var/admin/telegraf.conf > /etc/telegraf/telegraf.conf")

