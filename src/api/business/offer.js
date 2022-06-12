import request from '@/utils/request'

// 查询报价列表
export function listOffer(query) {
  return request({
    url: '/business/offer/list',
    method: 'get',
    params: query
  })
}

// 查询报价详细
export function getOffer(offerId) {
  return request({
    url: '/business/offer/' + offerId,
    method: 'get'
  })
}

// 新增报价
export function addOffer(data) {
  return request({
    url: '/business/offer',
    method: 'post',
    data: data
  })
}

// 修改报价
export function updateOffer(data) {
  return request({
    url: '/business/offer',
    method: 'put',
    data: data
  })
}

// 删除报价
export function delOffer(offerId) {
  return request({
    url: '/business/offer/' + offerId,
    method: 'delete'
  })
}
