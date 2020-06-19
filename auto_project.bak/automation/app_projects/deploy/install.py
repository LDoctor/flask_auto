#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2019/12/9 下午2:33
# @Author  : nan
# @Site    : 
# @File    : install.py
# @Software: PyCharm


import os
import time
import shutil
import subprocess
import commands
import argparse
import traceback

import tarfile

# TO_UDSAFE = [
#     "lxc-create-bigdata.py",
#     "get_system.py",
#     "rsync.pass",
#     "agent",
#     "ud-upgrade"
# ]


UDSAFE_PATH = "/usr/local/udsafe"


def exec_or_get_ssh(cmd):
    return os.popen(cmd).read().split('\n')[0]


def sub_call_shell(cmd):
    try:
        s = subprocess.check_call(cmd.split(' '))
        # print dir(s)
        # print s
    except Exception as e:
        with open('/var/admin/install.log', 'a+') as f:
            f.write(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '  --->')
            traceback.print_exc(file=f)
        # print e, '<<<', '异常cmd: ', cmd


def sub_call_popen(cmd):
    child = subprocess.Popen(cmd.split(' '), stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=False, close_fds=True)
    re = child.wait()
    # print child.stdout.read(), '>>>', re, child


def get_shell_code(cmd):
    code, rest = commands.getstatusoutput(cmd)
    if code != 0:
        print "执行：>>> {} >>> 异常".format(cmd)
    return rest


def un_tgz(filename, out_path):
    _tar = tarfile.open(filename)
    try:
        if not os.path.exists(out_path):
            os.makedirs(out_path)
        else:
            shutil.rmtree(out_path)
            os.makedirs(out_path)
    except:
        pass
    _tar.extractall(out_path)
    _tar.close()


START_PATH = os.getcwd()


def create_br0(ip_addr, mask, geteway):
    """
    创建br0网卡
    :param ip_addr: ip地址
    :param mask:    子网掩码
    :param geteway: 网关
    :return:
    """
    with open("/etc/sysconfig/network-scripts/ifcfg-br0", "w") as f:
        f.writelines("TYPE=Bridge\n")
        f.writelines("DEVICE=br0\n")
        f.writelines("DEFROUTE=no\n")
        f.writelines("PEERDNS=no\n")
        f.writelines("PEERROUTES=no\n")
        f.writelines("NM_CONTROLLED=no\n")
        f.writelines("ONBOOT=yes\n")
        f.writelines("BOOTPROTO=static\n")
        f.writelines("IPADDR={}\n".format(ip_addr))
        f.writelines("NETMASK={}\n".format(mask))
        f.writelines("GATEWAY={}\n".format(geteway))
        f.writelines("USERCTL=no\n")
    # sub_call_shell("ifconfig br0 down")
    # sub_call_shell("brctl delbr br0")
    sub_call_shell("ifdown br0")
    sub_call_shell("ifup br0")


def create_network_name(network_name):
    """
    创建选择的网卡配置
    :param network_name: 网卡名称
    :return:
    """
    with open("/etc/sysconfig/network-scripts/ifcfg-{}".format(network_name), "w") as f:
        f.writelines("DEVICE={}\n".format(network_name))
        f.writelines("BOOTPROTO=none\n")
        f.writelines("ONBOOT=yes\n")
        f.writelines("USERCTL=no\n")
        f.writelines("NOZEROCONF=yes\n")
        f.writelines("DEFROUTE=no\n")
        f.writelines("PEERDNS=no\n")
        f.writelines("PEERROUTES=no\n")
        f.writelines("NM_CONTROLLED=no\n")
        f.writelines("BRIDGE=br0\n")
    print 'ifdown {}'.format(network_name)
    sub_call_shell("ifdown {}".format(network_name))
    print "ifup {}".format(network_name)
    sub_call_shell("ifup {}".format(network_name))


