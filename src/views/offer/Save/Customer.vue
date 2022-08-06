<!-- 客户信息 -->
<template>
  <div class="offer-save-customer">
    <el-form ref="form" :rules="rules" :model="formData" label-position="left">
      <OfferSaveTitle title="客户信息">
        <el-form-item label="客户名称" prop="customerName">
          <el-space>
            <el-input
              :disabled="offerStore.type === 'view'"
              placeholder="请输入客户名称"
              v-model="formData.customerName"
              @input="customerSearchChange"
            />
            <el-button
              @click=";(dialogFormVisible = true), reset()"
              :disabled="offerStore.type !== 'add'"
              type="primary"
            >
              新增
            </el-button>
          </el-space>
        </el-form-item>
        <el-form-item prop="customerId" v-if="!!dataSource.length">
          <List
            :dataSource="dataSource"
            :checked="formData.customerId"
            @select="onListChange"
          />
        </el-form-item>
      </OfferSaveTitle>
      <OfferSaveTitle title="车间信息">
        <div
          v-for="(item, index) in formData.workshopInfo"
          :key="item.key"
          class="work-list-item"
        >
          <el-form-item
            label="车间名称"
            :prop="['formData', 'workshopInfo', index, 'name']"
            :rules="rules.name"
          >
            <el-space>
              <el-input
                :disabled="offerStore.type === 'view'"
                v-model="formData.workshopInfo[index].name"
                style="width: 210px"
              ></el-input>
              <el-button
                :disabled="offerStore.type === 'view'"
                v-if="index === 0"
                @click="addWork()"
              >
                添加车间信息
              </el-button>
              <el-button
                :disabled="offerStore.type === 'view'"
                v-if="index !== 0"
                @click="removeWork(item.key)"
              >
                删除
              </el-button>
            </el-space>
          </el-form-item>
          <div class="work-list-item-form">
            <el-row :gutter="12">
              <el-col :span="6">
                <el-form-item
                  :prop="['formData', 'workshopInfo', index, 'railModel']"
                  :labelWidth="100"
                  label="轨道型号"
                  :rules="rules.railModel"
                >
                  <DictSelect
                    v-model="formData.workshopInfo[index].railModel"
                    :disabled="offerStore.type === 'view'"
                    dictType="q_track_model"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  :prop="['formData', 'workshopInfo', index, 'workshopLength']"
                  :labelWidth="100"
                  label="车间长度(m)"
                  :rules="rules.workshopLength"
                >
                  <el-input-number
                    :disabled="offerStore.type === 'view'"
                    :min="1"
                    :max="9999"
                    controls-position="right"
                    style="width: 210px"
                    v-model="formData.workshopInfo[index].workshopLength"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  :prop="['formData', 'workshopInfo', index, 'workshopSpan']"
                  :labelWidth="100"
                  label="车间跨度(m)"
                  :rules="rules.workshopSpan"
                >
                  <el-input-number
                    :disabled="offerStore.type === 'view'"
                    :min="1"
                    :max="9999"
                    controls-position="right"
                    style="width: 210px"
                    v-model="formData.workshopInfo[index].workshopSpan"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="6">
                <el-form-item
                  :prop="['formData', 'workshopInfo', index, 'liftingHeight']"
                  :labelWidth="100"
                  label="起升高度(m)"
                  :rules="rules.liftingHeight"
                >
                  <el-input-number
                    :disabled="offerStore.type === 'view'"
                    :min="1"
                    :max="9999"
                    controls-position="right"
                    style="width: 210px"
                    v-model="formData.workshopInfo[index].liftingHeight"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  :prop="['formData', 'workshopInfo', index, 'amount']"
                  :labelWidth="100"
                  label="起重机数量"
                  :rules="rules.amount"
                >
                  <el-input-number
                    :disabled="offerStore.type === 'view'"
                    :min="1"
                    :max="9999"
                    controls-position="right"
                    style="width: 210px"
                    v-model="formData.workshopInfo[index].amount"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </OfferSaveTitle>
    </el-form>

    <el-dialog v-model="dialogFormVisible" width="50%" title="新增客户">
      <el-form
        :model="addCustomerForm"
        :rules="addCustomerFormRules"
        ref="upcustomer"
        label-width="80px"
        style="padding: 20px"
      >
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="客户姓名" prop="customerName">
              <el-input
                maxlength="30"
                v-model="addCustomerForm.customerName"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门" prop="partment">
              <el-input
                maxlength="30"
                v-model="addCustomerForm.partment"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户性质" prop="customerNature">
              <el-select
                placeholder="请选择客户性质"
                v-model="addCustomerForm.customerNature"
                style="width: 100%"
              >
                <el-option
                  v-for="dict in dataScopeOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="联系人" prop="contact">
              <el-input
                maxlength="30"
                v-model="addCustomerForm.contact"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="contactTell">
              <el-input
                maxlength="30"
                v-model="addCustomerForm.contactTell"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="contactEmail">
              <el-input
                maxlength="30"
                v-model="addCustomerForm.contactEmail"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="地址" prop="contactAddress">
              <el-input
                maxlength="30"
                v-model="addCustomerForm.contactAddress"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮政编码" prop="postCode">
              <el-input
                maxlength="30"
                v-model="addCustomerForm.postCode"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model="addCustomerForm.remark"
                maxlength="300"
                show-word-limit
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submit()">保存</el-button>
          <el-button @click=";(dialogFormVisible = false), close()">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup name="CustomerInformation">
