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

sys.path.append("/var/admin/flask_packages".format(sys.path[0]))
os.system('sudo pip uninstall Mako -y')
from configobj import ConfigObj
from mako.template import Template


if not os.path.exists('/etc/telegraf/telegraf.conf.bak'):
    os.system("cp /etc/telegraf/telegraf.conf /etc/telegraf/telegraf.conf.bak")
config = ConfigObj('/etc/telegraf/telegraf.conf.bak', list_values=False)

global_tags = config.get('global_tags', {})
hostname = config.get('agent', {}).get('hostname', None)

pwd = os.path.dirname(os.path.abspath(__file__))
print pwd
os.system("cp -rf {0} /var/admin/".format(pwd))
fil = "/var/admin/auto_template/telegraf.conf.tpl"

if not os.path.exists(fil):
    print '模板文件不存在'


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
        "hostname": hostname,
        "devices": eval(config.get('agent').get('inputs.diskio').get('devices')),
        "interfaces": eval(config.get('agent').get('inputs.net').get('interfaces'))
    })

    #os.system("cat /var/admin/telegraf.conf > /etc/telegraf/telegraf.conf")

    print config