def repo_config(repo_ip):
    """
    lxc repo镜像配置
    :param repo_ip:
    :return:
    """
    with open("/var/lib/lxc/repo/config", "w") as f:
        f.writelines("lxc.net.0.type = veth\n")
        f.writelines("lxc.net.0.link = br0\n")
        f.writelines("lxc.net.0.flags = up\n")
        f.writelines("lxc.net.0.ipv4.address = {}/24\n".format(repo_ip))
        f.writelines("lxc.net.0.name = eth0\n")
        f.writelines("lxc.start.auto = 1\n")
        f.writelines("lxc.cgroup.cpuset.cpus = 0-4\n")
        f.writelines("lxc.cgroup.memory.limit_in_bytes = 4096M\n")
        f.writelines("lxc.rootfs.path = rbd:/dev/rbd/bigdata/repo\n")
        f.writelines("\n# Include common configuration\nlxc.include = /usr/share/lxc/config/centos.common.conf\n")
        f.writelines("\nlxc.arch = x86_64\nlxc.uts.name = repo-lxc\n")


def create_bigdata():
    sub_call_shell("ceph osd pool create bigdata 256")
    sub_call_shell("rbd create bigdata/repo --size 60G")
    if not os.path.exists("/etc/ceph/rbdmap"):
        os.system("touch /etc/ceph/rbdmap")
    with open("/etc/ceph/rbdmap", "r") as f:
        r_file = f.read()
    with open("/etc/ceph/rbdmap", "a+") as f:
        if "bigdata/repo" not in r_file:
            f.writelines("bigdata/repo id=admin,keyring=/etc/ceph/ceph.client.admin.keyring\n")
    rbd_path = get_shell_code("rbd map bigdata/repo")
    sub_call_shell("mkfs.ext4 {}".format(rbd_path))
    sub_call_shell("mount {} /media".format(rbd_path))
    sub_call_shell("mkdir -p /var/lib/lxc/repo/rootfs/")