import OfferSaveTitle from '../components/Title'
import List from './CustomerList'
import DictSelect from './product/DictSelect'
import { listCustomer, addCustomer } from '@/api/business/customer'
import useOfferStore from '@/store/modules/offer'
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { debounce, cloneDeep, omit } from 'lodash-es'

const input = ref('')
const dataSource = ref([])
const form = ref(null)
const offerStore = useOfferStore()

const { proxy } = getCurrentInstance()

const dialogFormVisible = ref(false)
const addCustomerForm = ref({
  customerId: '',
  customerName: '',
  partment: '',
  customerNature: '',
  contact: '',
  contactEmail: '',
  contactAddress: '',
  postCode: '',
  contactTell: '',
  remark: '',
  profitMargin: 5,
})

const dataScopeOptions = ref([
  { value: '1', label: '经销商' },
  { value: '2', label: '最终用户' },
])
const addCustomerFormRules = ref({
  customerName: [
    { required: true, message: '客户姓名不能为空', trigger: 'blur' },
  ],
  partment: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
  customerNature: [
    { required: true, message: '客户性质不能为空', trigger: 'blur' },
  ],
  contact: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
  contactAddress: [
    { required: true, message: '地址不能为空', trigger: 'blur' },
  ],
  contactEmail: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ],
  contactTell: [
    { required: true, message: '联系电话不能为空', trigger: 'blur' },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
})
/** 提交按钮 */
function submit() {
  proxy.$refs['upcustomer'].validate((valid) => {
    if (valid) {
      if (addCustomerForm.value.customerNature !== '1') {
        addCustomerForm.value.profitMargin = 10
      }
      addCustomer(addCustomerForm.value).then((response) => {
        if (response.code === 200) {
          proxy.$modal.msgSuccess('新增成功')
          formData.customerName = addCustomerForm.value.customerName
          customerSearch(formData.customerName)
        } else {
          proxy.$modal.msgError('新增失败')
        }
        dialogFormVisible.value = false
      })
    }
  })
}
/** 关闭按钮 */
function close() {
  reset()
}
function reset() {
  addCustomerForm.value = {
    customerId: undefined,
    customerName: undefined,
    partment: undefined,
    customerNature: undefined,
    contact: undefined,
    contactEmail: undefined,
    contactAddress: undefined,
    postCode: undefined,
    contactTell: undefined,
    remark: undefined,
    profitMargin: 5,
  }
}

