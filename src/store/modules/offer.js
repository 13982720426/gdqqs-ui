export default defineStore('offer', {
  state: () => ({
    customer: {},
    product: [],
    partData: {},
    payData: {},
    type: 'add',
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
      }
      if (Object.keys(this.partData).length) {
        const { craneDataSource, installDataSource, marketDataSource ,slipLineData} = this.partData

        const keyValues=workshopInfo.map(item=>item.key)
        slipLineData.splId = slipLineData.splId.filter(item=>keyValues.includes(item.key)) //去除删除的数据

        workshopInfo.forEach(workshopInfoItem => {
          this.upDataName(craneDataSource, workshopInfoItem) // 起重机运输
          this.upDataName(installDataSource, workshopInfoItem) // 起重机安装及吊装费
          this.upDataName(marketDataSource, workshopInfoItem) // 起重机市场监管局特检费
          this.upDataName(slipLineData.splId, workshopInfoItem) // 滑线/轨道数据
        })
        console.log('this.partData', this.partData);
        this.setPartData(this.partData)
      }
    },

    /**
     * 更新项目报价中车间名字    
     * @param {} data  XX数据
     * @param {} item  车间遍历的item
     */
    upDataName(data,workshopInfoItem){
      data.forEach(item2=>{
        if(item2.key == workshopInfoItem.key){
          if(item2.workshopName){
            item2.workshopName = workshopInfoItem.name
          }else{
            item2.name = workshopInfoItem.name
          }
        }
      })
    },

    setProductData(data) {
      console.log('this.partData2', this.partData,data);

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
    },
  },
})
