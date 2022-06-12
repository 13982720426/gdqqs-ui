import request from '@/utils/request'

// 查询运输费用列表
export function listTransportprice(query) {
  return request({
    url: '/business/transportprice/list',
    method: 'get',
    params: query
  })
}

// 查询运输费用详细
export function getTransportprice(transportPriceId) {
  return request({
    url: '/business/transportprice/' + transportPriceId,
    method: 'get'
  })
}

// 新增运输费用
export function addTransportprice(data) {
  return request({
    url: '/business/transportprice',
    method: 'post',
    data: data
  })
}

// 修改运输费用
export function updateTransportprice(data) {
  return request({
    url: '/business/transportprice',
    method: 'put',
    data: data
  })
}

// 删除运输费用
export function delTransportprice(transportPriceId) {
  return request({
    url: '/business/transportprice/' + transportPriceId,
    method: 'delete'
  })
}
