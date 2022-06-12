import request from '@/utils/request'

// 查询大车部件ID列表
export function listCrastopmodelpart(query) {
  return request({
    url: '/business/crastopmodelpart/list',
    method: 'get',
    params: query
  })
}

// 查询大车部件ID详细
export function getCrastopmodelpart(cartPartId) {
  return request({
    url: '/business/crastopmodelpart/' + cartPartId,
    method: 'get'
  })
}

// 新增大车部件ID
export function addCrastopmodelpart(data) {
  return request({
    url: '/business/crastopmodelpart',
    method: 'post',
    data: data
  })
}

// 修改大车部件ID
export function updateCrastopmodelpart(data) {
  return request({
    url: '/business/crastopmodelpart',
    method: 'put',
    data: data
  })
}

// 删除大车部件ID
export function delCrastopmodelpart(cartPartId) {
  return request({
    url: '/business/crastopmodelpart/' + cartPartId,
    method: 'delete'
  })
}
