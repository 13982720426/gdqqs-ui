<template>
  <div class="offer-save-product">
    <OfferSaveTitle
        title="产品信息"
    >
      <el-form
          ref="form"
          :model="formData"
          label-position="left"
      >
        <div v-for="(workshopItem) in formModel">
          <div>
            车间名称: {{ workshopItem.name }}
          </div>
          <div class="product-item" v-for="(amountItem) in workshopItem.amount">
            <el-row :gutter="12">
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="起重机类型">
                  <DictSelect
                      v-model="amountItem.type"
                      dictType="q_crane_type"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="操作方式">
                  <DictSelect
                      v-model="amountItem.handle"
                      dictType="q_oper_mode"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="起升重量">
                  <DictSelect
                      v-model="amountItem.weight"
                      dictType="q_lift_weight"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="工作级别">
                  <DictSelect
                      v-model="amountItem.level"
                      :dictType="getLevelByType(workshopItem.key)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="amountItem.type && amountItem.handle && amountItem.weight && amountItem.level">
              <el-button @click="selectPart">选择部件</el-button>
            </div>
          </div>
        </div>
      </el-form>
    </OfferSaveTitle>
    <el-dialog
        v-model="dialogVisible"
        width="800px"
        title="选择部件"
    >
      <el-table
          style="width: 100%"
      >
        <el-table-column prop="offerName" label="产品"/>
        <el-table-column prop="offerCode" label="部件" width="180" />
        <el-table-column prop="createTime" label="数量" width="160" />
        <el-table-column prop="customerName" label="单位" width="180" />
        <el-table-column prop="contractPrice" label="品牌" width="180" />
        <el-table-column prop="contractPrice" label="部件编码" width="180" />
        <el-table-column prop="contractPrice" label="税率" width="180" />
        <el-table-column prop="contractPrice" label="金地球工厂价" width="180" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup name="OfferSaveProduct">
import OfferSaveTitle from '../../components/Title'
import DictSelect from './DictSelect'
import useOfferStore from '@/store/modules/offer'
import {onMounted} from "vue";

const offerStore = useOfferStore()
const dialogVisible = ref(false)

const formModel = reactive([])

const selectPart = (key) => {
  dialogVisible.value = true
}

const getLevelByType = (value) => {
  switch(value) {
    case '2':
      return 'q_double_crane_work_level';
    case '3':
      return 'q_double_crane_work_level';
    default:
      return 'q_single_crane_work_level';
  }
}

onMounted(() => {
  const workshopData = offerStore.getCustomerData().workshopInfo

  workshopData.forEach(item => {
    formModel.push({
      name: item.name,
      key: item.key,
      amount: new Array(item.amount).fill(1).map(b => ({
        type: undefined,
        handle: undefined,
        weight: undefined,
        level: undefined
      }))
    })
  })

})

</script>

<style lang="scss" scoped>
.offer-save-product {

  .product-item {
    background-color: #FAFAFA;
    padding: 12px 8px;
    margin: 12px 0;
  }

  .title {
    margin-bottom: 24px;
  }
}
</style>