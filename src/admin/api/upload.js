//文件上传API
import request from '@/utils/request';

/**
 * 上传文件
 * @param {File} file - 要上传的文件
 * @param {string} [bizType] - 业务类型标识（image / video / file ...）
 * @returns {Promise<{data: {url: string, fileType: string, size: number}}>}
 */
export function uploadFile(file, bizType) {
  const formData = new FormData()
  formData.append('file', file)
  if (bizType) {
    formData.append('bizType', bizType)
  }

  return request({
    url: '/common/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    skipAuth: true        // 这个请求不带 Authorization
  })
}
