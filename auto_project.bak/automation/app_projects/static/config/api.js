// 该配置文件定义了调用api的url
// 接口命名规范包括：
// 1. 以下划线连接
// 2. 名称以请求动词开头
// 3. api中的第一个字段为对象名称
// 4. api的第二个字段及之后的字段跟在请求动词之后
// 5. 遇到需要特定id或name的地方使用detail代替
// 6. api中的横杠(-)使用下划线(_)代替

module.exports = {
	post_deploy_type:'/deploy_type/',//部署类型
	get_usb:'/usb/',//获取usb列表
	get_deploy_status:'/deploy_status/',//获取部署状态
	post_account:'/verify_pw/',//验证账号和密码
	get_panacube:'/panacube/',//获取公有网络
	post_panacube:'/panacube/',//传递筋斗云配置信息
	get_verify_ip:'/verify_ip/',//检测ip是否被占用
	get_nodes:'/node/',//获取所有节点,
	get_nic:'/network_card_info/',//获取网卡信息
	get_node_info:'/get_system_node/',//获取某个节点的信息
	post_deploy_bigdata:'/get_system_node/',//部署大数据
	get_separate:'/deploy_separate_bigdata/',//获取物理磁盘
	post_deploy:'/deploy/',//开始部署接口
	get_deploy_process:'/message_code/',//部署进度
	post_deploy_bigdatainfo:'/deploy_bigdata/',//部署大数据
	post_deploy_storage_image:'/upload_storage_image/',//上传镜像
	post_deploy_docker:'/deploy_docker/',//docker部署
	post_deploy_cloud:'/deploy_cloud/',//kvm部署
	post_verify_bigdata:'/verify_bigdata/',//验证大数据是否填写过
	getJumpIp:'/block/',//获取跳转的ip
	updateDb:'/update_db/',//升级数据库
	updateCloud:'/update_cloud/',//升级云中心
};
