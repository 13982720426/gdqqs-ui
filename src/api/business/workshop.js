import request from '@/utils/request'

// 查询车间ID列表
export function listWorkshop(query) {
  return request({
    url: '/business/workshop/list',
    method: 'get',
    params: query
  })
}

// 查询车间ID详细
export function getWorkshop(workshopId) {
  return request({
    url: '/business/workshop/' + workshopId,
    method: 'get'
  })
}

// 新增车间ID
export function addWorkshop(data) {
  return request({
    url: '/business/workshop',
    method: 'post',
    data: data
  })
}

// 修改车间ID
export function updateWorkshop(data) {
  return request({
    url: '/business/workshop',
    method: 'put',
    data: data
  })
}

// 删除车间ID
export function delWorkshop(workshopId) {
  return request({
    url: '/business/workshop/' + workshopId,
    method: 'delete'
  })
}
