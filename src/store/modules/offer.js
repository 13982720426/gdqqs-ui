export default defineStore(
    'offer',
    {
        state: () => ({
            customer: {},
            product: {},
            partData: {}
        }),
        actions: {
            setCustomerData(data) {
                this.customer = data
                console.log(data)
            },
            setProductData(data) {
                this.product = data
                console.log(data)
            },
            setPartData(data) {
                this.partData = data
                console.log(data)
            },
            getCustomerData() {
              return {
                  customerId: this.customer.customerId,
                  workshopInfo: JSON.parse(this.customer.workshopInfo || '[]')
              }
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