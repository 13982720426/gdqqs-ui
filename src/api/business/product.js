import request from '@/utils/request'

// 查询产品列表
export function listProduct(query) {
  return request({
    url: '/business/product/list',
    method: 'get',
    params: query,
  })
}

// 查询产品详细
export function getProduct(productId) {
  return request({
    url: '/business/product/' + productId,
    method: 'get',
  })
}

// 新增产品信息回显
export function getAddProductMSG(data) {
  return request({
    url: '/business/product/getAddProductMSG',
    method: 'post',
    data: data,
  })
}
// 新增产品
export function addProduct(data) {
  return request({
    url: '/business/product',
    method: 'post',
    data: data,
  })
}

// 修改产品
export function updateProduct(data) {
  return request({
    url: '/business/product',
    method: 'put',
    data: data,
  })
}

// 删除产品
export function delProduct(productId) {
  return request({
    url: '/business/product/' + productId,
    method: 'delete',
  })
}
// 获取起重机型号列表
export function getcraneModelBycraneType(query) {
  return request({
    url: '/business/productpart/getcraneModelBycraneType',
    method: 'get',
    params: query,
  })
}
