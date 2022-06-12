import request from '@/utils/request'

// 查询特检费用列表
export function listPrice(query) {
  return request({
    url: '/business/price/list',
    method: 'get',
    params: query
  })
}

// 查询特检费用详细
export function getPrice(inspectPriceId) {
  return request({
    url: '/business/price/' + inspectPriceId,
    method: 'get'
  })
}

// 新增特检费用
export function addPrice(data) {
  return request({
    url: '/business/price',
    method: 'post',
    data: data
  })
}

// 修改特检费用
export function updatePrice(data) {
  return request({
    url: '/business/price',
    method: 'put',
    data: data
  })
}

// 删除特检费用
export function delPrice(inspectPriceId) {
  return request({
    url: '/business/price/' + inspectPriceId,
    method: 'delete'
  })
}
