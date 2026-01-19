import request from '@/utils/request'

// 3.2.1 新增/编辑资源
export function saveResource(data) {
  return request({
    url: '/admin/resource/save',
    method: 'post',
    data
  })
}

// 3.2.2 删除资源
export function deleteResource(id) {
  return request({
    url: '/admin/resource/delete',
    method: 'post',
    params: { id }  
  })
}

// 3.2.3 查询资源列表
export function getResourceList(params) {
  return request({
    url: '/admin/resource/list',
    method: 'get',
    params
  })
}

// 3.2.4 查询资源详情
export function getResourceDetail(id) {
  return request({
    url: '/admin/resource/detail',
    method: 'get',
    params: { id }
  })
}