def deploy(pack_path):
    os.system("mkdir /var/log/socketServer")
    uname_path = exec_or_get_ssh("uname -r")
    rpm_path = os.path.join(pack_path, "rpm_" + uname_path)
    try:
        os.chdir(rpm_path)
    except:
        raise ValueError('系统内核安装包不匹配')
    if uname_path == '3.10.0-693.37.4.el7.x86_64':
        os.system("yum localinstall *.rpm -y")
    else:
        os.system("yum localinstall zlib-devel*.rpm --nogpgcheck -y")
        os.system("yum localinstall elfutils-libelf-0.176-2.el7.x86_64.rpm elfutils-libelf-devel-0.176-2.el7.x86_64.rpm elfutils-libs-0.176-2.el7.x86_64.rpm --nogpgcheck -y")
        os.system("yum localinstall python-meld3*.rpm -y")
        os.system("yum localinstall supervisor*.rpm -y")
        os.system("yum localinstall lxc-*.rpm -y")
        os.system("rpm -ivh c-ares-1.10.0-3.el7.x86_64.rpm")
        os.system("rpm -ivh python-gevent-1.0-3.el7.x86_64.rpm")
        os.system("yum localinstall *.rpm --nogpgcheck -y")
    os.chdir(pack_path)
    sub_call_shell("modprobe zfs")
    sub_call_shell("systemctl start lxc")
    sub_call_shell("systemctl enable lxc")
    sub_call_shell("systemctl disable rbdmap")
    sub_call_shell("systemctl start rbdmap")
    iptables_name = "/etc/sysconfig/iptables"
    # iptables_name = START_PATH + "/test.txt"
    with open(iptables_name, "r") as f:
        lines = f.readlines()
        if "-A INPUT -i br_mon -j ACCEPT\n" not in lines:
            lines.insert(3, "-A INPUT -i br_mon -j ACCEPT\n")
        if "-A INPUT -i br0 -j ACCEPT\n" not in lines:
            lines.insert(4, "-A INPUT -i br0 -j ACCEPT\n")
        if "-A FORWARD -i br_mon -j ACCEPT\n" not in lines:
            lines.insert(5, "-A FORWARD -i br_mon -j ACCEPT\n")
        if "-A FORWARD -i br0 -j ACCEPT\n" not in lines:
            lines.insert(6, "-A FORWARD -i br0 -j ACCEPT\n")
        if "-A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT\n" not in lines:
            lines.insert(7, "-A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT\n")
        if "-A INPUT -p tcp -m state --state NEW -m tcp --dport 9997 -j ACCEPT\n" not in lines:
            lines.insert(8, "-A INPUT -p tcp -m state --state NEW -m tcp --dport 9997 -j ACCEPT\n")
        if "-A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT\n" not in lines:
            lines.insert(9, "-A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT\n")
        if "-A INPUT -p tcp -m state --state NEW -m tcp --dport 10108 -j ACCEPT\n" not in lines:
            lines.insert(10, "-A INPUT -p tcp -m state --state NEW -m tcp --dport 10108 -j ACCEPT\n")
        if "-A INPUT -p tcp -m state --state NEW -m tcp --dport 8086 -j ACCEPT\n" not in lines:
            lines.insert(11, "-A INPUT -p tcp -m state --state NEW -m tcp --dport 8086 -j ACCEPT\n")
        if "-A INPUT -p tcp -m state --state NEW -m tcp --dport 18086 -j ACCEPT\n" not in lines:
            lines.insert(12, "-A INPUT -p tcp -m state --state NEW -m tcp --dport 18086 -j ACCEPT\n")
        str_list = "".join(lines)
    with open(iptables_name, "w") as f:
        f.write(str_list)
    sub_call_shell("systemctl restart iptables")
    if not os.path.exists(UDSAFE_PATH):
        os.makedirs(UDSAFE_PATH)
    for file in os.listdir(pack_path):
        if "storage_code_" in file:
            print "Copy 文件：{} > {}".format(file, UDSAFE_PATH)
            shutil.copy(os.path.join(pack_path, file), UDSAFE_PATH)

    for file in os.listdir(os.path.join(pack_path, 'scripts')):
        try:
            shutil.copy(os.path.join(os.path.join(pack_path, 'scripts'), file), UDSAFE_PATH)
        except:
            os.system("cp -rf {source} {target}".format(
                source=os.path.join(os.path.join(pack_path, 'scripts'), file),
                target=UDSAFE_PATH
            ))
    os.system("sh /var/deploy/create_infuxdb.sh")
    os.system("rm -rf {}".format(os.path.join(UDSAFE_PATH, 'agent')))
    shutil.copytree(os.path.join(pack_path, 'agent'), os.path.join(UDSAFE_PATH, 'agent'))
    os.system("rm -rf {}".format(os.path.join(UDSAFE_PATH, 'lxc_share')))
    shutil.copytree(os.path.join(pack_path, "lxc_share"), os.path.join(UDSAFE_PATH, 'lxc_share'))
    shutil.copy(os.path.join(pack_path, "lxc.service"), "/usr/lib/systemd/system/")
    shutil.copy(os.path.join(pack_path, "zfs-import-cache.service"), "/usr/lib/systemd/system/")
    sub_call_shell("systemctl daemon-reload")
    sub_call_shell("systemctl disable zfs-import-cache")
    sub_call_shell("systemctl disable lxc")
    sub_call_shell("systemctl start zfs-import-cache")
    sub_call_shell("systemctl start lxc")
    shutil.copy(os.path.join(pack_path, "supervisord.d/agent.ini"), "/etc/supervisord.d/")
    shutil.copy(os.path.join(pack_path, "supervisord.d/ud-upgrade.ini"), "/etc/supervisord.d/")
    shutil.copy(os.path.join(pack_path, "supervisord.d/socket_server.ini"), "/etc/supervisord.d/")
    os.system("chmod +x {}".format(os.path.join(UDSAFE_PATH, "ud-upgrade")))
    sub_call_shell("systemctl start supervisord")
    sub_call_shell("systemctl enable supervisord")
    sub_call_shell("chmod 600 {}".format(os.path.join(UDSAFE_PATH, "rsync.pass")))
    sub_call_shell("chmod 777 {}".format(os.path.join(UDSAFE_PATH, "lxc-create-bigdata.py")))
    sub_call_shell("chmod 777 {}".format(os.path.join(UDSAFE_PATH, "get_system.py")))


