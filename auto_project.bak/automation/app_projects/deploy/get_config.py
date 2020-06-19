#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2019/12/6 下午2:51
# @Author  : nan
# @Site    : 
# @File    : get_config.py
# @Software: PyCharm

import os
import re
import shutil
import ConfigParser
from configobj import ConfigObj


# config = ConfigParser.ConfigParser().read(os.path.join(os.getcwd(), 'config.ini'))
# config = ConfigObj(os.path.join(os.getcwd(), 'config.ini'))
config = ConfigObj(os.path.join('/mnt/auto_project', 'config.ini'))
# config = ConfigObj(os.path.join('/home/nan/projects/python_project/auto_deploy/auto_project', 'config.ini'))
# config = ConfigObj()
# config.filename = './config.ini'
# print '配置文件路径 >>>', config
defaultDeployPath = config['deployPath'].pop('path')
if defaultDeployPath:
    pass
# defaultDeployPath = '/home/nan/projects/python_project/auto_deploy/auto_project/conf/deploy/'
else:
    defaultDeployPath = '/mnt/auto_project/conf/deploy/'

MustExist = ['centos7.6.tgz', 'centos7.4.tgz', 'centos7.3.tgz', 'centos6.10.tgz', 'voi.tgz', 'ubuntu16.04.tgz',
             'ubuntu14.04.tgz', 'centos7.5.tgz', 'namenode.tgz', 'datanode.tgz']

deployPath = config.get('deployPath')
version = config.get('version')
rpm_ = os.popen('uname -r').read().strip()
all_path = {}


def shell_to_str(_str):
    """
    将带有shell命令的字符串进行格式化得到结果的字符串
    # >>> s = '当前服务器内核版本为: {uname -r}'
    # >>> shell_to_str(s)
    '当前服务器内核版本为: 3.10.0-693.37.4.el7.x86_64'
    :param _str:
    :return: str
    """
    _shell = re.findall('{(.*?)}', _str)
    index = 0
    for item in _shell:
        _str = _str.replace(item, str(index))
        _shell[index] = os.popen(item).read().strip()
        index += 1
    return _str.format(*_shell)


def path_to_list(file_name, k, path=None):
    if '{' in file_name and '}' in file_name:
        file_name = shell_to_str(file_name)
    if file_name and path:
        if k in all_path:
            all_path[k] = [all_path[k]]
            all_path[k].append(os.path.join(defaultDeployPath, path, file_name))
        else:
            all_path[k] = os.path.join(defaultDeployPath, path, file_name)
    else:
        all_path[k] = os.path.join(defaultDeployPath, file_name)


for k, v in deployPath.items():
    _k = k[:-4]  # 获取版本key
    if '{' in v and '}' in v:
        v = shell_to_str(v)
    file_name = version.get(_k)
    if isinstance(file_name, list):
        for item in file_name:
            path_to_list(item, k, path=v)
    else:
        path_to_list(file_name, k, path=v)


def is_path_list(_list, parent_list):
    if isinstance(_list, list):
        for i in _list:
            if isinstance(i, list):
                is_path_list(i, parent_list)
            else:
                parent_list.append(i)
        return parent_list
    else:
        return [_list]


error_list = []
err_str = "\n"


def is_file_exits(path):
    global error_list
    global err_str
    if os.path.exists(path):
        if not os.path.isfile(path):
            for i in os.listdir(path):
                if rpm_ not in path:
                    if i not in MustExist and '.rpm' not in i and '.py' not in i:
                        print '缺少该文件：{}，需放置在 {}'.format(i, path)
    else:
        error_list.append('不存在 >>> {}'.format(path))


for item in all_path.values():
    if isinstance(item, list):
        new_list = []
        for item_ in is_path_list(item, new_list):
            is_file_exits(item_)
    else:
        new_list = []
        item = is_path_list(item, new_list)
        for i in item:
            is_file_exits(i)


if error_list:
    for item in error_list:
        err_str += item + '\n'
    # raise ValueError(err_str)

ssh_copy_template = """
scp -r {f} {node}:/var/admin
scp -r {packge} {node}:/var/admin
ssh {n} <<EOF
python /var/admin/auto_template/run.py
EOF
"""


def copy_template():
    temp_path = '/'.join(defaultDeployPath.split("/")[0: 3]) + '/automation/app_projects/templates/auto_template'
    package_path = '/'.join(defaultDeployPath.split("/")[0: 3]) + '/automation/flask_packages'
    node_list = os.popen("consul members | awk '{ print $1 }'").read().split('\n')[1:-1]
    for item in node_list:
        os.system(ssh_copy_template.format(
            f=temp_path,
            packge=package_path,
            node=item,
            n=item
        ))


def get_all_path():
    """
    获取根目录的配置文件路径并验证文件是否存在
    :return:
    """
    result = {}
    for k, v in all_path.items():
        if isinstance(v, list):
            l = []
            result[k] = is_path_list(v, l)
        else:
            result[k] = v
    return result


