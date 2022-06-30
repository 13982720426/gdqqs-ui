import request from '@/utils/request'

// 查询产品部件
export function searchProductpart(query) {
  return request({
    url: '/business/productpart/search',
    method: 'get',
    params: query,
  })
}
// 产品部件列表
export function listProductpart(query) {
  return request({
    url: '/business/productpart/list',
    method: 'get',
    params: query,
  })
}

// 查询产品部件详细
export function getProductpart(productPartId) {
  return request({
    url: '/business/productpart/' + productPartId,
    method: 'get',
  })
}

// 新增产品部件
export function addProductpart(data) {
  return request({
    url: '/business/productpart',
    method: 'post',
    data: data,
  })
}

// 修改产品部件
export function updateProductpart(data) {
  return request({
    url: '/business/productpart',
    method: 'put',
    data: data,
  })
}

// 删除产品部件
export function delProductpart(productPartId) {
  return request({
    url: '/business/productpart/' + productPartId,
    method: 'delete',
  })
}
