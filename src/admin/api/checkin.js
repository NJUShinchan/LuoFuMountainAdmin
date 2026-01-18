import request from '@/utils/request'

// 3.3.1 新增/编辑打卡点
export function saveCheckinLocation(data) {
  return request({
    url: '/admin/checkin/location/save',
    method: 'post',
    data
  })
}

// 3.3.2 查询打卡点列表
export function getCheckinLocationList(params) {
  return request({
    url: '/admin/checkin/location/list',
    method: 'get',
    params
  })
}

// 3.3.3 删除打卡点
export function deleteCheckinLocation(id) {
  return request({
    url: `/admin/checkin/location/delete/${id}`,
    method: 'post'
  })
}
