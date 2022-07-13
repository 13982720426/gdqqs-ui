<template>
  <div class="offer-save-product">
    <OfferSaveTitle title="产品信息">
      <el-form
        ref="form"
        :rules="rules"
        :model="formModel"
        label-position="left"
      >
        <div
          :key="workshopItem.key"
          v-for="(workshopItem, index1) in formModel.product"
        >
          <div class="product-item-title">
            车间名称: {{ workshopItem.name }}
          </div>
          <div
            class="product-item"
            :key="amountItem.key"
            v-for="(amountItem, index) in workshopItem.amount"
          >
            <el-row :gutter="12">
              <el-col :span="6">
                <el-form-item
                  :prop="[
                    'formModel',
                    'product',
                    index1,
                    'amount',
                    index,
                    'type',
                  ]"
                  :rules="rules.type"
                  :labelWidth="100"
                  label="起重机类型"
                >
                  <DictSelect
                    :disabled="offerStore.type === 'view'"
                    v-model="formModel.product[index1].amount[index].type"
                    dictType="q_crane_type"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  :prop="[
                    'formModel',
                    'product',
                    index1,
                    'amount',
                    index,
                    'operation',
                  ]"
                  :rules="rules.operation"
                  :labelWidth="100"
                  label="操作方式"
                >
                  <DictSelect
                    :disabled="offerStore.type === 'view'"
                    v-model="formModel.product[index1].amount[index].operation"
                    dictType="q_oper_mode"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  :prop="[
                    'formModel',
                    'product',
                    index1,
                    'amount',
                    index,
                    'weight',
                  ]"
                  :rules="rules.weight"
                  :labelWidth="100"
                  label="起升重量"
                >
                  <DictSelect
                    :disabled="offerStore.type === 'view'"
                    v-model="formModel.product[index1].amount[index].weight"
                    dictType="q_lift_weight"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  :prop="[
                    'formModel',
                    'product',
                    index1,
                    'amount',
                    index,
                    'level',
                  ]"
                  :rules="rules.level"
                  :labelWidth="100"
                  label="工作级别"
                >
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
                <el-descriptions-item
                  label="型号"
                  width="150px"
                  label-align="right"
                >
                  {{ amountItem.productData.name }}
                </el-descriptions-item>
                <el-descriptions-item
                  label="额定功率(KW)"
                  width="150px"
                  label-align="right"
                >
                  {{ amountItem.productData.ratedPower }}
                </el-descriptions-item>
                <el-descriptions-item
                  label="起升速度"
                  width="150px"
                  label-align="right"
                >
                  {{ amountItem.productData.liftSpeed }}
                </el-descriptions-item>
                <el-descriptions-item
                  label="小车运行速度"
                  width="150px"
                  label-align="right"
                >
                  {{ amountItem.productData.crabSpeed }}
                </el-descriptions-item>
                <el-descriptions-item
                  label="大车运行速度"
                  width="150px"
                  label-align="right"
                >
                  {{ amountItem.productData.cartSpeed }}
                </el-descriptions-item>
                <el-descriptions-item
                  label="预计利润率(%)"
                  width="150px"
                  label-align="right"
                >
                  {{ amountItem.partQuote.profitMargin }}
                </el-descriptions-item>

                <el-descriptions-item
                  label="总成本合计"
                  width="150px"
                  label-align="right"
                >
                  {{ amountItem.partQuote.factory_price_count }}
                </el-descriptions-item>

                <el-descriptions-item
                  label="销售总价"
                  width="150px"
                  label-align="right"
                >
                  {{ amountItem.partQuote.price }}
                </el-descriptions-item>
                <el-descriptions-item
                  label="利润额"
                  width="150px"
                  label-align="right"
                >
                  {{ amountItem.partQuote.profit }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <div
              v-if="
                amountItem.type &&
                amountItem.operation &&
                amountItem.weight &&
                amountItem.level
              "
              style="margin-top: 12px"
            >
              <div v-if="!!amountItem.productData">
                <el-button
                  :disabled="offerStore.type === 'view'"
                  type="success"
                  @click="selectPart(amountItem, workshopItem.key, index, true)"
                >
                  编辑部件
                </el-button>
              </div>
              <div v-else>
                <el-button
                  type="primary"
                  @click="
                    selectPart(amountItem, workshopItem.key, index, false)
                  "
                >
                  选择部件
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </OfferSaveTitle>
    <div class="title">
      <el-table :data="countDataSource">
        <el-table-column label="" width="100" />
        <!-- <el-table-column prop="name" label="车间名称" /> -->
        <el-table-column prop="count" label="起重机数量(台)" />
        <el-table-column prop="total" label="总成本合计" />
        <el-table-column prop="sales" label="销售总价"></el-table-column>
        <el-table-column prop="profit" label="利润额"></el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogVisible" width="85%" title="选择部件">
      <el-select
        :disabled="offerStore.type === 'view'"
        v-model="productId"
        style="width: 20%; margin-bottom: 12px"
        placeholder="请选择产品"
        @change="onProductChange"
      >
        <el-option
          :key="item.productName"
          v-for="item in productList"
          :label="item.productName"
          :value="item.productName"
        />
      </el-select>
      <el-table
        style="width: 100%"
        :data="partDataSource"
        border
        @cancel="cancel"
      >
        <el-table-column prop="offerCode" label="部件" min-width="180" />
        <el-table-column prop="brand" label="品牌" min-width="180">
          <template #default="{ row }">
            <el-radio-group
              v-model="row.part_code_value"
              :disabled="offerStore.type === 'view'"
            >
              <el-radio
                :key="item.key"
                v-for="item in row.brand"
                :label="item"
                @click.prevent="checkRadio(row)"
              />
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column
          prop="model"
          label="型号"
          min-width="200"
        ></el-table-column>
        <el-table-column prop="num" label="数量" min-width="100" />
        <el-table-column prop="unit" label="单位" min-width="80" />
        <el-table-column
          prop="price"
          label="金地球成本价(不含税)"
          min-width="160"
        />
        <el-table-column prop="taxrate" label="税率" min-width="120">
          <template #default="scope">
            <el-input-number
              :disabled="offerStore.type === 'view'"
              v-model="scope.row.taxrate"
              :min="0"
              :max="100"
              controls-position="right"
              style="width: 100%"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="factoryPrice"
          label="金地球工厂价"
          min-width="140"
        >
          <template #default="scope">
            {{
              (
                Number(scope.row.num) *
                Number(scope.row.price) *
                Number(scope.row.taxrate || 0)
              ).toFixed(2)
            }}
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 24px">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item
            label="工厂价合计(元)"
            width="150px"
            label-align="right"
          >
            {{ partDialog.factory_price_count }}
          </el-descriptions-item>
          <el-descriptions-item
            label="预计利润率(%)"
            width="150px"
            label-align="right"
          >
            <el-input-number
              :disabled="offerStore.type === 'view'"
              v-model="partDialog.profitMargin"
              :min="0"
              :max="100"
              controls-position="right"
              style="width: 100%"
            />
          </el-descriptions-item>
          <el-descriptions-item
            label="销售报价(元)"
            width="150px"
            label-align="right"
          >
            {{ partDialog.price }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="savePartData">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="OfferSaveProduct">
import OfferSaveTitle from '../../components/Title'
import DictSelect from './DictSelect'
import useOfferStore from '@/store/modules/offer'
import { onMounted, defineExpose, computed } from 'vue'
import { listProduct } from '@/api/business/product'
import { cloneDeep, omit } from 'lodash-es'
import { isArray } from '@vue/shared'

const { proxy } = getCurrentInstance()

const offerStore = useOfferStore()
const dialogVisible = ref(false)
const partDataSource = ref([])
const productList = ref([])
const form = ref()
const productId = ref()
const formModel = reactive({
  product: [],
  productMsg: {
    workshopItemKey: null,
    index: null,
    ratedPower: null,
    liftSpeed: null,
    crabSpeed: null,
    cartSpeed: null,
  },
})

const validType = (rule, value, callback) => {
  let newArr = rule.field.split('.')
  let currentIndex1 = newArr[2]
  let currentIndex2 = newArr[4]
  let currentProp = newArr[5]
  let currentPropBro = ''
  if (currentProp === 'type') {
    currentPropBro = formModel.product[currentIndex1].amount[currentIndex2].type
    if (currentPropBro === undefined) {
      callback(new Error('请选择起重机类型'))
    } else return true
  } else if (currentProp === 'operation') {
    currentPropBro =
      formModel.product[currentIndex1].amount[currentIndex2].operation
    if (currentPropBro === undefined) {
      callback(new Error('请选择操作方式'))
    } else return true
  } else if (currentProp === 'weight') {
    currentPropBro =
      formModel.product[currentIndex1].amount[currentIndex2].weight
    if (currentPropBro === undefined) {
      callback(new Error('请选择起升重量'))
    } else return true
  } else if (currentProp === 'level') {
    currentPropBro =
      formModel.product[currentIndex1].amount[currentIndex2].level
    if (currentPropBro === undefined) {
      callback(new Error('请选择工作级别'))
    } else return true
  }
}

const rules = ref({
  type: [{ required: true, validator: validType, trigger: 'blur' }],
  operation: [{ required: true, validator: validType, trigger: 'blur' }],
  weight: [{ required: true, validator: validType, trigger: 'blur' }],
  level: [{ required: true, validator: validType, trigger: 'blur' }],
})

//总合计
const countDataSource = ref([])

//车间统计数据
const workshopTotalData = ref([])

/**
 *
 * @param data
 * @param workshopItemKey 车间名称
 * @param index 起重机下标
 */
const selectPart = (data, workshopItemKey, index, isEdit) => {
  queryPart(data, workshopItemKey, index, isEdit)

  if ('partData' in data) {
    productId.value = data.productData?.id
    partDataSource.value = data.partData
  }
  dialogVisible.value = true
}

const cancel = () => {
  partDataSource.value = []
  dialogVisible.value = false
}

const savePartData = () => {
  const { productMsg } = formModel

  const productItem = productList.value.find(
    (item) => item.productName === productId.value,
  )
  productItem.bomParams = JSON.stringify(partDataSource.value)
  productItem.index = productMsg.index
  productItem.workshopItemKey = productMsg.workshopItemKey
  formModel.product.forEach((item, index) => {
    console.log('item', item)
    if (productItem && productItem.workshopItemKey === item.key) {
      const amountItem = item.amount[productItem.index]
      amountItem.partData = cloneDeep(partDataSource.value) // 部件列表信息
      amountItem.partQuote = cloneDeep(partDialog) // 部件价格统计信息
      amountItem.productData = {
        // 部件对应产品信息
        name: productItem.craneModel,
        ratedPower: productItem.ratedPower,
        liftSpeed: productItem.liftSpeed,
        crabSpeed: productItem.crabSpeed,
        cartSpeed: productItem.cartSpeed,
        id: productItem.productName,
      }

      //获取车间统计数据
      const obj = amountItem.partQuote
      obj.name = item.name
      obj.key = item.key
      workshopTotalData.value.push(obj)
    }
  })
  totalAll()
  cancel()
}

//总合计
function totalAll() {
  const total = workshopTotalData.value.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.factory_price_count,
    0,
  )
  const sales = workshopTotalData.value.reduce(
    (accumulator, currentValue) => accumulator + Number(currentValue.price),
    0,
  )
  const profit = workshopTotalData.value.reduce(
    (accumulator, currentValue) =>
      accumulator +
      Number(currentValue.price - currentValue.factory_price_count),
    0,
  )
  const obj1 = {}
  obj1.count = workshopTotalData.value.length
  obj1.total = total.toFixed(2)
  obj1.sales = sales.toFixed(2)
  obj1.profit = profit.toFixed(2)
  countDataSource.value[0] = obj1
}

/**
 * 选择产品后，请求对应部件信息
 * @param data
 * @param workshopItemKey
 * @param index
 * @returns {Promise<void>}
 */
const queryPart = async (data, workshopItemKey, index, isEdit) => {
  console.log(333, data, workshopItemKey, index, isEdit)
  const productInfo = offerStore.getProductData()

  productInfo.forEach((item) => {
    if (item.key === workshopItemKey) {
      partDataSource.value = item.amount
    }
  })

  const { productMsg } = formModel
  productMsg.workshopItemKey = workshopItemKey
  productMsg.index = index
  // TODO 判断当前是否选择过部件
  productId.value = undefined
  productList.value = []
  const resp = await listProduct({
    craneType: data.type,
    craneOperation: data.operation,
    workLevel: data.level,
    liftWeight: parseInt(data.weight),
  })
  if (resp.code === 200) {
    productList.value = resp.rows
  }

  // if (resp.code === 200) {
  //   // 遍历产品下的BOM清单

  //   resp.rows.forEach((item) => {
  //     if (item.bomParams) {
  //       const bomData = JSON.parse(item.bomParams)
  //       // partDataSource.value = bomData
  //       console.log('bomData', bomData)
  //       // bomData.data = bomData.data.map((item) => {
  //       //   item.brand = item.brand.includes(',')
  //       //     ? item.brand.split(',')
  //       //     : [item.brand]
  //       //   item.part_code_value =
  //       //     item.brand.length === 1 ? item.brand[0] : undefined
  //       //   return item
  //       // })
  //       // productList.value.push({
  //       //   ...bomData,
  //       //   ratedPower: item.ratedPower,
  //       //   liftSpeed: item.liftSpeed,
  //       //   crabSpeed: item.crabSpeed,
  //       //   cartSpeed: item.cartSpeed,
  //       //   workshopItemKey,
  //       //   index,
  //       // })
  //     }
  //   })
  // }
}

const onProductChange = (value) => {
  const { productMsg } = formModel

  const itemData = productList.value.find((item) => item.productName === value)

  console.log('itemData', itemData)

  if (itemData.bomParams) {
    let bomData = JSON.parse(itemData.bomParams)
    bomData = bomData.map((item) => {
      item.brand = item.brand.includes(',')
        ? item.brand.split(',')
        : [item.brand]

      item.part_code_value = item.brand.length === 1 ? item.brand[0] : null
      if (item.brand === '') {
        item.part_code_value = null
      } else if (item.offerCode === '') {
        item.part_code_value = null
      }
      return item
    })

    partDataSource.value = bomData
    productMsg.ratedPower = itemData.ratedPower
    productMsg.liftSpeed = itemData.liftSpeed
    productMsg.crabSpeed = itemData.crabSpeed
    productMsg.cartSpeed = itemData.cartSpeed
  }

  // const item = productList.value.find(
  //   (item) => item.productName === value && item.push,
  // )
  // productId.value = item.productName
  // console.log('11item', item)
  // partDataSource.value = item

  // if (item.bomParams) {
  //   let bomData = JSON.parse(item.bomParams)
  //   bomData = bomData.map((item) => {
  //     item.brand = item.brand.includes(',')
  //       ? item.brand.split(',')
  //       : [item.brand]

  //     item.part_code_value = item.brand.length === 1 ? item.brand[0] : null
  //     if (item.brand === '') {
  //       item.part_code_value = null
  //     } else if (item.offerCode === '') {
  //       item.part_code_value = null
  //     }
  //     return item
  //   })
  //   partDataSource.value = bomData
  // } else partDataSource.value = []
}

// 选择部件弹窗数据
const partDialog = ref({
  factory_price_count: 0,
  profitMargin: 10,
  profit: 0,
  price: 0,
})

watch(
  () => partDataSource.value,
  (value) => {
    const factory_price_count = value.reduce((prev, next) => {
      const price = (
        Number(next.num) *
        Number(next.price) *
        Number(next.taxrate || 0)
      ).toFixed(2)
      return prev + Number(price)
    }, 0)
    const profitMargin =
      Number(offerStore.getCustomerData().customerItem?.profitMargin) || 0
    const price = (factory_price_count * (1 + profitMargin / 100)).toFixed(2)
    const profit = price - factory_price_count

    partDialog.value.factory_price_count = factory_price_count
    partDialog.value.profitMargin = profitMargin
    partDialog.value.profit = profit
    partDialog.value.price = price
  },
  { deep: true },
)
watch(
  () => partDialog.value,
  (value) => {
    partDialog.value.price = (
      value.factory_price_count *
      (1 + partDialog.value.profitMargin / 100)
    ).toFixed(2)
    partDialog.value.profit = (
      partDialog.value.price - value.factory_price_count
    ).toFixed(2)
  },
  { deep: true },
)

// const partDialogData = computed(() => {
//   const factory_price_count = partDataSource.value.reduce((prev, next) => {
//     const price = (
//       Number(next.num) *
//       Number(next.price) *
//       Number(next.taxrate || 0)
//     ).toFixed(2)
//     return prev + Number(price)
//   }, 0)
//   console.log('offerStore.getCustomerData()', offerStore.getCustomerData())
//   const profitMargin =
//     Number(offerStore.getCustomerData().customerItem?.profitMargin) || 0
//   const profit = factory_price_count * profitMargin
//   const price = (factory_price_count * (1 + profitMargin / 100)).toFixed(2)

//   return {
//     factory_price_count,
//     profitMargin,
//     profit,
//     price,
//   }
// })

const createAmount = (length) => {
  return new Array(length).fill(1).map((b) => ({
    type: undefined,
    operation: undefined,
    weight: undefined,
    level: undefined,
  }))
}

offerStore.$subscribe((mutation, state) => {
  const { customer, product } = state
  const NewCustomer = offerStore.getCustomerData()
  console.log('NewCustomer', NewCustomer)
  console.log('product', product)
  formModel.product = []
  if (product.length) {
    // console.log(
    //   'new',
    //   typeof JSON.stringify(NewCustomer.workshopInfo),
    //   JSON.stringify(NewCustomer.workshopInfo),
    //   'old',
    //   typeof customer.workshopInfo,
    //   customer.workshopInfo,
    //   '00',
    //   product,
    // )
    if (JSON.stringify(NewCustomer.workshopInfo) === customer.workshopInfo) {
      product.forEach((item) => {
        formModel.product.push(item)
      })
    } else {
      const workshopInfo = JSON.parse(customer.workshopInfo)
      workshopInfo.forEach((item) => {
        formModel.product.push({
          name: item.name,
          key: item.key,
          amount: createAmount(item.amount),
        })
      })
    }
  } else if (customer.workshopInfo) {
    const workshopInfo = JSON.parse(customer.workshopInfo)
    workshopInfo.forEach((item) => {
      formModel.product.push({
        name: item.name,
        key: item.key,
        amount: createAmount(item.amount),
      })
    })
  }

  // if (product.length) {
  //   let productItem, workshopInfoItem
  //   product.forEach((item) => {
  //     console.log('111', item)
  //     productItem = item
  //   })

  //   // const workshopInfo = JSON.parse(customer.workshopInfo)
  //   // workshopInfo.forEach((item) => {
  //   //   console.log('222', item)
  //   //   workshopInfoItem = item
  //   // })
  //   // console.log(
  //   //   'productItem',
  //   //   productItem,
  //   //   'workshopInfoItem',
  //   //   workshopInfoItem,
  //   // )
  // }
  // if (customer.workshopInfo) {
  //   const workshopInfo = JSON.parse(customer.workshopInfo)
  //   workshopInfo.forEach((item) => {
  //     console.log('1', item)

  //     formModel.product.push({
  //       name: item.name,
  //       key: item.key,
  //       amount: createAmount(item.amount),
  //     })
  //   })
  // }
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
function checkRadio(row) {
  if (row.brand[0] !== '') {
    if (row.part_code_value) {
      row.part_code_value = null
    } else {
      row.part_code_value = row.brand[0]
    }
  }
}

defineExpose({
  getValues,
})
</script>

<style lang="scss" scoped>
$color: #ff5800;

.offer-save-product {
  .product-item-title {
    border-top: 1px solid #dcdfe6;
    padding-top: 12px;
  }
  .product-item {
    background-color: #fafafa;
    padding: 12px 8px;
    margin: 12px 0;
  }
  .title {
    margin-bottom: 24px;
  }

  .number {
    color: $color;
  }
}
</style>
