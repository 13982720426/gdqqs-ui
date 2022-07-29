<template>
  <div class="offer-save-warp">
    <OfferSaveTitle title="报价进度">
      <el-steps :active="stepsKey">
        <el-step title="客户信息" />
        <el-step title="选择产品" />
        <el-step title="项目报价" />
        <el-step title="付款方式" />
      </el-steps>
    </OfferSaveTitle>
    <div class="offer-save-content">
      <Customer ref="customerRef" v-show="stepsKey === 0"></Customer>
      <OfferSaveProduct
        ref="productRef"
        v-show="stepsKey === 1"
      ></OfferSaveProduct>
      <OfferPart ref="partRef" v-show="stepsKey === 2"></OfferPart>
      <OfferSavePayment ref="payRef" v-show="stepsKey === 3"></OfferSavePayment>
    </div>
    <div class="offer-save-footer">
      <el-button :disabled="stepsKey === 3" @click="stepsNext()">
        下一步
      </el-button>
      <el-button :disabled="stepsKey === 0" @click="stepsPrev()">
        上一步
      </el-button>
      <el-button
        v-if="offerStore.type !== 'view'"
        :disabled="stepsKey !== 3"
        @click="saveData"
      >
        提交
      </el-button>
      <router-link :to="{ path: '/offer' }"><el-button style="margin-left:12px;">关闭</el-button></router-link>
      <!-- <el-button><router-link to="/offer">关闭</router-link></el-button> -->
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
import { useRouter } from 'vue-router'
import { onMounted, reactive } from 'vue'
import { getOffer } from '@/api/business/offer'
import { getCustomer } from '../../../api/business/customer'
import { updateOffer } from '../../../api/business/offer'
const router = useRouter()

const stepsKey = ref(0)
const customerRef = ref(null)
const productRef = ref(null)
const partRef = ref(null)
const payRef = ref(null)

const dialogVisible = ref(false)
const { proxy } = getCurrentInstance()

const offerStore = useOfferStore()

const offerState = reactive({
  id: '',
  type: '',
})

offerState.id = router.currentRoute.value.query.id
offerState.type = router.currentRoute.value.query.type

const saveData = async () => {
  const data = await payRef.value.getValues()
  if (!data) {
    return
  }
  // 第一步骤信息
  const customer = offerStore.getCustomerData()
  // 第二步骤信息
  const productInfo = offerStore.getProductData()
  // 获取产品报价
  const productPrice = offerStore.getAllProductPrice()
  // 第三步骤信息
  const partInfo = offerStore.getPartData()
  // 计算总利润
  const allProfit =
    partInfo.trackData.profit +
    partInfo.slipLineData.profit +
    partInfo.transportTotalData.profit +
    partInfo.installTotalData.profit +
    partInfo.marketTotalData.profit
  // 计算总销售价
  const allSales =
    partInfo.trackData.sales +
    partInfo.slipLineData.sales +
    partInfo.transportTotalData.sales +
    partInfo.installTotalData.sales +
    partInfo.marketTotalData.sales

  const { offerName, ...paymentInfo } = data
  // 组装所有数据
  const obj = {
    contractPrice: (allSales + productPrice).toFixed(2), // 合同价格
    paymentMethodInfo: JSON.stringify(paymentInfo), // 付款方式json
    customerId: customer.customerId,
    offerName: offerName,
    productInfo: JSON.stringify(productInfo), // 产品信息json
    profit: allProfit.toFixed(2), // 利润
    workshopInfo: JSON.stringify(customer.workshopInfo), // 车间信息json
    trackInfo: JSON.stringify({
      dataSource: partInfo.track,
      statistics: partInfo.trackData,
    }), // 轨道信息json
    splInfo: JSON.stringify({
      dataSource: partInfo.slipLine,
      statistics: partInfo.slipLineData,
    }), // 滑线信息json
    transportPriceInfo: JSON.stringify({
      dataSource: partInfo.craneDataSource,
      statistics: partInfo.transportTotalData,
    }), // 运输费json
    installPriceInfo: JSON.stringify({
      dataSource: partInfo.installDataSource,
      statistics: partInfo.installTotalData,
    }), // 安装及吊装费json
    inspectPriceInfo: JSON.stringify({
      dataSource: partInfo.marketDataSource,
      statistics: partInfo.marketTotalData,
    }), // 市场监管局特检费json
  }
  const offerId = router.currentRoute.value.query.id
  const resp = router.currentRoute.value.query.id
    ? await updateOffer({ ...obj, offerId: offerId })
    : await addOffer(obj)
  if (resp.code === 200) {
    proxy.$modal.msgSuccess('提交成功')
    router.currentRoute.value.query.id=resp.msg
  } else {
    proxy.$modal.msgError(`提交失败`)
  }
}

/**
 * 下一步
 * @returns {Promise<void>}
 */
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

/**
 * 上一步，需要给用户确认是否保存当前信息
 */
const stepsPrev = () => {
  // TODO 确认是否保存当前信息
  console.log('上一步')
  stepsKey.value -= 1
}

const queryDetail = async () => {
  const resp = await getOffer(offerState.id)
  // console.log(2,resp);
  if (resp.code === 200) {
    try {
      const paymentMethodInfo = JSON.parse(resp.data.paymentMethodInfo) // 付款方式json
      const productInfo = JSON.parse(resp.data.productInfo) // 产品信息json
      const workshopInfo = JSON.parse(resp.data.workshopInfo) // 车间信息json

      const trackInfo = JSON.parse(resp.data.trackInfo) // 轨道信息json
      const splInfo = JSON.parse(resp.data.splInfo) // 滑线信息json
      const transportPriceInfo = JSON.parse(resp.data.transportPriceInfo) // 运输费json
      const installPriceInfo = JSON.parse(resp.data.installPriceInfo) // 安装及吊装费json
      const inspectPriceInfo = JSON.parse(resp.data.inspectPriceInfo) // 市场监管局特检费json
      const partInfo = {
        track: trackInfo.dataSource,
        trackData: trackInfo.statistics,
        slipLine: splInfo.dataSource,
        slipLineData: splInfo.statistics,
        transportTotalData: transportPriceInfo.statistics,
        craneDataSource: transportPriceInfo.dataSource,
        installTotalData: installPriceInfo.statistics,
        installDataSource: installPriceInfo.dataSource,
        marketTotalData: inspectPriceInfo.statistics,
        marketDataSource: inspectPriceInfo.dataSource,
      }
      const customerResp = await getCustomer(resp.data.customerId)
      // 获取客户详情
      offerStore.setCustomerData({
        customerId: resp.data.customerId,
        customerName: resp.data.customerName,
        customerItem: customerResp.code === 200 ? customerResp.data : {},
        workshopInfo: JSON.stringify(workshopInfo),
      })
      offerStore.setProductData(productInfo)
      offerStore.setPartData(partInfo)
      offerStore.setPaymentData({
        ...paymentMethodInfo,
        offerName: resp.data.offerName,
      })
    } catch (e) {
      console.warn(e)
    }
  }
}

watch(
  () => router.currentRoute.value.query.id,
  (value) => {
    if (!!value) {
      queryDetail()
      offerStore.updateType(offerState.type)
    }
  },
)

onMounted(() => {
  if (!!offerState.id) {
    queryDetail()
    offerStore.updateType(offerState.type)
  }
})
</script>

<style scoped lang="scss">
.offer-save-warp {
  padding-bottom: 24px;

  .title {
    margin-bottom: 24px;
  }
}
</style>
