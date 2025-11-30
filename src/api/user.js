//用户管理API
import request from '@/utils/request';

// --- 以下API均需后端实现 ---

/**
 * 获取用户列表
 * @param {object} params - 查询参数 { current, size, fuzzy, status }
 * @returns {Promise<{records: [], total: number}>}
 */
export function getUserList(params) {
    return request({
        url: '/admin/users',
        method: 'get',
        params
    });
}

/**
 * 更新用户状态 (冻结/恢复)
 * @param {number} id - 用户ID
 * @param {string} status - 'active' | 'frozen'
 * @returns {Promise}
 */
export function updateUserStatus(id, status) {
    return request({
        url: `/admin/users/${id}/status`,
        method: 'put',
        data: { status }
    });
}

/**
 * 获取用户详情 (包括积分、打卡记录等)
 * @param {number} id - 用户ID
 * @returns {Promise<object>}
 */
export function getUserDetail(id) {
    return request({
        url: `/admin/users/${id}`,
        method: 'get'
    });
}
