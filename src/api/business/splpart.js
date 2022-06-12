import request from '@/utils/request'

// 查询滑线部件列表
export function listSplpart(query) {
  return request({
    url: '/business/splpart/list',
    method: 'get',
    params: query
  })
}

// 查询滑线部件详细
export function getSplpart(splPartId) {
  return request({
    url: '/business/splpart/' + splPartId,
    method: 'get'
  })
}

// 新增滑线部件
export function addSplpart(data) {
  return request({
    url: '/business/splpart',
    method: 'post',
    data: data
  })
}

// 修改滑线部件
export function updateSplpart(data) {
  return request({
    url: '/business/splpart',
    method: 'put',
    data: data
  })
}

// 删除滑线部件
export function delSplpart(splPartId) {
  return request({
    url: '/business/splpart/' + splPartId,
    method: 'delete'
  })
}
