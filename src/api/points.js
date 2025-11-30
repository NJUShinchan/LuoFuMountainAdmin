//积分管理API
import request from '@/utils/request';

// --- 以下API均需后端实现 ---

/**
 * 获取积分策略
 * @returns {Promise<object>} - e.g., { dailyCheckinPoints: 10, consecutiveBonus: [...] }
 */
export function getPointsPolicy() {
    return request({
        url: '/admin/points/policy',
        method: 'get'
    });
}

/**
 * 更新积分策略
 * @param {object} data - 策略数据
 * @returns {Promise}
 */
export function updatePointsPolicy(data) {
    return request({
        url: '/admin/points/policy',
        method: 'put',
        data
    });
}

/**
 * 获取积分变动记录
 * @param {object} params - 查询参数 { current, size, userId?, startTime?, endTime? }
 * @returns {Promise<{records: [], total: number}>}
 */
export function getPointsRecords(params) {
    return request({
        url: '/admin/points/records',
        method: 'get',
        params
    });
}

/**
 * 批量调整用户积分
 * @param {object} data - { userIds: number[], points: number, reason: string }
 * @returns {Promise}
 */
export function batchAdjustPoints(data) {
    return request({
        url: '/admin/points/batch-adjust',
        method: 'post',
        data
    });
}
