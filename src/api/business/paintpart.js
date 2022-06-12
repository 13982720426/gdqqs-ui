import request from '@/utils/request'

// 查询油漆部件列表
export function listPaintpart(query) {
  return request({
    url: '/business/paintpart/list',
    method: 'get',
    params: query
  })
}

// 查询油漆部件详细
export function getPaintpart(paintPartId) {
  return request({
    url: '/business/paintpart/' + paintPartId,
    method: 'get'
  })
}

// 新增油漆部件
export function addPaintpart(data) {
  return request({
    url: '/business/paintpart',
    method: 'post',
    data: data
  })
}

// 修改油漆部件
export function updatePaintpart(data) {
  return request({
    url: '/business/paintpart',
    method: 'put',
    data: data
  })
}

// 删除油漆部件
export function delPaintpart(paintPartId) {
  return request({
    url: '/business/paintpart/' + paintPartId,
    method: 'delete'
  })
}
