import { cloneDeep, omit, uniq, sortBy} from 'lodash-es'
import { getDicts } from '@/api/system/dict/data'


export default defineStore('offer', {
  state: () => ({
    customer: {},
    product: [],
    partData: {},
    payData: {},
    type: 'add',
    tax: 0,
  }),
  actions: {
    setCustomerData(data) { // 设置客户信息
      this.customer = data
      const { workshopInfo } = this.getCustomerData()
      if (this.product.length) { // 修改产品中的车间信息
        const productList = this.getProductData()
        workshopInfo.forEach(item => {
          const productObj = productList.find(b => b.key === item.key)
          if(!!productObj){
            const amountCount = productObj.amount.length
            const amounts = new Array(item.amount).fill(1).map((b) => ({
              type: undefined,
              operation: undefined,
              weight: undefined,
              level: undefined,
            }))
            productObj.name = item.name
            const newAmounts = amounts.map((item, index) => {
              if (index + 1 <= amountCount) {
                return productObj.amount[index]
              }
              return item
            })     
            productObj.amount = [...newAmounts]
          }
        })
        this.setProductData(productList)

        // 车间起重机数量变化，清空滑线
        productList.forEach(item2=>{
          this.partData.slipLineData?.splId.forEach(item3=>{
            if(item2.key === item3.key){
              item2.amount.forEach(item4=>{
                if(item4.type == undefined){
                  item3.splPartId = '' // 车间起重机数量新增，清空对应滑线
                }
              })
              if(item2.amount.length !== item3.amount){
                item3.splPartId = '' // 车间起重机数量减少，清空对应滑线
              }
            }
          })
        })
        
        this.upDataPartData(this.partData,workshopInfo)   // 更新项目报价数据

        workshopInfo.forEach(workshopInfoItem => {
          this.upDataPartName(this.partData.slipLineData?.splId, workshopInfoItem) // 滑线/轨道数据名称
        })
        this.setPartData(this.partData)
      }
    },

    // 更新项目报价数据
    upDataPartData(partData,workshopInfo){
      const {slipLineData,slipLine,track} = partData
      const keyValues = workshopInfo.map(item=>(item.key).toString())
      for (let key in slipLine) {
        if(!keyValues.includes(key)){
          delete slipLine[key]
        }
      }
      for (let key in track) {
        if(!keyValues.includes(key)){
          delete track[key]
        }
      }
      if(!slipLineData) return 
      slipLineData.splId = slipLineData?.splId.filter(item=>keyValues.includes((item.key).toString()))||'' //更新数据
    },
    /**
     * 更新项目报价中车间名字    
     * @param {} data  XX数据
     * @param {} item  车间遍历的item
     */
    upDataPartName(data, workshopInfoItem){
      if(data){
        data.forEach(item2=>{
          if(item2.key == workshopInfoItem.key){
            if(item2.workshopName){
              item2.workshopName = workshopInfoItem.name
            }else{
              item2.name = workshopInfoItem.name
            }
          }
        })
      }
    },


    numberToFixed(number, length = 2){
      return number ? Number(number.toFixed(length)) : 0
    },

    setProductData(data) {
      if (Object.keys(this.partData).length) {
        getDicts('q_tax_rate').then(resp=>{
          if (resp.code === 200 && resp.data.length) {
            this.tax = Number(resp.data[0].dictValue)

            const oldSliLine =sortBy(uniq(Object.keys(this.partData.slipLine)))
            const newSliLine =sortBy(uniq(this.partData.slipLineData.splId.map(item=>(item.key).toString())))
            if(oldSliLine.toString() !== newSliLine.toString()){
              const keyValues = this.partData.slipLineData.splId.map(item=>item.key)
              data = data.filter(item=>keyValues.includes(item.key)) //更新数据
            }
            let marketTotal = 0 // 市场成本合计
            let amountCount = 0 // 起重机数量
            const _craneDataSource = [] // 起重机运输
            const _installDataSource = [] // 起重机安装及吊装费
            const _marketDataSource = [] // 起重机市场监管局特检费

            data.forEach((pItem) => {
              // 读取起重机数量，生成列表
              const workshopName = pItem.name
              const key = pItem.key
              amountCount += pItem.amount.length
              pItem.amount.forEach((amountItem) => {
                const newObject = {
                  key,
                  workshopName,
                  model: amountItem.productData?.name,
                  weight: amountItem.weight,
                }
                let AcceptanceFee = 0
                if (parseFloat(amountItem.weight) > 3) {
                  AcceptanceFee = 1000
                }
                marketTotal += this.numberToFixed(AcceptanceFee * this.tax)
                _craneDataSource.push({
                  ...cloneDeep(newObject),
                  freight: 2500,
                  taxPayment: 0,
                  total: 0,
                })
                _installDataSource.push({
                  ...cloneDeep(newObject),
                  install: 1000,
                  hoisting: 1500,
                  taxPayment: 0,
                  total: 0,
                })
                _marketDataSource.push({
                  ...cloneDeep(newObject),
                  acceptance: AcceptanceFee,
                  taxPayment: 0,
                })
              })
            })
            this.partData.marketTotalData.total = marketTotal
            this.partData.craneDataSource = _craneDataSource
            this.partData.installDataSource = _installDataSource
            this.partData.marketDataSource = _marketDataSource
              
            this.partData.transportTotalData.count = amountCount
            this.partData.installTotalData.count = amountCount
            this.partData.marketTotalData.count = amountCount
          }
        })
        this.setPartData(this.partData)
      }

      this.product = data
    },
    setPartData(data) {
      this.partData = data
    },
    setPaymentData(data) {
      this.payData = data
    },
    updateType(data) {
      this.type = data
    },
    getCustomerData() {
      return {
        customerId: this.customer.customerId,
        customerItem: this.customer.customerItem,
        workshopInfo: JSON.parse(this.customer.workshopInfo || '[]'),
      }
    },
    getProductData() {
      return this.product
    },
    getProductInfo() {
      const workshopInfo = this.getCustomerData().workshopInfo
      const arr = []
      workshopInfo.forEach((_, index) => {
        arr.push(this.product[index])
      })
      return arr
    },
    getAllProductPrice() {
      const allProduct = this.getProductInfo()
      let price = 0
      allProduct.forEach((item) => {
        item.amount.forEach((amountItem) => {
          price += Number(amountItem.partQuote.price)
        })
      })
      return price
    },
    getPartData() {
      return this.partData
    },
    getPayData() {
      return this.payData
    },
    init() {
      this.customer = {}
      this.product = []
      this.partData = {}
      this.payData = {}
      this.type = 'add'
      this.tax = 0
    },
  },
})
