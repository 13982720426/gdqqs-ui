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
        })
        this.setProductData(productList)
      }
      if (Object.keys(this.partData).length) {
        const { craneDataSource, installDataSource} = this.partData
        workshopInfo.forEach((item, index) => {
          craneDataSource[index].workshopName = item.name
          installDataSource[index].workshopName = item.name
        })
        this.setPartData(this.partData)
      }
    },
    setProductData(data) {
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