def verify_panacos_images():
    """
    验证panacos_images 并移动到/var/deploy
    :return:
    """
    os.system("mkdir /var/deploy")
    os.system("mkdir -p /var/deploy/panaocs_images")
    for item in get_all_path().get('panaocsImagesPaht'):
        if not os.path.isfile(item):
            raise ValueError('%s >>> 不存在' % item)
        else:
            new_name = item.split('tgz')[0].split('/')[-1] + 'tgz'
            print '准备移动： %s' % new_name
            os.system("cp -rf {image} /var/deploy/panaocs_images/{name}".format(
                image=item, name=new_name
            ))


create_influxdb_ssh = """
scp -r {0}agent/scripts/create_infuxdb.sh {1}:/var/admin/
scp -r {0}agent/scripts/add_sshd.sh {1}:/var/admin/
ssh {2} <<EOF
sh /var/admin/create_infuxdb.sh
cat /var/admin/add_sshd.sh > /usr/local/bin/add_sshd.sh
rm -rf /var/admin/create_infuxdb.sh
rm -rf /var/admin/add_sshd.sh
EOF
"""


def create_influxdb():
    dp = defaultDeployPath
    var_deploy = "/var/deploy"
    os.system("mkdir %s" % var_deploy)
    node_list = os.popen("consul members | awk '{ print $1 }'").read().split('\n')[1:-1]
    print node_list
    for item in node_list:
        print "执行节点 %s" % item
        os.system(create_influxdb_ssh.format(dp, item, item))


def verify_repo():
    os.system("mkdir /var/deploy")
    repo_path = get_all_path().get('repoPath')
    print "准备移动： %s" % repo_path
    new_name = repo_path.split('/')[-1].split('tgz')[0] + 'tgz'
    os.system("cp -rf {image} /var/deploy/{name}".format(
        image=repo_path, name=new_name
    ))


def verify_rpms():
    os.system("mkdir /var/deploy")
    rpms_path = get_all_path().get('rpmPath')
    print "准备移动: %s" % rpms_path
    os.system("cp -rf {rpms} /var/deploy/".format(rpms=rpms_path))


def move_storage_code():
    os.system("mkdir /var/deploy")
    stroage_code = get_all_path()['storagecodePath']
    print "准备移动: %s" % stroage_code
    storage_code_name = '_'.join(stroage_code.split('/')[-1].split('_')[:-1])
    os.system("cp -rf {} /var/deploy/{}".format(stroage_code, storage_code_name))
    return storage_code_name


def move_file(deploy_type="kvm"):
    os.system("mkdir -p /var/log/socketServer")
    dp = defaultDeployPath
    deploy = '/var/deploy'
    if os.path.exists(deploy):
        shutil.rmtree(deploy)
        os.mkdir(deploy)
    else:
        os.mkdir(deploy)
    agent_path = "/var/deploy/agent"
    lxc_share = "/var/deploy/lxc_share"
    os.system("mkdir %s" % lxc_share)
    os.system("cp -rf %sagent/scripts/telegraf.conf %s" % (dp, lxc_share))
    os.system("mkdir -p %s" % agent_path)
    # agent.py 移动到agent目录下
    os.system("cp -rf {}agent/scripts/agent.py {}/".format(dp, agent_path))
    # 移动supervisord 监控脚本
    print "cp -rf {}agent/scripts {}/".format(dp, deploy)
    os.system("cp -rf {}agent/scripts {}/".format(dp, deploy))
    # 复制rsync文件
    print "cp -rf {}agent/rsync/* {}/scripts".format(dp, deploy)
    os.system("cp -rf {}agent/rsync/* {}/scripts".format(dp, deploy))
    # 复制systemctl 控制脚本
    print "cp -rf {}agent/services/* {}/".format(dp, deploy)
    os.system("cp -rf {}agent/services/* {}/".format(dp, deploy))
    # 复制supervisord配置文件
    print "cp -rf {}agent/supervisord.d {}/".format(dp, deploy)
    os.system("cp -rf {}agent/supervisord.d {}/".format(dp, deploy))
    # 复制stroagecode 镜像
    # print "cp -rf {} {}/{}".format(stroage_type, deploy, '_'.join(stroage_type.split('/')[-1].split('_')[:-1]))
    # os.system("cp -rf {} {}/{}".format(stroage_type, deploy, '_'.join(stroage_type.split('/')[-1].split('_')[:-1])))
    # 复制rpm安装包
    # print "cp -rf {} {}".format(get_all_path().get('rpmPath'), deploy)
    # os.system("cp -rf {} {}".format(get_all_path().get('rpmPath'), deploy))
    move_storage_code()
    verify_rpms()
    verify_repo()
    verify_panacos_images()


if __name__ == '__main__':
    # import json
    # j_all_path = json.dumps(get_all_path())
    # print j_all_path
    # print config.get('pancube_sql')['sql_name']
    print defaultDeployPath
    print('--------------')
    print get_all_path()['bigdataPath']
    # copy_template()
    create_influxdb()
    # move_storage_code()
    # verify_panacos_images()
    # verify_repo()
    # verify_rpms()
    # copy_file()
    # move_file()