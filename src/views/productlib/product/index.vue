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
      <el-table-column
        label="产品名称"
        align="center"
        prop="productName"
      ></el-table-column>
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
      <el-table-column
        label="起升重量(t)"
        align="center"
        prop="liftWeight"
      >
        <template #default="{ row }">
          <span>{{ liftWeightFormat(row) }}</span>
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
        width="160"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            class="sel"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']"
          >
            修改
          </el-button>
          <el-button
            class="sel"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']"
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
    <el-form ref="saveFormRef" :model="form" :rules="rules" label-width="180px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="产品名称" prop="productName">
            <el-input
              v-model="form.productName"
              placeholder="请输入产品名称"
              style="width: 60%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起重机类型" prop="craneType">
            <el-select
              v-model="form.craneType"
              placeholder="请选择"
              style="width: 60%"
              @change="getCraneModel()"
            >
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
        <el-form-item label="起重机型号" prop="craneModel">
          <template v-if="form.craneType == 1">
            <el-select
              v-model="form.craneModel"
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
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
              style="width: 60%"
              :disabled="disabled"
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
              style="width: 60%"
              :disabled="disabled"
            >
              <el-option
                v-for="dict in q_susp_crane_model"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
          <template v-else>
            <el-select
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            ></el-select>
          </template>
        </el-form-item>
      </el-col>
        <el-col :span="8">
          <el-form-item label="操作方式" prop="craneOperation">
            <el-select
              v-model="form.craneOperation"
              placeholder="请选择"
              style="width: 60%"
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
            <el-select
              v-model="form.control"
              placeholder="请选择"
              style="width: 60%"
            >
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
          <el-form-item label="起升重量(t)" prop="liftWeight">
            <el-select
              v-model="form.liftWeight"
              placeholder="请选择"
              style="width: 60%"
              :disabled="disabled"
              @change="getProductMSG"
            >
              <el-option
                v-for="item in q_lift_weight"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="跨度" prop="span">
            <template v-if="form.craneType == 1">
              <el-select
                v-model="form.span"
                placeholder="请选择"
                style="width: 60%"
                @change="getProductMSG"
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
                style="width: 60%"
                @change="getProductMSG"
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
                style="width: 60%"
                @change="getProductMSG"
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
                style="width: 60%"
                @change="getProductMSG"
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
                style="width: 60%"
                @change="getProductMSG"
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
                style="width: 60%"
                @change="getProductMSG"
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
                style="width: 60%"
                @change="getProductMSG"
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
                style="width: 60%"
                @change="getProductMSG"
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
                style="width: 60%"
                @change="getProductMSG"
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
          <el-form-item label="额定功率(KW)" prop="ratedPower">
            <el-select
              v-model="form.ratedPower"
              placeholder="请选择"
              style="width: 60%"
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
              style="width: 60%"
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
              style="width: 60%"
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
              style="width: 60%"
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
              style="width: 60%"
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
        <el-col :span="8"></el-col>
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
              :show-file-list="false"
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
  getAddProductMSG,
} from '@/api/business/product'
import QTable from '../components/QTable.vue'
import SaveTitle from '@/views/offer/components/Title'
import { UploadFilled } from '@element-plus/icons-vue'
// import { getcraneModelBycraneType } from '@/api/business/product'

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
    prop: 'offerCode',
    label: '部件',
    align: 'center',
  },
  {
    prop: 'model',
    label: '型号',
    align: 'center',
  },
  {
    prop: 'brand',
    label: '品牌',
    align: 'center',
  },
  {
    prop: 'partCode',
    label: '物料编码',
    align: 'center',
  },
  {
    prop: 'num',
    label: '数量',
    align: 'center',
  },
  {
    prop: 'unit',
    label: '单位',
    align: 'center',
  },
  {
    prop: 'price',
    label: '金地球成本价(不含税)',
    align: 'center',
  },
  {
    prop: 'taxrate',
    label: '税率',
    align: 'center',
  },
  {
    prop: 'cpUnprice',
    label: '工厂价加点',
    align: 'center',
  },
  {
    prop: 'factoryPrice',
    label: '金地球工厂价',
    align: 'center',
  },
])

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    craneOperation: '',
    productId: '',
  },
  form: {
    craneType: 1,
  },
  rules: {
    productName: [
      { required: true, message: '请输入产品名称', trigger: 'blur' },
    ],
    craneType: [
      { required: true, message: '请选择起重机类型', trigger: 'blur' },
    ],
    craneOperation: [
      { required: true, message: '请选择操作方式', trigger: 'blur' },
    ],
    control: [{ required: true, message: '请选择遥控器', trigger: 'blur' }],
    liftWeight: [
      { required: true, message: '请选择起升重量', trigger: 'blur' },
    ],
    craneModel: [
      { required: true, message: '请选择起重机型号', trigger: 'blur' },
    ],
    span: [{ required: true, message: '请选择跨度', trigger: 'blur' }],
    liftHeight: [
      { required: true, message: '请选择起升高度', trigger: 'blur' },
    ],
    workLevel: [{ required: true, message: '请选择工作级别', trigger: 'blur' }],
    ratedPower: [
      { required: true, message: '请选择额定功率', trigger: 'blur' },
    ],
    liftSpeed: [{ required: true, message: '请选择起升速度', trigger: 'blur' }],
    crabSpeed: [
      { required: true, message: '请选择小车运行速度', trigger: 'blur' },
    ],
    cartSpeed: [
      { required: true, message: '请选择大车运行速度', trigger: 'blur' },
    ],
    pressureMax: [
      { required: true, message: '请选择最大轮压', trigger: 'blur' },
    ],
    uploadChart: [
      { required: true, message: '请上传设计总图', trigger: 'blur' },
    ],
    uploadCrane: [
      { required: true, message: '请上传起重机数据', trigger: 'blur' },
    ],
    uploadPressure: [
      { required: true, message: '请上传起重机轮压数据', trigger: 'blur' },
    ],
    uploadPrice: [
      { required: true, message: '请上传工厂价BOM清单', trigger: 'blur' },
    ],
  },
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
  q_lift_weight
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
  'q_lift_weight'
)

