<template>
  <div class="app-container" v-show="showList">
    <div class="search-tool">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="Plus"
            size="mini"
            @click="handleAdd"
            color="#ffdac6"
            class="sel"
            v-hasPermi="['business:product:add']"
          >
            新增
          </el-button>
          <el-button
            type="primary"
            icon="Download"
            size="mini"
            @click="handleImport"
            color="#ffdac6"
            class="sel"
            v-hasPermi="['business:product:import']"
          >
            导入
          </el-button>
          <el-button
            type="primary"
            icon="UploadFilled"
            size="mini"
            @click="handleExport"
            color="#ffdac6"
            class="sel"
            v-hasPermi="['business:product:export']"
          >
            导出
          </el-button>
        </el-col>
      </el-row>
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item prop="craneOperation">
          <el-select
            v-model="queryParams.craneOperation"
            placeholder="请选择操作方式"
            clearable
          >
            <el-option
              v-for="dict in q_oper_mode"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            color="#ffdac6"
            class="sel"
            type="primary"
            icon="Search"
            @click="handleQuery"
          >
            搜索
          </el-button>
          <el-button icon="Refresh" size="mini" @click="resetQuery">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      :data="productList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="起重机类型" align="center" prop="craneType">
        <template #default="{ row }">
          <span>{{ craneTypeFormat(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作方式" align="center" prop="craneOperation">
        <template #default="{ row }">
          <span>{{ craneOperationFormat(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="起重机型号" align="center" prop="craneModel">
        <template #default="{ row }">
          <span>{{ craneModelFormat(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跨度" align="center" prop="span">
        <template #default="{ row }">
          <span>{{ spanFormat(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="起升高度" align="center" prop="liftHeight">
        <template #default="{ row }">
          <span>{{ liftHeightFormat(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作级别" align="center" prop="workLevel">
        <template #default="{ row }">
          <span>{{ workLevelFormat(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        width="160"
      >
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:product:edit']"
            class="sel"
          >
            修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:product:remove']"
            class="sel"
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

  <SaveTitle :title="saveTitle" v-show="!showList">
    <el-form ref="saveFormRef" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="起重机类型" prop="craneType">
            <el-select v-model="form.craneType" placeholder="请选择" clearable>
              <el-option
                v-for="dict in q_crane_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作方式" prop="craneOperation">
            <el-select
              v-model="form.craneOperation"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="dict in q_oper_mode"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="遥控器" prop="control">
            <el-select v-model="form.control" placeholder="请选择" clearable>
              <el-option
                v-for="dict in sys_yes_no"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起重机型号" prop="craneModel">
            <template v-if="form.craneType == 1">
              <el-select
                v-model="form.craneModel"
                placeholder="请选择"
                clearable
                style="width: 53%"
              >
                <el-option
                  v-for="dict in q_single_crane_model"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
            <template v-else-if="form.craneType == 2">
              <el-select
                v-model="form.craneModel"
                placeholder="请选择"
                clearable
                style="width: 53%"
              >
                <el-option
                  v-for="dict in q_double_crane_model"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
            <template v-else-if="form.craneType == 3">
              <el-select
                v-model="form.craneModel"
                placeholder="请选择"
                clearable
                style="width: 53%"
              >
                <el-option
                  v-for="dict in q_susp_crane_model"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="跨度" prop="span">
            <template v-if="form.craneType == 1">
              <el-select
                v-model="form.span"
                placeholder="请选择"
                clearable
                style="width: 53%"
              >
                <el-option
                  v-for="dict in q_single_crane_span"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
            <template v-else-if="form.craneType == 2">
              <el-select
                v-model="form.span"
                placeholder="请选择"
                clearable
                style="width: 53%"
              >
                <el-option
                  v-for="dict in q_double_crane_span"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
            <template v-else-if="form.craneType == 3">
              <el-select
                v-model="form.span"
                placeholder="请选择"
                clearable
                style="width: 53%"
              >
                <el-option
                  v-for="dict in q_susp_crane_span"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起升高度" prop="liftHeight">
            <template v-if="form.craneType == 1">
              <el-select
                v-model="form.liftHeight"
                placeholder="请选择"
                clearable
                style="width: 53%"
              >
                <el-option
                  v-for="dict in q_single_crane_lift_height"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
            <template v-else-if="form.craneType == 2">
              <el-select
                v-model="form.liftHeight"
                placeholder="请选择"
                clearable
                style="width: 53%"
              >
                <el-option
                  v-for="dict in q_double_crane_lift_height"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
            <template v-else-if="form.craneType == 3">
              <el-select
                v-model="form.liftHeight"
                placeholder="请选择"
                clearable
                style="width: 53%"
              >
                <el-option
                  v-for="dict in q_susp_crane_lift_height"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工作级别" prop="workLevel">
            <template v-if="form.craneType == 1">
              <el-select
                v-model="form.workLevel"
                placeholder="请选择"
                clearable
                style="width: 53%"
              >
                <el-option
                  v-for="dict in q_single_crane_work_level"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
            <template v-else-if="form.craneType == 2">
              <el-select
                v-model="form.workLevel"
                placeholder="请选择"
                clearable
                style="width: 53%"
              >
                <el-option
                  v-for="dict in q_double_crane_work_level"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
            <template v-else-if="form.craneType == 3">
              <el-select
                v-model="form.workLevel"
                placeholder="请选择"
                clearable
                style="width: 53%"
              >
                <el-option
                  v-for="dict in q_susp_crane_work_level"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="额定功率KW" prop="ratedPower">
            <el-select
              v-model="form.ratedPower"
              placeholder="请选择"
              clearable
              style="width: 53%"
            >
              <el-option
                v-for="dict in q_rated_power"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起升速度" prop="liftSpeed">
            <el-select
              v-model="form.liftSpeed"
              placeholder="请选择"
              clearable
              style="width: 53%"
            >
              <el-option
                v-for="dict in q_lift_speed"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="小车运行速度" prop="crabSpeed">
            <el-select
              v-model="form.crabSpeed"
              placeholder="请选择"
              clearable
              style="width: 53%"
            >
              <el-option
                v-for="dict in q_crab_speed"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="大车运行速度" prop="cartSpeed">
            <el-select
              v-model="form.cartSpeed"
              placeholder="请选择"
              clearable
              style="width: 53%"
            >
              <el-option
                v-for="dict in q_cart_speed"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最大轮压" prop="pressureMax">
            <el-select
              v-model="form.pressureMax"
              placeholder="请选择"
              clearable
              style="width: 53%"
            >
              <el-option
                v-for="dict in q_pressure_max"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上传设计总图" prop="uploadChart">
            <file-upload
              v-model:modelValue="form.uploadChart"
              :fileType="['.PDF', '.pdf']"
              btnText="上传文件"
              btnIcon="Upload"
              :isShowTip="false"
              :limit="1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上传起重机数据" prop="uploadCrane">
            <file-upload
              :limit="1"
              v-model:modelValue="form.uploadCrane"
              :fileType="['.DOCX', '.docx']"
              btnText="上传文件"
              btnIcon="Upload"
              :isShowTip="false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上传起重机轮压数据" prop="uploadPressure">
            <file-upload
              :limit="1"
              v-model:modelValue="form.uploadPressure"
              :fileType="['.DOCX', '.docx', '.doc']"
              btnText="上传文件"
              btnIcon="Upload"
              :isShowTip="false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上传工厂价BOM清单" prop="uploadPrice">
            <file-upload
              :limit="1"
              v-model:modelValue="form.uploadPrice"
              :uploadUrl="upUrl"
              :fileType="['.xls', '.xlsx']"
              btnText="上传文件"
              btnIcon="Upload"
              :isShowTip="false"
              @uploadSuccess="getvalues"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <span style="font-size: 12px; padding-bottom: 50px">型号：</span>
      <QTable
        :loading="loading"
        :data="excelList"
        :columns="excelListColumns"
        :showOper="false"
        class="tab"
      ></QTable>
    </el-form>
    <div class="save-footer">
      <el-button type="primary" @click="submitForm" color="#ffdac6" class="sel">
        确 定
      </el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </SaveTitle>

  <!-- 导入对话框 -->
  <el-dialog
    :title="upload.title"
    v-model="upload.open"
    width="400px"
    append-to-body
  >
    <el-upload
      ref="uploadRef"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :action="upload.url + '?updateSupport=' + upload.updateSupport"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <span>仅允许导入xls、xlsx格式文件。</span>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="Product">
import { getToken } from '@/utils/auth'
import {
  listProduct,
  getProduct,
  delProduct,
  addProduct,
  updateProduct,
} from '@/api/business/product'
import QTable from '../components/QTable.vue'
import SaveTitle from '@/views/offer/components/Title'
import { UploadFilled } from '@element-plus/icons-vue'
const upUrl = ref(
  import.meta.env.VITE_APP_BASE_API + '/business/product/readExcel',
)
const productUrl = ref(
  import.meta.env.VITE_APP_BASE_API + '/business/productpart/importData',
)
const mb = ref('') //模板下载地址
const { proxy } = getCurrentInstance()
const router = useRouter()
const headers = ref({
  Authorization: 'Bearer ' + getToken(),
  'Access-Control-Allow-Origin': '*',
})
const productList = ref([])
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const showList = ref(true)
const saveTitle = ref('新增产品')
const open = ref(false)
const excelList = ref([])
const excelListColumns = ref([
  {
    id: 1,
    prop: '0',
    label: '部件',
    align: 'center',
  },
  {
    id: 2,
    prop: '1',
    label: '型号',
    align: 'center',
  },
  {
    id: 3,
    prop: '2',
    label: '品牌',
    align: 'center',
  },
  {
    id: 4,
    prop: '3',
    label: '数量',
    align: 'center',
  },
  {
    id: 5,
    prop: '4',
    label: '单位',
    align: 'center',
  },
  {
    id: 6,
    prop: '5',
    label: '进地球成本价(不含税)',
    align: 'center',
  },
  {
    id: 7,
    prop: '6',
    label: '税率',
    align: 'center',
  },
  {
    id: 8,
    prop: 'cpUnprice',
    label: '工厂价加点',
    align: 'center',
  },
  {
    id: 9,
    prop: '7',
    label: '金地球工厂价',
    align: 'center',
  },
])

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    craneOperation: null,
    productId: null,
  },
  form: {},
  rules: {},
})

const { queryParams, form, rules } = toRefs(data)

const {
  q_crane_type,
  q_oper_mode,
  sys_yes_no,
  q_single_crane_model,
  q_double_crane_model,
  q_susp_crane_model,
  q_single_crane_span,
  q_double_crane_span,
  q_susp_crane_span,
  q_single_crane_lift_height,
  q_double_crane_lift_height,
  q_susp_crane_lift_height,
  q_single_crane_work_level,
  q_double_crane_work_level,
  q_susp_crane_work_level,
  q_rated_power,
  q_lift_speed,
  q_crab_speed,
  q_cart_speed,
  q_pressure_max,
} = proxy.useDict(
  'q_crane_type',
  'q_oper_mode',
  'sys_yes_no',
  'q_single_crane_model',
  'q_double_crane_model',
  'q_susp_crane_model',
  'q_single_crane_span',
  'q_double_crane_span',
  'q_susp_crane_span',
  'q_single_crane_lift_height',
  'q_double_crane_lift_height',
  'q_susp_crane_lift_height',
  'q_single_crane_work_level',
  'q_double_crane_work_level',
  'q_susp_crane_work_level',
  'q_rated_power',
  'q_lift_speed',
  'q_crab_speed',
  'q_cart_speed',
  'q_pressure_max',
)

// 超重机类型翻译
function craneTypeFormat(row, column) {
  return proxy.selectDictLabel(q_crane_type.value, row.craneType)
}
// 操作方式翻译
function craneOperationFormat(row, column) {
  return proxy.selectDictLabel(q_oper_mode.value, row.craneOperation)
}
// 起重机型号翻译
function craneModelFormat(row, column) {
  if (row.craneType == 1) {
    return proxy.selectDictLabel(q_single_crane_model.value, row.craneModel)
  } else if (row.craneType == 2) {
    return proxy.selectDictLabel(q_double_crane_model.value, row.craneModel)
  } else if (row.craneType == 3) {
    return proxy.selectDictLabel(q_susp_crane_model.value, row.craneModel)
  }
}
// 跨度翻译
function spanFormat(row, column) {
  if (row.craneType == 1) {
    return proxy.selectDictLabel(q_single_crane_span.value, row.span)
  } else if (row.craneType == 2) {
    return proxy.selectDictLabel(q_double_crane_span.value, row.span)
  } else if (row.craneType == 3) {
    return proxy.selectDictLabel(q_susp_crane_span.value, row.span)
  }
}
//起升高度翻译
function liftHeightFormat(row, column) {
  if (row.craneType == 1) {
    return proxy.selectDictLabel(
      q_single_crane_lift_height.value,
      row.liftHeight,
    )
  } else if (row.craneType == 2) {
    return proxy.selectDictLabel(
      q_double_crane_lift_height.value,
      row.liftHeight,
    )
  } else if (row.craneType == 3) {
    return proxy.selectDictLabel(q_susp_crane_lift_height.value, row.liftHeight)
  }
}
// 工作级别翻译
function workLevelFormat(row, column) {
  if (row.craneType == 1) {
    return proxy.selectDictLabel(q_single_crane_work_level.value, row.workLevel)
  } else if (row.craneType == 2) {
    return proxy.selectDictLabel(q_double_crane_work_level.value, row.workLevel)
  } else if (row.craneType == 3) {
    return proxy.selectDictLabel(q_susp_crane_work_level.value, row.workLevel)
  }
}

/** 查询产品列表 */
function getList() {
  loading.value = true
  listProduct(queryParams.value).then((response) => {
    productList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// //文件上传
// function submitfile() {}

/*** 导入参数 */
const upload = reactive({
  // 是否显示弹出层
  open: false,
  // 弹出层标题
  title: '',
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: 'Bearer ' + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + '/business/product/importData',
})
/** 导入按钮操作 */
function handleImport() {
  upload.title = '产品导入'
  upload.open = true
}

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true
}
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false
  upload.isUploading = false
  proxy.$refs['uploadRef'].handleRemove(file)
  proxy.$modal.msgSuccess('导入成功')
  getList()
}
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs['uploadRef'].submit()
}

// 取消按钮
function cancel() {
  showList.value = true
  reset()
}
// 表单重置
function reset() {
  form.value = {
    craneType: '1',
    craneOperation: null,
    control: null,
    craneModel: null,
    span: null,
    liftHeight: null,
    workLevel: null,
    ratedPower: null,
    liftSpeed: null,
    crabSpeed: null,
    cartSpeed: null,
    pressureMax: null,
    uploadChart: null,
    uploadCrane: null,
    uploadPressure: null,
    uploadPrice: null,
    bomParams: undefined,
  }
  proxy.resetForm('saveFormRef')
}

function getvalues(data) {
  // form.value.bomParams = JSON.parse(data.bomParams)
  data.forEach((e) => {
    // excelList.value.push(e.bomParams)
    excelList.value = e.bomParams
  })
  form.value.bomParams = JSON.stringify(excelList.value)
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['saveFormRef'].validate((valid) => {
    if (valid) {
      if (form.value.productId != null) {
        updateProduct(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          showList.value = true
          getList()
        })
      } else {
        addProduct(form.value).then((response) => {
          proxy.$modal.msgSuccess('新增成功')
          showList.value = true
          getList()
        })
      }
    }
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryForm')
  handleQuery()
}
// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.productId)
  single.value = selection.length !== 1
  multiple.value = !selection.length
  console.log(ids.value, single.value, multiple.value)
}
/** 新增按钮操作 */
function handleAdd() {
  reset()
  showList.value = false
}
/** 修改按钮操作 */
function handleUpdate(row) {
  const productId = row.productId || ids.value
  getProduct(productId).then((response) => {
    form.value = response.data
    showList.value = false
    saveTitle.value = '修改产品'
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const productIds = row.productId || ids.value
  proxy.$modal
    .confirm('是否确认删除此数据项？')
    .then(function () {
      return delProduct(productIds)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}

//上传格式检验
// 上传前校检格式和大小
function handleBeforeUpload(file) {
  // 校检文件类型
  let fileExtension = ''
  if (file.name?.lastIndexOf('.') > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
  }
  if (fileExtension !== 'xls' || fileExtension !== 'xlsx') {
    proxy.$modal.msgError(
      `文件格式不正确, 请上传${fileType.join('/')}格式文件!`,
    )
  }
  // 校检文件大小
  if (fileSize) {
    const isLt = file.size / 1024 / 1024 < fileSize
    if (!isLt) {
      proxy.$modal.msgError(`上传文件大小不能超过 ${fileSize} MB!`)
      return false
    }
  }
  proxy.$modal.loading('正在上传文件，请稍候...')
  number.value++
  return true
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download(
    'business/product/export',
    {
      productId: ids,
      ...queryParams.vallue,
    },
    `product_${new Date().getTime()}.xlsx`,
  )
  console.log('----queryParams:', queryParams.value, '----ids:', ids)
}

getList()
</script>
<style lang="scss" scoped>
.save-container {
  background-color: #ffffff;
}

.search-tool {
  display: flex;
  justify-content: space-between;
}
.sel {
  color: #ff5800;
}
.tab {
  font-size: 12px;
  padding-bottom: 20px;
  padding-top: 20px;
}
.el-upload-dragger {
  width: 600px !important;
}
</style>
