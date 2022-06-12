import request from '@/utils/request'

// 查询轨道部件列表
export function listTrackpart(query) {
  return request({
    url: '/business/trackpart/list',
    method: 'get',
    params: query
  })
}

// 查询轨道部件详细
export function getTrackpart(trackPartId) {
  return request({
    url: '/business/trackpart/' + trackPartId,
    method: 'get'
  })
}

// 新增轨道部件
export function addTrackpart(data) {
  return request({
    url: '/business/trackpart',
    method: 'post',
    data: data
  })
}

// 修改轨道部件
export function updateTrackpart(data) {
  return request({
    url: '/business/trackpart',
    method: 'put',
    data: data
  })
}

// 删除轨道部件
export function delTrackpart(trackPartId) {
  return request({
    url: '/business/trackpart/' + trackPartId,
    method: 'delete'
  })
}
