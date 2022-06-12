import request from '@/utils/request'

// 查询滑线数据列表
export function listSpldata(query) {
  return request({
    url: '/business/spldata/list',
    method: 'get',
    params: query
  })
}

// 查询滑线数据详细
export function getSpldata(splDataId) {
  return request({
    url: '/business/spldata/' + splDataId,
    method: 'get'
  })
}

// 新增滑线数据
export function addSpldata(data) {
  return request({
    url: '/business/spldata',
    method: 'post',
    data: data
  })
}

// 修改滑线数据
export function updateSpldata(data) {
  return request({
    url: '/business/spldata',
    method: 'put',
    data: data
  })
}

// 删除滑线数据
export function delSpldata(splDataId) {
  return request({
    url: '/business/spldata/' + splDataId,
    method: 'delete'
  })
}
