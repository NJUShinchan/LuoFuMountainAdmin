//礼品/商城API
import request from '@/utils/request';

// --- 文档中提到了兑换商城列表，但未明确路径，此处假设一个路径 ---

/**
 * 获取兑换商城列表
 * @param {object} params - 查询参数 { current, size, sortBy } (sortBy: 'asc' | 'desc')
 * @returns {Promise<{records: [], total: number}>}
 */
export function getMallList(params) {
    return request({
        url: '/mall/list', // 假设的路径
        method: 'get',
        params
    });
}


// --- 以下为管理后台需要的增删改API，需后端实现 ---

/**
 * 创建新礼品
 * @param {object} data - 礼品数据 { name, points, stock, rule, status }
 * @returns {Promise}
 */
export function createMallItem(data) {
    return request({
        url: '/admin/mall/item',
        method: 'post',
        data
    });
}

/**
 * 更新礼品信息
 * @param {object} data - 礼品数据，需包含id { id, name, points, stock, rule, status }
 * @returns {Promise}
 */
export function updateMallItem(data) {
    return request({
        url: `/admin/mall/item/${data.id}`,
        method: 'put',
        data
    });
}

/**
 * 删除礼品
 * @param {number} id - 礼品ID
 * @returns {Promise}
 */
export function deleteMallItem(id) {
    return request({
        url: `/admin/mall/item/${id}`,
        method: 'delete'
    });
}
