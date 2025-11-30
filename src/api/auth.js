//认证相关api
import request from '@/utils/request';

/**
 * 管理员登录
 * 注意：这里复用小程序的登录接口，实际项目中可能需要区分用户和管理员
 * @param {string} codeId - 管理员凭证或code
 * @returns {Promise<{token: string}>}
 */
export function adminLogin(codeId) {
    return request({
        url: '/auth/login',
        method: 'post',
        data: { codeId } // 假设后端能根据codeId区分角色
    });
}