def deploy_name_node(deploy_path):
    """
    部署节点一需要的
    :return:
    """
    _path = os.path.join(deploy_path, "panaocs_images")
    namenode_id = "92b0c079-e4c6-4d04-80fb-82e5177d3ab3"
    datanode_id = "c9005936-e7e3-46cd-9670-f33e1648ba4c"
    centos6_10_id = "55db7101-164c-43c3-a1db-76e5a1f0ad2b"
    centos7_5_id = "06593c85-9b07-4b8e-8218-747eb772e1fc"
    centos7_6_id = "026ec174-8a03-471c-b267-0d1b81aba918"
    voi_id = "fb5c1ebb-99f6-4cd8-83f9-6b6d3b5eac14"
    ubuntu14_04_id = "b6e07246-0b3c-4d5c-8528-febf8dbd9e99"
    ubuntu16_04_id = "f1d2a75e-ced7-4483-b420-59844dd34ac7"
    # 解压repo
    # try:
    #     un_tgz(os.path.join(deploy_path, "repo.tgz"), "/media")
    # except Exception as e:
    os.system("tar xvpf {}/repo.tgz -C /media".format(deploy_path))
    # 部署大数据镜像
    print "解压 namenode.tgz"
    namenode_path = "/media/var/www/html/lxc-mirror/{}".format(namenode_id)
    # un_tgz(os.path.join(_path, "namenode.tgz"), namenode_path)
    os.system("mkdir -p {}".format(namenode_path))
    os.system("tar xvpf {0} -C {1} --numeric-owner".format(os.path.join(_path, "namenode.tgz"), namenode_path))
    print "解压 datanode.tgz"
    datanode_path = "/media/var/www/html/lxc-mirror/{}".format(datanode_id)
    os.system('mkdir -p {}'.format(datanode_path))
    # un_tgz(os.path.join(_path, "datanode.tgz"), datanode_path)
    os.system("tar xvpf {0} -C {1} --numeric-owner".format(os.path.join(_path, "datanode.tgz"), datanode_path))
    # 镜像库迁移
    # 迁移Centos 6.10
    print "解压 centos6.10.tgz"
    centos6_10_path = "/media/var/www/html/system/{}".format(centos6_10_id)
    un_tgz(os.path.join(_path, "centos6.10.tgz"), centos6_10_path)
    # 迁移centos7.5
    print "解压 centos7.5.tgz"
    centos7_5_path = "/media/var/www/html/system/{}".format(centos7_5_id)
    un_tgz(os.path.join(_path, "centos7.5.tgz"), centos7_5_path)
    # 迁移CentOS 7.6
    print "解压 centos7.6.tgz"
    centos7_6_path = "/media/var/www/html/system/{}".format(centos7_6_id)
    un_tgz(os.path.join(_path, "centos7.6.tgz"), centos7_6_path)
    # 迁移云桌面
    print "解压voi.tgz"
    voi_path = "/media/var/www/html/system/{}".format(voi_id)
    un_tgz(os.path.join(_path, "voi.tgz"), voi_path)
    # 迁移Ubuntu 14.04
    print "解压 ubuntu14.tgz"
    ubuntu14_path = "/media/var/www/html/system/{}".format(ubuntu14_04_id)
    un_tgz(os.path.join(_path, "ubuntu14.04.tgz"), ubuntu14_path)
    # 迁移Ubuntu 16.04
    print "解压 ubuntu16.tgz"
    ubuntu_16_path = "/media/var/www/html/system/{}".format(ubuntu16_04_id)
    un_tgz(os.path.join(_path, "ubuntu16.04.tgz"), ubuntu_16_path)
    sub_call_shell("umount /media")
    for i in range(10):
        sub_call_shell("sync")
    print "执行 lxc-start -n repo"
    sub_call_shell("lxc-start -n repo")


