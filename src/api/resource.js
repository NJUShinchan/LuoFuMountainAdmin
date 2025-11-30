//景点/住宿/餐饮资源API
import request from '@/utils/request';

// --- 文档中已提供的查询API ---

/**
 * 获取资源列表
 * @param {object} params - 查询参数 { current, size, type, fuzzy }
 * @returns {Promise<{records: [], total: number}>}
 */
export function getResourceList(params) {
    return request({
        url: '/resource/list',
        method: 'get',
        params
    });
}

/**
 * 获取资源详情 (正文内容)
 * @param {number} id - 资源ID
 * @returns {Promise<string>} - 返回JSON格式的字符串
 */
export function getResourceContent(id) {
    return request({
        url: '/resource/content',
        method: 'get',
        params: { id }
    });
}


// --- 以下为管理后台需要的增删改API，需后端实现 ---

/**
 * 创建新资源 (景点/住宿/餐饮)
 * @param {object} data - 资源数据 { name, type, coverImg, hotScore, content }
 * @returns {Promise}
 */
export function createResource(data) {
    return request({
        url: '/resource', // RESTful风格: POST /resource
        method: 'post',
        data
    });
}

/**
 * 更新资源
 * @param {object} data - 资源数据，需包含id { id, name, type, coverImg, hotScore, content, status }
 * @returns {Promise}
 */
export function updateResource(data) {
    return request({
        url: `/resource/${data.id}`, // RESTful风格: PUT /resource/{id}
        method: 'put',
        data
    });
}

/**
 * 删除资源
 * @param {number} id - 资源ID
 * @returns {Promise}
 */
export function deleteResource(id) {
    return request({
        url: `/resource/${id}`, // RESTful风格: DELETE /resource/{id}
        method: 'delete'
    });
}