const formData = reactive({
  customerName: '',
  customerId: '', // 客户ID
  customerItem: '', // 客户信息
  workshopInfo: [], // 车间信息
})

const validType = (rule, value, callback) => {
  let newArr = rule.field.split('.')
  let currentIndex = newArr[2]
  let currentProp = newArr[3]
  let currentPropBro = ''
  if (currentProp === 'name') {
    currentPropBro = formData.workshopInfo[currentIndex].name
    if (currentPropBro === undefined) {
      callback(new Error('请输入车间名称'))
    } else return true
  } else if (currentProp === 'railModel') {
    currentPropBro = formData.workshopInfo[currentIndex].railModel
    if (currentPropBro === undefined) {
      callback(new Error('请选择轨道型号'))
    } else return true
  } else if (currentProp === 'workshopLength') {
    currentPropBro = formData.workshopInfo[currentIndex].workshopLength
    if (currentPropBro === undefined) {
      callback(new Error('请输入轨道长度'))
    } else return true
  } else if (currentProp === 'workshopSpan') {
    currentPropBro = formData.workshopInfo[currentIndex].workshopSpan
    if (currentPropBro === undefined) {
      callback(new Error('请输入车间跨度'))
    } else return true
  } else if (currentProp === 'liftingHeight') {
    currentPropBro = formData.workshopInfo[currentIndex].liftingHeight
    if (currentPropBro === undefined) {
      callback(new Error('请输入起升高度'))
    } else return true
  } else if (currentProp === 'amount') {
    currentPropBro = formData.workshopInfo[currentIndex].amount
    if (currentPropBro === undefined) {
      callback(new Error('请输起重机数量'))
    } else return true
  }
}
const validCustomer = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入客户名称'))
  }
  if (!formData.customerId) {
    return callback(new Error('请选择或新增客户'))
  } else return true
}

const rules = ref({
  customerName: [
    { required: true, validator: validCustomer, trigger: ['blur', 'change'] },
  ],
  customerId: [{ required: true, message: '请选择客户', trigger: 'blur' }],
  name: [{ required: true, validator: validType, trigger: 'blur' }],
  railModel: [{ required: true, validator: validType, trigger: 'blur' }],
  workshopLength: [{ required: true, validator: validType, trigger: 'blur' }],
  workshopSpan: [{ required: true, validator: validType, trigger: 'blur' }],
  liftingHeight: [{ required: true, validator: validType, trigger: 'blur' }],
  amount: [{ required: true, validator: validType, trigger: 'blur' }],
})

const DEFAULT_WORK_ITEM = {
  key: '1',
  name: undefined,
  railModel: undefined,
  workshopLength: 2,
  workshopSpan: 1,
  liftingHeight: 1,
  amount: 1,
}

formData.workshopInfo.push(cloneDeep(DEFAULT_WORK_ITEM))

const onListChange = ({ id, node }) => {
  formData.customerId = id
  formData.customerItem = node
}

const customerSearch = debounce(async function (value) {
  // 客户模糊搜索
  const params = {}
  if (value) {
    params.customerName = value
  } else {
    params.customerName = NaN
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
    key: new Date().valueOf(),
  })
}

const removeWork = (key) => {
  const index = formData.workshopInfo.findIndex((item) => item.key === key)
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
  const { customerId, customerItem, workshopInfo } = state.customer
  if (customerId && customerItem) {
    formData.customerId = customerId
    formData.customerItem = customerItem
    formData.customerName = customerItem.customerName
    addCustomerListByItem(customerItem)
  }
  if (workshopInfo) {
    formData.workshopInfo = JSON.parse(workshopInfo)
  }
})


defineExpose({
  getValues,
})
</script>

<style lang="scss" scoped>
.offer-save-customer {
  .title {
    margin-bottom: 24px;
  }

  .work-list-item {
    .work-list-item-form {
      background-color: #fafafa;
      padding: 12px 8px;
      margin: 12px 0;
    }
  }
}
</style>
