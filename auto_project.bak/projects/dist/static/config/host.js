// 此配置文件用于配置axios跨域请求的地址和接口

module.exports = {
    baseURL: 'http://' + window.location.host,

    wsConfig: {
        url: 'ws://' + window.location.host,
        common_suffix: '/ws/udsafe/',
        awcloud_suffix: '/ws/event/'
	},
};
