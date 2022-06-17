<!-- 客户信息 -->
<template>
  <div class="offer-save-customer">
    <el-form
        ref="form"
        :model="formData"
        label-position="left"
    >
      <OfferSaveTitle title="客户信息">

        <el-form-item label="客户名称" prop="customer">
          <el-space>
            <el-input :disabled="offerStore.type !== 'add'" v-model="formData.customer" @input="customerSearchChange" />
            <el-button :disabled="offerStore.type !== 'add'"  type="primary" >
              新增
            </el-button>
          </el-space>
        </el-form-item>
        <el-form-item v-if="!!dataSource.length">
          <List :dataSource="dataSource" :checked="formData.customerId" @select="onListChange"/>
        </el-form-item>

      </OfferSaveTitle>
      <OfferSaveTitle title="车间信息">
        <div v-for="(item, index) in formData.workshopInfo" :key="item.key" class="work-list-item">
          <el-form-item label="车间名称" :prop="['formData', 'workshopInfo', index, 'name']">
            <el-space>
              <el-input :disabled="offerStore.type === 'view'" v-model="formData.workshopInfo[index].name" style="width: 210px;"></el-input>
              <el-button :disabled="offerStore.type === 'view'" v-if="index === 0" @click="addWork()">添加车间信息</el-button>
              <el-button :disabled="offerStore.type === 'view'" v-if="index !== 0" @click="removeWork(item.key)">删除</el-button>
            </el-space>
          </el-form-item>
          <div class="work-list-item-form">
            <el-row :gutter="12">
              <el-col :span="6">
                <el-form-item :prop="['formData', 'workshopInfo', index, 'railModel']" :labelWidth="100" label="轨道型号" >
                  <DictSelect
                      v-model="formData.workshopInfo[index].railModel"
                      :disabled="offerStore.type === 'view'"
                      dictType="q_track_model"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :prop="['formData', 'workshopInfo', index, 'workshopLength']" :labelWidth="100" label="车间长度(m)">
                  <el-input-number
                      :disabled="offerStore.type === 'view'"
                      :min="1" :max="999" controls-position="right" style="width: 210px;" v-model="formData.workshopInfo[index].workshopLength"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :prop="['formData', 'workshopInfo', index, 'workshopSpan']" :labelWidth="100" label="车间跨度(m)">
                  <DictSelect
                      v-model="formData.workshopInfo[index].workshopSpan"
                      :disabled="offerStore.type === 'view'"
                      dictType="q_single_crane_model"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="6">
                <el-form-item :prop="['formData', 'workshopInfo', index, 'liftingHeight']" :labelWidth="100" label="起升高度(m)">
                  <DictSelect
                      v-model="formData.workshopInfo[index].liftingHeight"
                      :disabled="offerStore.type === 'view'"
                      dictType="q_single_crane_model"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item  :prop="['formData', 'workshopInfo', index, 'amount']" :labelWidth="100" label="起重机数量">
                  <el-input-number
                      :disabled="offerStore.type === 'view'"
                      :min="1" :max="999" controls-position="right" style="width: 210px;" v-model="formData.workshopInfo[index].amount"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </OfferSaveTitle>
    </el-form>
  </div>
</template>

<script setup name="CustomerInformation">
import OfferSaveTitle from '../components/Title'
import List from './CustomerList'
import DictSelect from './product/DictSelect'
import { listCustomer } from '@/api/business/customer'
import useOfferStore from '@/store/modules/offer'
import {ref, reactive, onMounted, computed, watch} from 'vue';
import { debounce, cloneDeep, omit } from 'lodash-es'

const input = ref('')
const dataSource = ref([])
const form = ref(null)
const offerStore = useOfferStore()

const formData = reactive({
  customer: '',
  customerId: '', // 客户ID
  customerItem: '', // 客户信息
  workshopInfo: [] // 车间信息
})

const rules = reactive({
  customer: [
    {required: true, message: '请选择客户', trigger: 'blur'}
  ]
})

const DEFAULT_WORK_ITEM = {
  key: '1',
  name: undefined,
  railModel: undefined,
  workshopLength: undefined,
  workshopSpan: undefined,
  liftingHeight: undefined,
  amount: 1,
}

formData.workshopInfo.push(cloneDeep(DEFAULT_WORK_ITEM))

const onListChange = ({id, node}) => {
  formData.customerId = id
  formData.customerItem = node
}

const customerSearch = debounce(async function (value) { // 客户模糊搜索
  const params = {}
  if (value) {
    params.customerName = value
  }
  const resp = await listCustomer(params)
  if (resp.code === 200) {
    dataSource.value = resp.rows
  }
}, 300)

const customerSearchChange = (e) => {
  customerSearch(e)
}
const addWork = () => {
  formData.workshopInfo.unshift({
    ...cloneDeep(DEFAULT_WORK_ITEM),
    slipLine: undefined,
    key: new Date().valueOf()
  })
}

const removeWork = (key) => {
  const index = formData.workshopInfo.findIndex(item => item.key === key)
  if (index > -1) {
    formData.workshopInfo.splice(index, 1)
  }
}

const getValues = async () => {
  const data = await form.value.validate()
  if (data) {
    const newData = cloneDeep(formData)
    newData.workshopInfo = JSON.stringify(newData.workshopInfo)
    return omit(newData, ['customer'])
  }
}

const addCustomerListByItem = (item) => {
  dataSource.value = [item]
}

offerStore.$subscribe((mutation, state) => {
  const { customerId, customerItem, workshopInfo} = state.customer
  if (customerId && customerItem) {
    formData.customerId = customerId
    formData.customerItem = customerItem
    addCustomerListByItem(customerItem)
  }
  if (workshopInfo) {
    formData.workshopInfo = JSON.parse(workshopInfo)
  }
})

onMounted(() => {
  console.log('cusomer onMounted')
})

defineExpose({
  getValues
})

</script>

<style lang="scss" scoped>
.offer-save-customer {
  .title {
    margin-bottom: 24px;
  }

  .work-list-item {

    .work-list-item-form {
      background-color: #FAFAFA;
      padding: 12px 8px;
      margin: 12px 0;
    }
  }

}
</style>