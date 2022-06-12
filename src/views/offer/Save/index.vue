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
      <Customer v-if="stepsKey === 0"></Customer>
      <OfferSaveProduct v-else-if="stepsKey === 1"></OfferSaveProduct>
      <OfferPart v-else-if="stepsKey === 2"></OfferPart>
      <OfferSavePayment v-else-if="stepsKey === 3"></OfferSavePayment>
    </div>
    <div class="offer-save-footer">
      <el-button :disabled="stepsKey === 3" @click="stepsNext()">下一步</el-button>
      <el-button :disabled="stepsKey === 0" @click="stepsPrev()">上一步</el-button>
      <el-button>保存</el-button>
    </div>
  </div>
</template>

<script setup name="OfferSave">
import OfferSaveTitle from '../components/Title'
import OfferSaveProduct from './product/index'
import OfferSavePayment from './Payment'
import OfferPart from './part'
import Customer from './Customer'

import { ref } from 'vue'

const stepsKey = ref(0)

const stepsNext = () => {
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