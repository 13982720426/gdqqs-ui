<template>
  <div class="app-container">
    <div v-show="custable">
      <div class="header">
        <div>
          <el-space>
            <el-button
              class="sel"
              color="#ffdac6"
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['customer:add']"
            >
              新增
            </el-button>
          </el-space>
        </div>

        <div>
          <el-space>
            <el-input
              v-model="queryParams.customerName"
              placeholder="客户名称模糊搜索"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />

            <el-button
              type="primary"
              color="#ffdac6"
              class="sel"
              icon="Search"
              @click="handleQuery"
            >
              搜索
            </el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-space>
        </div>
      </div>

      <!-- 表格数据 -->
      <el-table
        style="width: 100%"
        v-loading="loading"
        :data="customerList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="客户名称"
          align="center"
          prop="customerName"
          width="120"
        />
        <el-table-column
          label="部门"
          align="center"
          prop="partment"
          :show-overflow-tooltip="true"
          width="120"
        />
        <el-table-column
          label="客户性质"
          align="center"
          prop="customerNature"
          :show-overflow-tooltip="true"
          width="120"
        >
          <template #default="scope">
            <span>
              {{ scope.row.customerNature === '1' ? '经销商' : '最终用户' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="联系人" align="center" prop="contact" />
        <el-table-column
          label="电话"
          align="center"
          prop="contactTell"
          width="130"
        />
        <el-table-column
          label="邮箱"
          :show-overflow-tooltip="true"
          align="center"
          prop="contactEmail"
          width="150"
        />
        <el-table-column
          label="地址"
          :show-overflow-tooltip="true"
          align="center"
          prop="contactAddress"
          width="200"
        />
        <el-table-column label="邮政编码" align="center" prop="postCode" />
        <el-table-column
          label="创建时间"
          :show-overflow-tooltip="true"
          align="center"
          prop="createTime"
          width="200"
        >
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="createBy" />
        <el-table-column
          label="备注"
          :show-overflow-tooltip="true"
          align="center"
          prop="remark"
          width="200"
        />
        <el-table-column
          label="操作"
          width="130"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              class="sel"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['customer:edit']"
            >
              编辑
            </el-button>
            <el-button
              class="sel"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['customer:delete']"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 添加或修改 -->
    <div class="inform" v-show="open">
      <div style="padding: 20px">基本信息</div>
      <el-form
        :model="form"
        :rules="rules"
        label-width="80px"
        style="padding: 20px"
        ref="upcustomer"
      >
        <el-row :gutter="50">
          <el-col :span="6">
            <el-form-item label="客户姓名" prop="customerName">
              <el-input
                maxlength="30"
                :disabled="disabled"
                v-model="form.customerName"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门" prop="partment">
              <el-input
                maxlength="30"
                v-model="form.partment"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户性质" prop="customerNature">
              <el-select
                v-model="form.customerNature"
                placeholder="请选择客户性质"
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

        <el-row :gutter="50">
          <el-col :span="6">
            <el-form-item label="联系人" prop="contact">
              <el-input
                maxlength="30"
                v-model="form.contact"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系电话" prop="contactTell">
              <el-input
                maxlength="30"
                v-model="form.contactTell"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="邮箱" prop="contactEmail">
              <el-input
                maxlength="30"
                v-model="form.contactEmail"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="50">
          <el-col :span="6">
            <el-form-item label="地址" prop="contactAddress">
              <el-input
                maxlength="30"
                v-model="form.contactAddress"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="邮政编码" prop="postCode">
              <el-input
                maxlength="30"
                v-model="form.postCode"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="50">
          <el-col :span="18">
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model="form.remark"
                maxlength="300"
                show-word-limit
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="submit" color="#ffdac6" class="sel">
            保存
          </el-button>
          <el-button type="danger" @click="close">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup name="Customer">
import {
  addCustomer,
  updateCustomer,
  getCustomer,
  delCustomer,
} from '@/api/business/customer'
import { listCustomer } from '@/api/business/customer'
import { ref } from 'vue-demi'

const { proxy } = getCurrentInstance()

const open = ref(false)
const custable = ref(true)

const customerList = ref([])

const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const disabled = ref(false)

const data = reactive({
  form: {
    profitMargin: 5,
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    customerName: undefined,
  },
})

const { queryParams, form } = toRefs(data)

/** 查询客户列表 */
function getList() {
  loading.value = true
  listCustomer(queryParams.value).then((response) => {
    customerList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
  queryParams.value.customerName = ''
  handleQuery()
}
/** 删除按钮操作 */
function handleDelete(row) {
  const customerId = row.customerId || ids.value
  const cusName = row.customerName
  proxy.$modal
    .confirm('是否确认删除客户"' + cusName + '?')
    .then(function () {
      return delCustomer(customerId)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.roleId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 重置新增的表单以及其他数据  */
function reset() {
  form.value = {
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
/** 添加 */
function handleAdd() {
  reset()
  disabled.value = false
  custable.value = false
  open.value = true
}

/** 操作编辑 */
function handleUpdate(row) {
  proxy.$refs['upcustomer'].clearValidate()
  custable.value = false
  open.value = true
  disabled.value = true
  const cusId = row.customerId || ids.value
  getCustomer(cusId).then((response) => {
    form.value = response.data
  })
}

/**新增页面 */
const state = reactive({
  user: {},
})
const dataScopeOptions = ref([
  { value: '1', label: '经销商' },
  { value: '2', label: '最终用户' },
])

const rules = ref({
  customerName: [
    { required: true, message: '客户名称不能为空', trigger: 'blur' },
    { max: 64, message: '客户名称长度不超过64个字符', trigger: 'blur' },
  ],
  partment: [
    { required: true, message: '部门不能为空', trigger: 'blur' },
    { max: 32, message: '部门长度不超过32个字符', trigger: 'blur' },
  ],
  customerNature: [
    { required: true, message: '客户性质不能为空', trigger: 'blur' },
  ],
  contact: [
    { required: true, message: '联系人不能为空', trigger: 'blur' },
    { max: 32, message: '联系人长度不超过32个字符', trigger: 'blur' },
  ],
  contactAddress: [
    { required: true, message: '地址不能为空', trigger: 'blur' },
    { max: 64, message: '地址长度不超过32个字符', trigger: 'blur' },
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
  postCode: [{ max: 6, message: '请输入正确的邮政编码', trigger: 'blur' }],
})

/** 提交按钮 */
function submit() {
  proxy.$refs['upcustomer'].validate((valid) => {
    if (valid) {
      if (form.value.customerNature !== '1') {
        form.value.profitMargin = 10
      }

      if (form.value.customerId != undefined) {
        updateCustomer(form.value).then((response) => {
          if (response.code === 200) {
            proxy.$modal.msgSuccess('修改成功')
          } else {
            proxy.$modal.msgError('修改失败')
          }
        })
      } else {
        addCustomer(form.value).then((response) => {
          if (response.code == 200) {
            proxy.$modal.msgSuccess('新增成功')
          } else {
            proxy.$modal.msgError('新增失败')
          }
        })
      }
      open.value = false
      custable.value = true
      getList()
    }
  })
}
/** 关闭按钮 */
function close() {
  reset()
  proxy.$refs['upcustomer'].clearValidate()
  open.value = false
  custable.value = true
}
getList()
</script>
<style scoped>
.pagination-container {
  background: none;
}
.sel {
  color: #ff5800;
}
.selform {
  float: right;
}
.inform {
  height: 100%;
  background: #ffffff;
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
</style>
