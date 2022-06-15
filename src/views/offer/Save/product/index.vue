<template>
  <div class="offer-save-product">
    <OfferSaveTitle
        title="产品信息"
    >
      <el-form
          ref="form"
          :model="formModel"
          label-position="left"
      >
        <div v-for="(workshopItem, index1) in formModel.product">
          <div>
            车间名称: {{ workshopItem.name }}
          </div>
          <div class="product-item" v-for="(amountItem, index) in workshopItem.amount">
            <el-row :gutter="12">
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="起重机类型">
                  <DictSelect
                      :disabled="offerStore.type === 'view'"
                      v-model="formModel.product[index1].amount[index].type"
                      dictType="q_crane_type"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="操作方式">
                  <DictSelect
                      :disabled="offerStore.type === 'view'"
                      v-model="formModel.product[index1].amount[index].operation"
                      dictType="q_oper_mode"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="起升重量">
                  <DictSelect
                      :disabled="offerStore.type === 'view'"
                      v-model="formModel.product[index1].amount[index].weight"
                      dictType="q_lift_weight"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="工作级别">

                  <DictSelect
                      :disabled="offerStore.type === 'view'"
                      v-if="amountItem.type === '1'"
                      v-model="formModel.product[index1].amount[index].level"
                      dictType="q_single_crane_work_level"
                  />
                  <DictSelect
                      :disabled="offerStore.type === 'view'"
                      v-else-if="amountItem.type === '2'"
                      v-model="formModel.product[index1].amount[index].level"
                      dictType="q_double_crane_work_level"
                  />
                  <DictSelect
                      :disabled="offerStore.type === 'view'"
                      v-else-if="amountItem.type === '3'"
                      v-model="formModel.product[index1].amount[index].level"
                      dictType="q_susp_crane_work_level"
                  />
                  <DictSelect
                      :disabled="offerStore.type === 'view'"
                      v-else
                      v-model="formModel.product[index1].amount[index].level"
                      dictType=""
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="!!amountItem.productData">
              <el-descriptions :column="3" border size="small">
                <el-descriptions-item label="型号" width="150px" label-align="right">
                  {{ amountItem.productData.name }}
                </el-descriptions-item>
                <el-descriptions-item label="额定功率(KW)" width="150px" label-align="right">
                  {{ amountItem.productData.ratedPower }}
                </el-descriptions-item>
                <el-descriptions-item label="起升速度" width="150px" label-align="right">
                  {{ amountItem.productData.liftSpeed }}
                </el-descriptions-item>
                <el-descriptions-item label="小车运行速度" width="150px" label-align="right">
                  {{ amountItem.productData.crabSpeed }}
                </el-descriptions-item>
                <el-descriptions-item label="大车运行速度" width="150px" label-align="right">
                  {{ amountItem.productData.cartSpeed }}
                </el-descriptions-item>
                <el-descriptions-item width="150px" label-align="right">
                </el-descriptions-item>
                <el-descriptions-item label="总成本合计" width="150px" label-align="right">
                  {{ amountItem.partQuote.factory_price_count }}
                </el-descriptions-item>
                <el-descriptions-item label="预计利润" width="150px" label-align="right">
                  {{ amountItem.partQuote.profit }}
                </el-descriptions-item>
                <el-descriptions-item label="销售总价" width="150px" label-align="right">
                  {{ amountItem.partQuote.price }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <div
                v-if="amountItem.type && amountItem.operation && amountItem.weight && amountItem.level"
              style="margin-top: 12px;"
            >
              <el-button
                  type="primary"
                  @click="selectPart(amountItem, workshopItem.key, index)"
              >选择部件</el-button>
            </div>
          </div>
        </div>
      </el-form>
    </OfferSaveTitle>
    <el-dialog
        v-model="dialogVisible"
        width="900px"
        title="选择部件"
    >
      <el-select :disabled="offerStore.type === 'view'" v-model="productId" style="width: 50%;margin-bottom: 12px;" placeholder="请选择产品" @change="onProductChange">
        <el-option
          v-for="item in productList"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-table
          style="width: 100%"
          :data="partDataSource"
          border
          @cancel="cancel"
      >
        <el-table-column prop="offerCode" label="部件" width="180" />
        <el-table-column prop="brand" label="品牌" width="180" >
          <template #default="{row}">
            <el-radio-group v-model="row.part_code_value" :disabled="offerStore.type === 'view'">
              <el-radio v-for="item in row.brand" :label="item" />
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column prop="part_code" label="部件编码" width="180" >
        </el-table-column>
        <el-table-column prop="unm" label="数量" width="80" />
        <el-table-column prop="unit" label="单位" width="100" />
        <el-table-column prop="price" label="金地球成本价(不含税)" width="180" />
        <el-table-column prop="taxrate" label="税率" width="120" >
          <template #default="scope">
            <el-input-number :disabled="offerStore.type === 'view'" v-model="scope.row.taxrate" :min="0" :max="100" controls-position="right" style="width: 100%;"/>
          </template>
        </el-table-column>
        <el-table-column prop="brand" label="品牌" width="100" />
        <el-table-column prop="factory_price" label="金地球工厂价" width="140" >
          <template #default="scope">
            {{ (Number(scope.row.unm) * Number(scope.row.price) * Number(scope.row.taxrate || 0)).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 24px;">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="工厂价合计(元)" width="150px" label-align="right">
            {{ partDialogData.factory_price_count }}
          </el-descriptions-item>
          <el-descriptions-item label="预计利润率" width="150px" label-align="right">
            {{ partDialogData.profit }}
          </el-descriptions-item>
          <el-descriptions-item label="销售报价(元)" width="150px" label-align="right">
            {{ partDialogData.price }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="savePartData" >确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="OfferSaveProduct">
import OfferSaveTitle from '../../components/Title'
import DictSelect from './DictSelect'
import useOfferStore from '@/store/modules/offer'
import {onMounted, defineExpose, computed} from "vue";
import {listProduct} from "@/api/business/product";
import {cloneDeep, omit} from "lodash-es";

const offerStore = useOfferStore()
const dialogVisible = ref(false)
const partDataSource = ref([])
const productList = ref([])
const form = ref()
const productId = ref()
const formModel = reactive({
  product: []
})

/**
 *
 * @param data
 * @param workshopItemKey 车间名称
 * @param index 起重机下标
 */
const selectPart = (data, workshopItemKey, index) => {
  queryPart(data, workshopItemKey, index)
  console.log(data)
  if ('partData' in data) {
    productId.value = data.productData?.id
    partDataSource.value = data.partData
  }
  dialogVisible.value = true
}

const cancel = () => {
  dialogVisible.value = false
  partDataSource.value = []
}

const savePartData = () => {
  const productItem = productList.value.find(item => item.name === productId.value)
  formModel.product.forEach(item => {
    if (productItem && productItem.workshopItemKey === item.key) {
      const amountItem = item.amount[productItem.index]
      amountItem.partData = cloneDeep(partDataSource.value)
      amountItem.partQuote = cloneDeep(partDialogData)
      amountItem.productData = {
        name: productItem.name,
        ratedPower: productItem.ratedPower,
        liftSpeed: productItem.liftSpeed,
        crabSpeed: productItem.crabSpeed,
        cartSpeed: productItem.cartSpeed,
        id: productId.value
      }
    }
  })
  cancel()
}

const queryPart = async (data, workshopItemKey, index) => {
  // TODO 判断当前是否选择过部件
  productId.value = undefined
  productList.value = []

  const resp = await listProduct({
    crane_type: data.type,
    crane_operation: data.operation,
    work_level: data.level
  })
  if (resp.code === 200) {
  // 遍历BOM清单
    resp.rows.forEach(item => {
      if (item.bomParams) {
        const bomData = JSON.parse(item.bomParams)
        bomData.data = bomData.data.map(item => {
          item.brand = item.brand.includes(',') ? item.brand.split(',') : [item.brand]
          item.part_code_value = item.brand.length === 1 ? item.brand[0] : undefined
          return item
        })
          console.log(bomData.data)
        productList.value.push({
          ...bomData,
          ratedPower: item.ratedPower,
          liftSpeed: item.liftSpeed,
          crabSpeed: item.crabSpeed,
          cartSpeed: item.cartSpeed,
          workshopItemKey,
          index
        })
      }
    })
  }
}

const onProductChange = (value) => {
  const item = productList.value.find(item => item.name === value)
  console.log(item.data)
  partDataSource.value = item.data
}

const partDialogData = computed(() => {
  const factory_price_count = partDataSource.value.reduce((prev, next) => {
    const price = (Number(next.unm) * Number(next.price) * Number(next.taxrate || 0)).toFixed(2)
    return prev + Number(price)
  }, 0)

  const profitMargin = Number(offerStore.getCustomerData().customerItem?.profitMargin) || 0
  const price = (factory_price_count * (1 + (profitMargin/ 100))).toFixed(2)

  return {
    factory_price_count,
    profit: profitMargin,
    price
  }
})

const createAmount = (length) => {
  return new Array(length).fill(1).map(b => ({
    type: undefined,
    operation: undefined,
    weight: undefined,
    level: undefined
  }))
}

offerStore.$subscribe((_, state) => {
  const { customer, product} = state
    formModel.product = []

  if (product.length) {
    product.forEach(item => {
      formModel.product.push(item)
    })
  } else if (customer.workshopInfo) {
    const workshopInfo = JSON.parse(customer.workshopInfo)
    workshopInfo.forEach(item => {
      formModel.product.push({
        name: item.name,
        key: item.key,
        amount: createAmount(item.amount)
      })
      console.log(formModel)
    })
  }
})

const getValues = async () => {
  const data = await form.value.validate()
  if (data) {
    const newData = cloneDeep(formModel)
    const arr = []
    const workshopInfo = offerStore.getCustomerData().workshopInfo
    workshopInfo.forEach((_, index) => {
      arr.push(newData.product[index])
    })
    return arr
  }
}

defineExpose({
  getValues
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