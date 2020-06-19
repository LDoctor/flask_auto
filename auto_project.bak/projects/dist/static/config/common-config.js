/**
 * 此配置文件配置了可忽略Token的接口
 */
import api from './api'

export default {
    ignore:[
        api.management.get_verifycode,
        api.management.post_verifycode,
        api.management.post_api_token_refresh,
        api.management.post_login,
        api.management.post_verifysn,
        api.management.get_enterprise_sn,
        api.management.put_users_forget
    ],
    // 自动刷新token延时，单位分钟，只改最后一个数字即可
    tokenTimeout: 1000 * 60 * 20,
    authorization_ignore: [
        api.management.get_verifycode,
        api.management.post_verifycode,
        api.management.post_api_token_refresh,
        api.management.post_login,
        api.softwareAuthorization.getlicenseInfo,
        api.softwareAuthorization.importfile
    ]
}
