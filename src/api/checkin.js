//打卡点管理API
import request from '@/utils/request';

// --- 文档中已提供的查询API ---

/**
 * 获取所有打卡点列表
 * @returns {Promise<Array>}
 */
export function getCheckinLocationList() {
    return request({
        url: '/checkin/location/list',
        method: 'get'
    });
}


// --- 以下为管理后台需要的增删改API，需后端实现 ---

/**
 * 创建新的打卡点
 * @param {object} data - 打卡点数据 { name, latitude, longitude, score, radius, status }
 * @returns {Promise}
 */
export function createCheckinPoint(data) {
    return request({
        url: '/admin/checkin/location', // 管理端API路径
        method: 'post',
        data
    });
}

/**
 * 更新打卡点信息 (包括启用/停用)
 * @param {object} data - 打卡点数据，需包含id { id, name, latitude, longitude, score, radius, status }
 * @returns {Promise}
 */
export function updateCheckinPoint(data) {
    return request({
        url: `/admin/checkin/location/${data.id}`,
        method: 'put',
        data
    });
}

/**
 * 批量导入打卡点
 * @param {Array<object>} data - 打卡点数据数组
 * @returns {Promise}
 */
export function batchImportCheckinPoints(data) {
    return request({
        url: '/admin/checkin/location/batch-import',
        method: 'post',
        data
    });
}
