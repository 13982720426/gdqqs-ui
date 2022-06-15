export default defineStore(
    'offer',
    {
        state: () => ({
            customer: {},
            product: [],
            partData: {}
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
            getCustomerData() {
              return {
                  customerId: this.customer.customerId,
                  customerItem: this.customer.customerItem,
                  workshopInfo: JSON.parse(this.customer.workshopInfo || '[]')
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
                allProduct.forEach(item => {
                    item.amount.forEach(amountItem => {
                        price += Number(amountItem.partQuote.price)
                    })
                })
                console.log(price)
                return price
            },
            getPartData() {
                return this.partData
            },
            getAllData() {
                if (Object.keys(this.customer).length && Object.keys(this.product).length && Object.keys(this.partData).length) {
                    return {
                        customer: this.customer,
                        product: this.product,
                        partData: this.partData
                    }
                } else {
                    return false
                }
            }
        }
    }
)