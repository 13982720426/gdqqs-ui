export default defineStore('offer', {
  state: () => ({
    customer: {},
    product: [],
    partData: {},
    payData: {},
    type: 'add',
  }),
  actions: {
    setCustomerData(data) {
      this.customer = data
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
