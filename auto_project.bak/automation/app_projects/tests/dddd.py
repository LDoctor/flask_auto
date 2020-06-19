import os

os.system("""
        ssh node-1 <<EOF 
echo r'
while true
do
    ssh_rule_pid=`ps -ef | grep \'ssh -NCPf\' | grep -v grep |awk \'{print \$2}\'`
    if [[ $ssh_rule_pid == "" ]]; then
        mgmt_ip=\`ifconfig br_mgmt |grep inet |grep -v inet6 |awk '{print \$2}'\`
        ssh -NCPf root@\$mgmt_ip -L \$mgmt_ip:3308:haproxy-galera.service.consul:3306
    fi
    ssh_rule_influxdb_pid=`ps -ef | grep 'ssh -NCPf' | grep -v grep |awk '{print \$2}'`
    if [[ $ssh_rule_influxdb_pid == "" ]]; then
        mgmt_ip=\`ifconfig br_mgmt |grep inet |grep -v inet6 |awk '{print $2}'\`
        ssh -NCPf root@\$mgmt_ip -L \$mgmt_ip:18086:influxdb.service.consul:8086
    fi
done
' > /usr/local/bin/add_sshd.sh
EOF
""")
