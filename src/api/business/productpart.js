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

// 部件新增 查询起重机类型列表
export function getAddPartCraneType(query) {
  return request({
    url: '/business/product/getAddPartCraneType',
    method: 'get',
    params: query,
  })
}
// 部件新增 查询操作方式列表
export function getCraneOperationByCraneType(query) {
  return request({
    url: '/business/product/getCraneOperationByCraneType',
    method: 'get',
    params: query,
  })
}
// 部件新增 查询起重机型号列表
export function getcraneModelBytwo(query) {
  return request({
    url: '/business/product/getcraneModelBytwo',
    method: 'get',
    params: query,
  })
}
// 部件新增 查询工作级别列表
export function getworkLevelBythree(query) {
  return request({
    url: '/business/product/getworkLevelBythree',
    method: 'get',
    params: query,
  })
}
// 部件新增 查询起升高度列表
export function getliftHeightByfourth(query) {
  return request({
    url: '/business/product/getliftHeightByfourth',
    method: 'get',
    params: query,
  })
}
