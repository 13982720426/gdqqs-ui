import request from '@/utils/request'

// 查询油漆部件列表
export function listPart(query) {
  return request({
    url: '/business/part/list',
    method: 'get',
    params: query
  })
}

// 查询油漆部件详细
export function getPart(paintPartId) {
  return request({
    url: '/business/part/' + paintPartId,
    method: 'get'
  })
}

// 新增油漆部件
export function addPart(data) {
  return request({
    url: '/business/part',
    method: 'post',
    data: data
  })
}

// 修改油漆部件
export function updatePart(data) {
  return request({
    url: '/business/part',
    method: 'put',
    data: data
  })
}

// 删除油漆部件
export function delPart(paintPartId) {
  return request({
    url: '/business/part/' + paintPartId,
    method: 'delete'
  })
}
