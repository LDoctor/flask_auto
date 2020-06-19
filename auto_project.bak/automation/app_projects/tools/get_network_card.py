#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 19-4-16 上午10:48
# @Author  : nan
# @File    : get_network_card.py

from flask import current_app
from app_projects.tools.ssh_open import ssh_popen_1
from app_projects.tools.file_path import GetModel
from app_projects.models.model import ParamsData as model


def get_not_exits_network_card(ip):
    output = ssh_popen_1(ip, "ls /sys/devices/virtual/net")
    vnic_list = output.split('\n')

    output = ssh_popen_1(ip, "ls /sys/class/net|grep -v 'bonding_masters'")
    nic_list = output.split('\n')

    pnic_list = list(set(nic_list) - set(vnic_list))

    exit_list = []

    for pnic in pnic_list:
        details = ssh_popen_1(ip, "ip a | grep {}".format(pnic))
        if 'ovs-system' not in details:
            speed = ssh_popen_1(ip, "ethtool {} | grep Speed".format(pnic))
            mac_address = ssh_popen_1(ip, "cat /sys/class/net/{}/address".format(pnic))
            # print os.system('ifconfig |grep "%s" |awk "{print $1}"|sed -n $i\p && ifconfig |grep -A1 "%s"|
            # grep inet| awk "{print $2}" |sed -n $i\p' % (pnic, pnic))
            ip_a_master = ssh_popen_1(ip, "ip a | grep {} | grep -v master".format(pnic))

            test_br0 = ssh_popen_1(ip, "ip a | grep {} | grep br0".format(pnic))

            current_app.logger.info('开发环境网卡信息:{0}, 测试返回数据{1}'.format(ip_a_master, test_br0))

            if ip_a_master or test_br0:
                static = ssh_popen_1(ip, "ethtool " + pnic + " |grep detected")
                # network_info = ssh_popen_1(ip, "ifconfig {} | grep inet | grep -v inet6".format(pnic))
                try:
                    exit_list.append({
                        "network_name": pnic,
                        "speed": speed.split(':')[-1],
                        "mac_address": mac_address,
                        "static": 0 if 'no' in static else 1
                    })
                except Exception as e:
                    raise e

            elif ip_a_master == "":
                exit_list.append({"message": "没有可用的网卡", "code": 1})
                break

    return exit_list


def get_system_info(ip):
    """获取物理机的详情"""
    # 字节转换GB单位
    mem = int(ssh_popen_1(ip, "cat /proc/meminfo | grep MemTotal").split(':')[1].replace(' ', '')
              .split('kB')[0]) / 1024 ** 2
    _cpu_count = ssh_popen_1(ip, "cat /proc/cpuinfo | grep 'processor' | wc -l")  # 可用的总数
    available_disk = ssh_popen_1(ip, "ceph osd df | grep TOTAL")
    if available_disk:
        _a_disk = available_disk.split(' ')[1:]
        disk_data = []
        for item in _a_disk:
            if item:
                if 'G' in item:
                    disk_data.append(int(item.split('G')[0]))
                elif 'M' in item:
                    disk_data.append(int(item.split('M')[0]) / 1024.0)

        data = {
            "cpu": "4/{}".format(_cpu_count),
            "mem": "8/{}".format(mem),
            "disk": "{}/{}".format(disk_data[1], int(disk_data[0]))
        }

        model.update_or_create('count_cpu', int(_cpu_count) - 1)
        model.update_or_create('count_mem', mem)
        model.update_or_create('count_disk', int(disk_data[0]))
        current_app.logger.info('-----model panaocs-----{}'.format(GetModel.cpu_count()))
        return data
    return []


def set_system_info(ip, cpu, mem):
    """设置nova配置文件 cpu和内存"""
    vcpu_pin_set = '4-{}'.format(GetModel.cpu_count() - cpu)
    mem_set = (mem + 8) * 1024
    out_cpu = ssh_popen_1(ip, "cat /etc/nova/nova.conf | grep vcpu_pin_set")
    out_mem = ssh_popen_1(ip, "cat /etc/nova/nova.conf | grep reserved_host_memory_mb")
    if out_cpu:
        ssh_popen_1(ip, "sed -i 's/{}/vcpu_pin_set = {}/' {file}"
                    .format(out_cpu, vcpu_pin_set, file="/etc/nova/nova.conf"))
    else:
        ssh_popen_1(ip, "echo vcpu_pin_set = {} >> {file}".format(vcpu_pin_set, file="/etc/nova/nova.conf"))
    # 设置内存  单位为M
    if out_mem:
        ssh_popen_1(ip, "sed -i 's/{}/reserved_host_memory_mb = {}/' {file}"
                    .format(out_mem, mem_set, file="/etc/nova/nova.conf"))
    else:
        ssh_popen_1(ip, "echo reserved_host_memory_mb = {} >> {file}".format(mem_set, file="/etc/nova/nova.conf"))
    current_app.logger.info('设置nova配置完成')


if __name__ == '__main__':
    # a = get_not_exits_network_card()
    # print a
    # set_network_card('1.1.1.1', '1.1.1.1')
    a = get_system_info("192.168.6.63")

    # p = ssh_popen_1("192.168.102.91", "cat /etc/nova/nova.conf | grep vcpu_pin_set")
    # print p
    # print get_not_exits_network_card('192.168.6.199')
    # set_system_info('192.168.6.197', 8, 8*1024)