// 超重机类型翻译
function craneTypeFormat(row, column) {
  return proxy.selectDictLabel(q_crane_type.value, row.craneType)
}
// 操作方式翻译
function craneOperationFormat(row, column) {
  return proxy.selectDictLabel(q_oper_mode.value, row.craneOperation)
}
// 起升重量翻译
function liftWeightFormat(row, column) {
  return proxy.selectDictLabel(q_lift_weight.value, row.liftWeight)
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
  proxy.$refs['uploadRef'].handleRemove(file)

  if (response.code === 200) {
    proxy.$modal.msgSuccess('导入成功')
    getList()
  } else {
    proxy.$modal.msgError(`导入失败，${response.msg}`)
  }
  upload.open = false
  upload.isUploading = false
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
    productName: '',
    craneType: '1',
    craneOperation: '',
    control: '',
    craneModel: '',
    span: '',
    liftHeight: '',
    workLevel: '',
    ratedPower: '',
    liftSpeed: '',
    crabSpeed: '',
    cartSpeed: '',
    pressureMax: '',
    uploadChart: '',
    uploadCrane: '',
    uploadPressure: '',
    uploadPrice: '',
    bomParams: undefined,
  }
  proxy.resetForm('saveFormRef')
}

function getvalues(data) {
  data.forEach((e) => {
    excelList.value = e.bomParams
  })
  form.value.bomParams = JSON.stringify(excelList.value)
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['saveFormRef'].validate((valid) => {
    if (valid) {
      if (form.value.productId != undefined ) {
        updateProduct(form.value).then((response) => {
          if(response.code===200){
            proxy.$modal.msgSuccess('修改成功')  
            showList.value = true
            getList()         
          }
        })
      } else {
        addProduct(form.value).then((response) => {
          if(response.code===200){
            proxy.$modal.msgSuccess('新增成功') 
            showList.value = true  
            getList()         
          }
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
}
/** 新增按钮操作 */
function handleAdd() {
  reset()
  excelList.value=[]
  showList.value = false
  saveTitle.value = '新增产品'
}
/** 修改按钮操作 */
function handleUpdate(row) {
  const productId = row.productId || ids.value
  getProduct(productId).then((response) => {
    form.value = response.data
    excelList.value = JSON.parse(response.data.bomParams)
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

/** 导出按钮操作 */
function handleExport() {
  if (ids.value.length !== 0) {
    proxy.download(
      'business/product/export',
      {
        productIds: ids.value,
        ...queryParams.vallue,
      },
      `product_${new Date().getTime()}.xlsx`,
    )
  }
}

async function getProductMSG() {
  const { liftWeight, span, workLevel, liftHeight } = form.value
  if (liftWeight && span && workLevel && liftHeight) {
    const params = {
      liftWeight,
      span,
      workLevel,
      liftHeight,
    }
    const res = await getAddProductMSG(params)
    if (res.code === 200) {
      const data = JSON.parse(res.data.bomParams)
      excelList.value = data
    } else {
      proxy.$modal.msgError(`查询失败，${response.msg}`)
    }
  }
}

function getCraneModel() {
  form.value.craneModel = ''
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
