
import request from '@/utils/request'

// 3.1.1 管理端解锁（登录）
export function unlockAdmin(data) {
  return request({
    url: '/admin/unlock',
    method: 'post',
    data
  })
}

// 3.1.2 修改管理端密码
export function updateAdminPassword(data) {
  return request({
    url: '/admin/password/update',
    method: 'post',
    data
  })
}