def deploy_zpool(nodename, size):
    """
    所有节点需要执行的zpool步骤
    :param nodename:
    :param size:
    :return:
    """
    sub_call_shell("rbd create bigdata/{}-data0 --size {}G".format(nodename, size))
    if not os.path.exists("/etc/ceph/rbdmap"):
        os.system("touch /etc/ceph/rbdmap")
    with open("/etc/ceph/rbdmap", "r") as f:
        r_file = f.read()
    with open("/etc/ceph/rbdmap", "a+") as f:
        if "bigdata/{}-data0".format(nodename) not in r_file:
            f.writelines("bigdata/{}-data0 id=admin,keyring=/etc/ceph/ceph.client.admin.keyring\n".format(nodename))
    rbd_path = get_shell_code("rbd map bigdata/{}-data0".format(nodename))
    print "rbd_path >>>", rbd_path
    sub_call_shell("zpool create bigdata -f /dev/rbd/bigdata/{}-data0".format(nodename))
    sub_call_shell("zpool set autotrim=on bigdata")
    sub_call_shell("supervisorctl update")
    sub_call_shell("supervisorctl stop all")
    sub_call_shell("supervisorctl start all")


def deploy_disk(disk):
    rest = get_shell_code("echo {} | sed 's/,/ /g'".format(disk))
    if rest:
        sub_call_shell("zpool create bigdata -f {}".format(rest))


def active(node):
    node_name = "datanode"
    if node == "node-1":
        node_name = "namenode"
    if node_name == "namenode":
        sub_call_shell("rbd map bigdata/repo")
        sub_call_shell("lxc-start -n repo")
        sub_call_shell("rbd map bigdata/`hostname`-data0")
        sub_call_shell("zpool import bigdata")
    else:
        sub_call_shell("rbd map bigdata/`hostname`-data0")
        sub_call_shell("zpool import bigdata")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="部署lxc、大数据需要的参数、参数顺序不可变", usage='python install.py -h')
    parser.add_argument('size', type=int, help='部署大数据存储大小')
    parser.add_argument('network_name', type=str, help='网卡名称: enp11s0')
    parser.add_argument('ip', type=str, help='repo镜像IP： 192.168.58.1')
    parser.add_argument('netmask', type=str, help='子网掩码: 255.255.255.0')
    parser.add_argument('geteway', type=str, help='网关: 192.168.58.1')
    parser.add_argument('repo_ip', type=str, help='repo_Ip: 192.168.58.1')
    parser.add_argument('pack_path', type=str, help='安装包路径，绝对路径')
    parser.add_argument('--disk', type=str, help='裸盘部署、裸盘路径以，号隔开')
    # parser.print_help()
    args = parser.parse_args()

    node = exec_or_get_ssh("hostname")
    deploy(args.pack_path)
    create_br0(args.ip, args.netmask, args.geteway)
    create_network_name(args.network_name)

    node_name = "datanode"
    if args.disk:
        if node == 'node-1':
            create_bigdata()
            repo_config(args.repo_ip)
            deploy_name_node(args.pack_path)
        deploy_disk(args.disk)
    else:
        if node == "node-1":
            node_name = "namenode"
            create_bigdata()
            repo_config(args.repo_ip)
            deploy_name_node(args.pack_path)
        deploy_zpool(node, args.size)
        # deploy_all_node(node_name, args.size)
    exit(0)
    print ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>     部署完成     <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"
