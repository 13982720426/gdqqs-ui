<template>
  <div class="offer-save-warp">
    <OfferSaveTitle
      title="报价进度"
    >
      <el-steps :active="stepsKey">
        <el-step title="客户信息" />
        <el-step title="选择产品" />
        <el-step title="项目报价" />
        <el-step title="付款方式" />
      </el-steps>
    </OfferSaveTitle>
    <div class="offer-save-content">
      <Customer ref="customerRef" v-if="stepsKey === 0"></Customer>
      <OfferSaveProduct ref="productRef" v-else-if="stepsKey === 1"></OfferSaveProduct>
      <OfferPart ref="partRef" v-else-if="stepsKey === 2"></OfferPart>
      <OfferSavePayment ref="payRef" v-else-if="stepsKey === 3"></OfferSavePayment>
    </div>
    <div class="offer-save-footer">
      <el-button :disabled="stepsKey === 3" @click="stepsNext()">下一步</el-button>
      <el-button :disabled="stepsKey === 0" @click="stepsPrev()">上一步</el-button>
      <el-button @click="saveData">保存</el-button>
    </div>
  </div>
</template>

<script setup name="OfferSave">
import OfferSaveTitle from '../components/Title'
import OfferSaveProduct from './product/index'
import OfferSavePayment from './Payment'
import OfferPart from './part'
import Customer from './Customer'
import useOfferStore from '@/store/modules/offer'
import { addOffer } from '@/api/offer'
const router = useRouter();

import { ref } from 'vue'
import {useRouter} from "vue-router";

const stepsKey = ref(0)
const customerRef = ref(null)
const productRef = ref(null)
const partRef = ref(null)
const payRef = ref(null)

const offerStore = useOfferStore()

const saveData = async () => {
  const data = await payRef.value.getValues()
  console.log(data)
  if (!data) {
    return
  }
  // 第一步骤信息
  const customer = offerStore.getCustomerData()
  // 第二步骤信息
  const productInfo = offerStore.getProductInfo()
  // 获取产品报价
  const productPrice = offerStore.getAllProductPrice()
  // 第三步骤信息
  const partInfo = offerStore.getPartData()
  // 计算总利润
  const allProfit = partInfo.trackData.profit +
      partInfo.slipLineData.profit +
      partInfo.transportTotalData.profit +
      partInfo.installTotalData.profit +
      partInfo.marketTotalData.profit
  // 计算总销售价
  const allSales = partInfo.trackData.sales +
      partInfo.slipLineData.sales +
      partInfo.transportTotalData.sales +
      partInfo.installTotalData.sales +
      partInfo.marketTotalData.sales
  // 组装所有数据
  const obj = {
    contractPrice: (allSales + productPrice).toFixed(2), // 合同价格
    paymentMethodInfo: JSON.stringify(data), // 付款方式json
    customerId: customer.customerId,
    productInfo: JSON.stringify(productInfo), // 产品信息json
    profit: allProfit.toFixed(2), // 利润
    workshopInfo: JSON.stringify(customer.workshopInfo), // 车间信息json
    trackInfo: JSON.stringify({
      dataSource: partInfo.track,
      statistics: partInfo.trackData
    }), // 轨道信息json
    splInfo: JSON.stringify({
      dataSource: partInfo.slipLine,
      statistics: partInfo.slipLineData
    }), // 滑线信息json
    transportPriceInfo: JSON.stringify({
      dataSource: partInfo.craneDataSource,
      statistics: partInfo.transportTotalData
    }), // 运输费json
    installPriceInfo: JSON.stringify({
      dataSource: partInfo.installDataSource,
      statistics: partInfo.installTotalData
    }), // 安装及吊装费json
    inspectPriceInfo: JSON.stringify({
      dataSource: partInfo.marketDataSource,
      statistics: partInfo.marketTotalData
    }), // 市场监管局特检费json
  }
  console.log(obj)
  const resp = await addOffer(obj)
  if (resp.code === 200) {
    router.push('/offer')
  }
}

const stepsNext = async () => {
    if (stepsKey.value === 0) {
      const data = await customerRef.value.getValues()
      if (!data) {
        return
      }
      offerStore.setCustomerData(data)
    } else if (stepsKey.value === 1) {
      const data = await productRef.value.getValues()
      if (!data) {
        return
      }
      offerStore.setProductData(data)
    } else if (stepsKey.value === 2) {
      const data = await partRef.value.getValues()
      if (!data) {
        return
      }
      offerStore.setPartData(data)
    }
    stepsKey.value += 1
}

const stepsPrev = () => {
  stepsKey.value -= 1
}

</script>

<style scoped lang="scss">
.offer-save-warp {
  .title {
    margin-bottom: 24px;
  }
}
</style>