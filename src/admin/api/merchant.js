import request from '@/utils/request'

// 3.4.1 创建商家账号
export function createMerchant(data) {
  return request({
    url: '/admin/merchant',
    method: 'post',
    data
  })
}

// 3.4.2 查询商家列表
export function getMerchantList(params) {
  return request({
    url: '/admin/merchant/list',
    method: 'get',
    params
  })
}

// 3.4.3 查询商家详情
export function getMerchantDetail(id) {
  return request({
    url: '/admin/merchant/detail',
    method: 'get',
    params: { id: id }
  })
}


// 3.4.4 修改商家信息
export function updateMerchant(data) {
  return request({
    url: '/admin/merchant/update',
    method: 'post',
    data
  })
}

// 3.4.5 重置商家密码
export function resetMerchantPassword(data) {
  return request({
    url: '/admin/merchant/password/reset',
    method: 'post',
    data
  })
}

// 3.4.6 启用/禁用商家
export function updateMerchantStatus(data) {
  return request({
    url: '/admin/merchant/status/update',
    method: 'post',
    data
  })
}

// 3.4.7 删除商家
export function deleteMerchant(id) {
  return request({
    url: '/admin/merchant/delete',
    method: 'post',
    data: { id }
  })
}
