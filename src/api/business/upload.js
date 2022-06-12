import request from '@/utils/request'

// 查询附件列表
export function listUpload(query) {
  return request({
    url: '/business/upload/list',
    method: 'get',
    params: query
  })
}

// 查询附件详细
export function getUpload(id) {
  return request({
    url: '/business/upload/' + id,
    method: 'get'
  })
}

// 新增附件
export function addUpload(data) {
  return request({
    url: '/business/upload',
    method: 'post',
    data: data
  })
}

// 修改附件
export function updateUpload(data) {
  return request({
    url: '/business/upload',
    method: 'put',
    data: data
  })
}

// 删除附件
export function delUpload(id) {
  return request({
    url: '/business/upload/' + id,
    method: 'delete'
  })
}
