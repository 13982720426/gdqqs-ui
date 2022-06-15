import request from '@/utils/request'

export const queryList = (params) => request({ url: '/business/offer/list', method: 'get', params })

export const addOffer = (data) => request.post('/business/offer', data)