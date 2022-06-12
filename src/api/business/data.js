import request from '@/utils/request'

// 查询轨道数据列表
export function listData(query) {
  return request({
    url: '/business/data/list',
    method: 'get',
    params: query
  })
}

// 查询轨道数据详细
export function getData(trackDataId) {
  return request({
    url: '/business/data/' + trackDataId,
    method: 'get'
  })
}

// 新增轨道数据
export function addData(data) {
  return request({
    url: '/business/data',
    method: 'post',
    data: data
  })
}

// 修改轨道数据
export function updateData(data) {
  return request({
    url: '/business/data',
    method: 'put',
    data: data
  })
}

// 删除轨道数据
export function delData(trackDataId) {
  return request({
    url: '/business/data/' + trackDataId,
    method: 'delete'
  })
}
