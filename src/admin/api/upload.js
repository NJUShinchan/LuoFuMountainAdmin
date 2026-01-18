//文件上传API
import request from '@/utils/request';

/**
 * 上传文件
 * @param {FormData} formData - 包含文件的FormData对象
 * @returns {Promise<{url: string}>}
 */
export function uploadFile(formData) {
    return request({
        url: '/uploadFile', // 文档中提供的路径
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}
