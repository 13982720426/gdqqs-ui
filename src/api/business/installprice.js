import request from '@/utils/request'

// 查询安装费用列表
export function listInstallprice(query) {
  return request({
    url: '/business/installprice/list',
    method: 'get',
    params: query
  })
}

// 查询安装费用详细
export function getInstallprice(installPriceId) {
  return request({
    url: '/business/installprice/' + installPriceId,
    method: 'get'
  })
}

// 新增安装费用
export function addInstallprice(data) {
  return request({
    url: '/business/installprice',
    method: 'post',
    data: data
  })
}

// 修改安装费用
export function updateInstallprice(data) {
  return request({
    url: '/business/installprice',
    method: 'put',
    data: data
  })
}

// 删除安装费用
export function delInstallprice(installPriceId) {
  return request({
    url: '/business/installprice/' + installPriceId,
    method: 'delete'
  })
}
