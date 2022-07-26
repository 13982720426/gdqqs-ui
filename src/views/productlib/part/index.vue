<template>
  <div class="app-container" v-show="opentable">
    <div class="search-tool">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            color="#ffdac6"
            class="sel"
            type="primary"
            icon="Plus"
            @click="handleAdd"
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
        </el-col>
      </el-row>
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item prop="trackModel" v-show="orbitModel">
          <el-select
            v-model="queryParams.trackModel"
            placeholder="请选择轨道型号"
            clearable
          >
            <el-option
              v-for="dict in q_track_model"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="splLevel" v-show="slipLine">
          <el-select
            v-model="queryParams.splLevel"
            placeholder="请选择滑线数级"
            clearable
          >
            <el-option
              v-for="dict in q_spl_level"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="trackModel" v-show="orbit">
          <el-select
            v-model="queryParams.trackModel"
            placeholder="请选择轨道型号"
            clearable
          >
            <el-option
              v-for="dict in q_track_model"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="model" v-show="paint">
          <el-input
            v-model="queryParams.model"
            placeholder="请输入油漆型号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item prop="craneType" v-show="crane">
          <el-select
            v-model="queryParams.craneType"
            placeholder="请选择起重机类型"
            clearable
          >
            <el-option
              v-for="dict in q_crane_type"
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
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-tabs v-model="activeTab" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="产品部件" name="first">
        <QTable
          :loading="loading"
          :data="productPartList"
          :columns="productPartColumns"
          @selectionChange="handleSelectionChange"
        >
          <template #default="{ row }">
            <el-button
              class="sel"
              type="text"
              @click="handleUpdate(row)"
              v-hasPermi="['business:product:edit']"
            >
              修改
            </el-button>
            <el-button
              class="sel"
              type="text"
              @click="handleDelete(row)"
              v-hasPermi="['business:product:remove']"
            >
              删除
            </el-button>
          </template>
        </QTable>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="轨道" name="second">
        <QTable
          :loading="loading"
          :data="trackPartList"
          :columns="trackPartColumns"
          @selectionChange="handleSelectionChange"
        >
          <template #default="{ row }">
            <el-button
              class="sel"
              type="text"
              @click="handleUpdate(row)"
              v-hasPermi="['business:product:edit']"
            >
              修改
            </el-button>
            <el-button
              class="sel"
              type="text"
              @click="handleDelete(row)"
              v-hasPermi="['business:product:remove']"
            >
              删除
            </el-button>
          </template>
        </QTable>
        <pagination
          class="pagination-container"
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="滑线" name="third">
        <QTable
          :loading="loading"
          :data="splPartList"
          :columns="splPartColumns"
          @selectionChange="handleSelectionChange"
        >
          <template #default="{ row }">
            <el-button
              class="sel"
              type="text"
              @click="handleUpdate(row)"
              v-hasPermi="['business:product:edit']"
            >
              修改
            </el-button>
            <el-button
              class="sel"
              type="text"
              @click="handleDelete(row)"
              v-hasPermi="['business:product:remove']"
            >
              删除
            </el-button>
          </template>
        </QTable>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="大车止档型号" name="fourth">
        <QTable
          :loading="loading"
          :data="crastopmodelPartList"
          :columns="crastopmodelPartColumns"
          @selectionChange="handleSelectionChange"
        >
          <template #default="{ row }">
            <el-button
              class="sel"
              type="text"
              @click="handleUpdate(row)"
              v-hasPermi="['business:product:edit']"
            >
              修改
            </el-button>
            <el-button
              class="sel"
              type="text"
              @click="handleDelete(row)"
              v-hasPermi="['business:product:remove']"
            >
              删除
            </el-button>
          </template>
        </QTable>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="油漆" name="five">
        <QTable
          :loading="loading"
          :data="paintPartList"
          :columns="paintPartColumns"
          @selectionChange="handleSelectionChange"
        >
          <template #default="{ row }">
            <el-button
              class="sel"
              type="text"
              @click="handleUpdate(row)"
              v-hasPermi="['business:product:edit']"
            >
              修改
            </el-button>
            <el-button
              class="sel"
              type="text"
              @click="handleDelete(row)"
              v-hasPermi="['business:product:remove']"
            >
              删除
            </el-button>
          </template>
        </QTable>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
  <SaveTitle :title="saveTitle" v-show="showList">
    <Save
      :form="form"
      :rules="rules"
      :type="saveType"
      ref="saveFormRef"
      :disabled="disabled"
    />
    <div class="save-footer">
      <el-button color="#ffdac6" class="sel" type="primary" @click="submitForm">
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

<script setup name="Part">
import {
  listTrackpart,
  getTrackpart,
  addTrackpart,
  updateTrackpart,
  delTrackpart,
} from '@/api/business/trackpart'
import {
  listSplpart,
  getSplpart,
  addSplpart,
  updateSplpart,
  delSplpart,
} from '@/api/business/splpart'
import {
  listCrastopmodelpart,
  getCrastopmodelpart,
  addCrastopmodelpart,
  updateCrastopmodelpart,
  delCrastopmodelpart,
} from '@/api/business/crastopmodelpart'
import {
  listPaintpart,
  getPaintpart,
  addPaintpart,
  updatePaintpart,
  delPaintpart,
} from '@/api/business/paintpart'
import {
  listProductpart,
  searchProductpart,
  getProductpart,
  addProductpart,
  updateProductpart,
  delProductpart,
} from '@/api/business/productpart'
import { listProduct } from '@/api/business/product'
import SaveTitle from '@/views/offer/components/Title'
import QTable from '../components/QTable.vue'
import Save from './save.vue'
import { reactive } from 'vue-demi'
import { getToken } from '@/utils/auth'

const orbitModel = ref(true)
const slipLine = ref(false)
const orbit = ref(false)
const paint = ref(false)
const crane = ref(false)

const { proxy } = getCurrentInstance()
const router = useRouter()

const disabled = ref(false)

const productList = ref([])
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const showList = ref(false)
const opentable = ref(true)
const saveTitle = ref('新增轨道')
const activeTab = ref('first')
const saveType = ref('install') // 部件分类 install-轨道 滑线 大车止档型号 油漆 product-产品部件
const trackPartList = ref([])
const trackPartColumns = ref([
  {
    id: 1,
    prop: 'partType',
    label: '部件类型',
    align: 'center',
    format: (row) => installPartsFormat(row),
  },
  {
    id: 2,
    prop: 'fixedMode',
    label: '固定方式',
    align: 'center',
    format: (row) => fixedWayFormat(row),
  },
  {
    id: 3,
    prop: 'trackModel',
    label: '轨道型号',
    align: 'center',
    format: (row) => orbitModelFormat(row),
  },
  {
    id: 4,
    prop: 'sgltrackLength',
    label: '单根长度(米)',
    align: 'center',
  },
  {
    id: 5,
    prop: 'sgltrackWeight',
    label: '单根重量(公斤/米)',
    align: 'center',
  },
  {
    id: 6,
    prop: 'trackUnprice',
    label: '轨道单价(元/公斤)',
    align: 'center',
  },
  {
    id: 7,
    prop: 'tppUnprice',
    label: '压板单价',
    align: 'center',
  },
  {
    id: 8,
    prop: 'cpUnprice',
    label: '联结板单价',
    align: 'center',
  },
  {
    id: 9,
    prop: 'thsUnprice',
    label: '吊装台班单价',
    align: 'center',
  },
  {
    id: 10,
    prop: 'trackInstallPrice',
    label: '轨道安装单价',
    align: 'center',
  },
])
const splPartList = ref([])
const splPartColumns = ref([
  {
    id: 1,
    prop: 'partType',
    label: '部件类型',
    align: 'center',
    format: (row) => installPartsFormat(row),
  },
  {
    id: 2,
    prop: 'splLevel',
    label: '滑线级数',
    align: 'center',
    format: (row) => splLevelFormat(row),
  },
  {
    id: 3,
    prop: 'splPartName',
    label: '滑线名称',
    align: 'center',
  },
  {
    id: 4,
    prop: 'electricMax',
    label: '最大电流',
    align: 'center',
    format: (row) => electricMaxFormat(row),
  },
  {
    id: 5,
    prop: 'trolleyUnprice',
    label: '滑触线单价',
    align: 'center',
  },
  {
    id: 6,
    prop: 'collector',
    label: '集电器',
    align: 'center',
  },
  {
    id: 7,
    prop: 'installUnprice',
    label: '安装费单价',
    align: 'center',
  },
  {
    id: 8,
    prop: 'idlightUnprice',
    label: '指示灯单价',
    align: 'center',
  },
  {
    id: 9,
    prop: 'rcableUnprice',
    label: '上升电缆单价',
    align: 'center',
  },
])
const crastopmodelPartList = ref([])
const crastopmodelPartColumns = ref([
  {
    id: 1,
    prop: 'partType',
    label: '部件类型',
    align: 'center',
    format: (row) => installPartsFormat(row),
  },
  {
    id: 2,
    prop: 'weight',
    label: '重量',
    align: 'center',
  },
  {
    id: 3,
    prop: 'unprice',
    label: '单价',
    align: 'center',
  },
  {
    id: 4,
    prop: 'trackModel',
    label: '轨道型号',
    align: 'center',
    format: (row) => orbitModelFormat(row),
  },
])
const paintPartList = ref([])
const paintPartColumns = ref([
  {
    id: 1,
    prop: 'partType',
    label: '部件类型',
    align: 'center',
    format: (row) => installPartsFormat(row),
  },
  {
    id: 2,
    prop: 'model',
    label: '型号',
    align: 'center',
  },
  {
    id: 3,
    prop: 'brand',
    label: '品牌',
    align: 'center',
  },
  {
    id: 4,
    prop: 'oilPrice',
    label: '单价',
    align: 'center',
  },
  {
    id: 4,
    prop: 'partCode',
    label: '物料编码',
    align: 'center',
  },
])
const productPartList = ref([])
const productPartColumns = ref([
  {
    id: 1,
    prop: 'partType',
    label: '全部部件类型',
    align: 'center',
    format: (row) => productFormat(row),
  },
  {
    id: 2,
    prop: 'craneType',
    label: '起重机类型',
    align: 'center',
    format: (row) => craneTypeFormat(row),
  },
  {
    id: 3,
    prop: 'craneModel',
    label: '起重机型号',
    align: 'center',
  },
  {
    id: 4,
    prop: 'liftWeight',
    label: '起升重量(t)',
    align: 'center',
  },
  {
    id: 5,
    prop: 'span',
    label: '跨度',
    align: 'center',
    format: (row) => spanFormat(row),
  },
  {
    id: 6,
    prop: 'liftHeight',
    label: '起升高度',
    align: 'center',
    format: (row) => liftHeightFormat(row),
  },
  {
    id: 7,
    prop: 'workLevel',
    label: '工作级别',
    align: 'center',
    format: (row) => workLevelFormat(row),
  },
  {
    id: 8,
    prop: 'partCode',
    label: '物料编码',
    align: 'center',
  },
  {
    id: 9,
    prop: 'brand',
    label: '品牌',
    align: 'center',
  },
  {
    id: 10,
    prop: 'quantity',
    label: '数量',
    align: 'center',
  },
  {
    id: 11,
    prop: 'unit',
    label: '单位',
    align: 'center',
    format: (row) => unitFormat(row),
  },
  {
    id: 12,
    prop: 'unitPrice',
    label: '单价',
    align: 'center',
  },
  {
    id: 13,
    prop: 'createTime',
    label: '创建时间',
    align: 'center',
  },
])
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    trackModel: undefined,
    splLevel: undefined,
    unprice: undefined,
    model: undefined,
    craneModel: undefined,
  },
  form: {},
  rules: {
    partType: [{ required: true, message: '请选择部件类型', trigger: 'blur' }],

    //轨道
    fixedMode: [{ required: true, message: '请选择固定方式', trigger: 'blur' }],
    sgltrackLength: [
      { required: true, message: '请输入单根轨道长度', trigger: 'blur' },
    ],
    sgltrackWeight: [
      { required: true, message: '请输入单根轨道重量', trigger: 'blur' },
    ],
    trackUnprice: [
      { required: true, message: '请输入单根轨道单价', trigger: 'blur' },
    ],
    tppUnprice: [
      { required: true, message: '请输入轨道压板单价', trigger: 'blur' },
    ],
    cpUnprice: [
      { required: true, message: '请输入联结板单价', trigger: 'blur' },
    ],
    thsUnprice: [
      { required: true, message: '请输入轨道吊装台班单价', trigger: 'blur' },
    ],
    trackInstallPrice: [
      { required: true, message: '请输入轨道安装单价', trigger: 'blur' },
    ],

    //滑线
    splLevel: [{ required: true, message: '请选择滑线级数', trigger: 'blur' }],
    splPartName: [
      { required: true, message: '请输入滑线名称', trigger: 'blur' },
    ],
    electricMax: [
      { required: true, message: '请选择最大电流', trigger: 'blur' },
    ],
    trolleyUnprice: [
      { required: true, message: '请输入滑触线单价', trigger: 'blur' },
    ],
    collector: [{ required: true, message: '请输入集电器', trigger: 'blur' }],
    installUnprice: [
      { required: true, message: '请输入安装费单价', trigger: 'blur' },
    ],
    idlightUnprice: [
      { required: true, message: '请输入指示灯单价', trigger: 'blur' },
    ],
    rcableUnprice: [
      { required: true, message: '请输入上升电缆单价', trigger: 'blur' },
    ],

    //大车止档型号
    weight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
    unprice: [{ required: true, message: '请输入单价', trigger: 'blur' }],
    trackModel: [
      { required: true, message: '请选择轨道型号', trigger: 'blur' },
    ],

    //油漆
    model: [{ required: true, message: '请输入型号', trigger: 'blur' }],
    brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
    oilPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }],

    //产品部件
    craneType: [
      { required: true, message: '请选择起重机类型', trigger: 'blur' },
    ],
    craneOperation: [
      { required: true, message: '请选择操作方式', trigger: 'blur' },
    ],
    control: [{ required: true, message: '请选择控制器', trigger: 'blur' }],
    craneModel: [
      { required: true, message: '请选择起重机型号', trigger: 'blur' },
    ],
    span: [{ required: true, message: '请选择跨度', trigger: 'blur' }],
    liftHeight: [
      { required: true, message: '请选择起升高度', trigger: 'blur' },
    ],
    workLevel: [{ required: true, message: '请选择工作级别', trigger: 'blur' }],
    liftWeight: [
      { required: true, message: '请选择起升重量', trigger: 'blur' },
    ],
    quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
    partCode: [{ required: true, message: '请输入物料编码', trigger: 'blur' }],
    brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
    unit: [{ required: true, message: '请选择单位', trigger: 'blur' }],
    unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }],
  },

  productsub: {},
})


const { queryParams, form, rules, productsub } = toRefs(data)

const {
  q_crane_type,
  q_oper_mode,
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
  q_install_parttype,
  q_fixed_mode,
  q_track_model,
  q_part_type,
  q_unit,
  q_spl_level,
  q_electric_max,
  qq_electric_max,
} = proxy.useDict(
  'q_crane_type',
  'q_oper_mode',
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
  'q_install_parttype',
  'q_fixed_mode',
  'q_track_model',
  'q_part_type',
  'q_unit',
  'q_spl_level',
  'q_electric_max',
  'qq_electric_max',
)

// 超重机类型翻译
function craneTypeFormat(row, column) {
  return proxy.selectDictLabel(q_crane_type.value, row.craneType)
}
// 操作方式翻译
function craneOperationFormat(row, column) {
  return proxy.selectDictLabel(q_oper_mode.value, row.craneOperation)
}
// 跨度翻译
function spanFormat(row, column) {
  return proxy.selectDictLabel(q_double_crane_span.value, row.span)
}
//起升高度翻译
function liftHeightFormat(row, column) {
  return proxy.selectDictLabel(q_double_crane_lift_height.value, row.liftHeight)
}
// 工作级别翻译
function workLevelFormat(row, column) {
  return proxy.selectDictLabel(q_double_crane_work_level.value, row.workLevel)
}

//起重机单位
function unitFormat(row, column) {
  return proxy.selectDictLabel(q_unit.value, row.unit)
}
//安装部件翻译
function installPartsFormat(row, column) {
  return proxy.selectDictLabel(q_install_parttype.value, row.partType)
}
//固定方式翻译
function fixedWayFormat(row, column) {
  return proxy.selectDictLabel(q_fixed_mode.value, row.fixedMode)
}
//轨道型号翻译
function orbitModelFormat(row, column) {
  return proxy.selectDictLabel(q_track_model.value, row.trackModel)
}
//产品部件类型翻译
function productFormat(row, column) {
  return proxy.selectDictLabel(q_part_type.value, row.partType)
}
//滑线级数翻译
function splLevelFormat(row, column) {
  return proxy.selectDictLabel(q_spl_level.value, row.splLevel)
}
//最大电流翻译
function electricMaxFormat(row, column) {
  if (row.splLevel == 1) {
    return proxy.selectDictLabel(q_electric_max.value, row.electricMax)
  } else {
    return proxy.selectDictLabel(qq_electric_max.value, row.electricMax)
  }
}

/** 查询列表 */
function getList() {
  loading.value = true
  if (activeTab.value == 'first') {
    if (!queryParams.value.craneType) {
      listProductpart(queryParams.value).then((response) => {
        productPartList.value = response.rows
        total.value = response.total
        loading.value = false
      })
    } else {
      searchProductpart(queryParams.value).then((response) => {
        productPartList.value = response.rows
        total.value = response.total
        loading.value = false
      })
    }
  } else if (activeTab.value == 'second') {
    listTrackpart(queryParams.value).then((response) => {
      trackPartList.value = response.rows
      total.value = response.total
      loading.value = false
    })
  } else if (activeTab.value == 'third') {
    listSplpart(queryParams.value).then((response) => {
      splPartList.value = response.rows
      total.value = response.total
      loading.value = false
    })
  } else if (activeTab.value == 'fourth') {
    listCrastopmodelpart(queryParams.value).then((response) => {
      crastopmodelPartList.value = response.rows
      total.value = response.total
      loading.value = false
    })
  } else if (activeTab.value == 'five') {
    listPaintpart(queryParams.value).then((response) => {
      paintPartList.value = response.rows
      total.value = response.total
      loading.value = false
    })
  }
}
function handleClick(tab) {
  activeTab.value = tab.props.name
  if (activeTab.value == 'first') {
    orbitModel.value = false
    slipLine.value = false
    orbit.value = false
    paint.value = false
    crane.value = true
  } else if (activeTab.value == 'second') {
    orbitModel.value = true
    slipLine.value = false
    orbit.value = false
    paint.value = false
    crane.value = false
  } else if (activeTab.value == 'third') {
    orbitModel.value = false
    slipLine.value = true
    orbit.value = false
    paint.value = false
    crane.value = false
  } else if (activeTab.value == 'fourth') {
    orbitModel.value = false
    slipLine.value = false
    orbit.value = true
    paint.value = false
    crane.value = false
  } else if (activeTab.value == 'five') {
    orbitModel.value = false
    slipLine.value = false
    orbit.value = false
    paint.value = true
    crane.value = false
  }
  getList()
}
// 取消按钮
function cancel() {
  opentable.value = true
  showList.value = false
  reset()
}
// 表单重置
function reset() {
  form.value = {}
  proxy.resetForm('saveFormRef')
}

/** 提交按钮 */
function submitForm() {
  if (form.value.partType === '3' && form.value.craneType === '1') {
    activeTab.value = 'first'
  } else if (form.value.partType === '1' && form.value.craneType === undefined) {
    activeTab.value = 'second'
  } else if (form.value.partType === '2' && form.value.craneType === undefined) {
    activeTab.value = 'third'
  } else if (form.value.partType === '3' && form.value.craneType === undefined) {
    activeTab.value = 'fourth'
  } else if (form.value.partType === '4' && form.value.craneType === undefined) {
    activeTab.value = 'five'
  }
  proxy.$refs['saveFormRef'].$refs['saveFormRef'].validate((valid) => {
    if (valid) {
      //产品部件
      if (activeTab.value === 'first') {
        if (form.value.productPartId != null) {
          updateProductpart(form.value).then((response) => {
            proxy.$modal.msgSuccess('修改成功')
            showList.value = false
            opentable.value = true
            getList()
          })
        } else {
          listProduct().then((res) => {
            productsub.value = res.rows
            const item = res.rows.find(
              (e) =>
                e.craneModel == form.value.craneModel &&
                e.craneType == form.value.craneType &&
                e.workLevel == form.value.workLevel &&
                e.craneOperation == form.value.craneOperation &&
                e.liftHeight == form.value.liftHeight,
            )
            if (item) {
              form.value.productId = item.productId
              addProductpart(form.value).then((response) => {
                proxy.$modal.msgSuccess('新增成功')
                showList.value = false
                opentable.value = true
                getList()
              })
            } else {
              proxy.$modal.msgError('新增失败，没有此产品')
            }
          })
        }
      }

      //轨道
      if (activeTab.value === 'second') {
        if (form.value.trackPartId != null) {
          updateTrackpart(form.value).then((response) => {
            proxy.$modal.msgSuccess('修改成功')
            showList.value = false
            opentable.value = true
            getList()
          })
        } else {
          addTrackpart(form.value).then((response) => {
            proxy.$modal.msgSuccess('新增成功')
            showList.value = false
            opentable.value = true
            getList()
          })
        }
      }
      //滑线
      if (activeTab.value === 'third') {
        if (form.value.splPartId != null) {
          updateSplpart(form.value).then((response) => {
            proxy.$modal.msgSuccess('修改成功')
            showList.value = false
            opentable.value = true
            getList()
          })
        } else {
          addSplpart(form.value).then((response) => {
            proxy.$modal.msgSuccess('新增成功')
            showList.value = false
            opentable.value = true
            getList()
          })
        }
      }
      //大车
      if (activeTab.value === 'fourth') {
        if (form.value.cartPartId != null) {
          updateCrastopmodelpart(form.value).then((response) => {
            proxy.$modal.msgSuccess('修改成功')
            showList.value = false
            opentable.value = true
            getList()
          })
        } else {
          addCrastopmodelpart(form.value).then((response) => {
            proxy.$modal.msgSuccess('新增成功')
            showList.value = false
            opentable.value = true
            getList()
          })
        }
      }
      //油漆
      if (activeTab.value === 'five') {
        if (form.value.paintPartId != null) {
          updatePaintpart(form.value).then((response) => {
            proxy.$modal.msgSuccess('修改成功')
            showList.value = false
            opentable.value = true
            getList()
          })
        } else {
          addPaintpart(form.value).then((response) => {
            proxy.$modal.msgSuccess('新增成功')
            showList.value = false
            opentable.value = true
            getList()
          })
        }
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
  opentable.value = false
  showList.value = true
  disabled.value = false
  if (activeTab.value == 'first') {
    saveTitle.value = '新增产品部件'
    saveType.value = 'product'
  } else if (activeTab.value == 'second') {
    saveTitle.value = '新增轨道'
    saveType.value = 'install'
    form.value = { partType: '1' }
  } else if (activeTab.value == 'third') {
    saveTitle.value = '新增滑线'
    saveType.value = 'install'
    form.value = { partType: '2' }
  } else if (activeTab.value == 'fourth') {
    saveTitle.value = '新增大车止档型号'
    saveType.value = 'install'
    form.value = { partType: '3' }
  } else if (activeTab.value == 'five') {
    saveTitle.value = '新增油漆'
    saveType.value = 'install'
    form.value = { partType: '4' }
  } 
  if (form.value.partType === '3' && form.value.craneType === '1') {
    activeTab.value = 'first'
  } else if (form.value.partType === '1' && form.value.craneType === undefined) {
    activeTab.value = 'second'
  } else if (form.value.partType === '2' && form.value.craneType === undefined) {
    activeTab.value = 'third'
  } else if (form.value.partType === '3' && form.value.craneType === undefined) {
    activeTab.value = 'fourth'
  } else if (form.value.partType === '4' && form.value.craneType === undefined) {
    activeTab.value = 'five'
  } 
}
/** 修改按钮操作 */
function handleUpdate(row) {
  opentable.value = false
  showList.value = true
  disabled.value = true
  if (activeTab.value == 'first') {
    const productPartId = row.productPartId || ids.value
    getProductpart(productPartId).then((response) => {
      form.value = response.data
      saveTitle.value = '修改产品部件'
    })
    saveTitle.value = '新增产品部件'
    saveType.value = 'product'
  } else if (activeTab.value == 'second') {
    const trackPartId = row.trackPartId || ids.value
    getTrackpart(trackPartId).then((response) => {
      form.value = response.data
      saveTitle.value = '修改轨道'
    })
  } else if (activeTab.value == 'third') {
    const splPartId = row.splPartId || ids.value
    getSplpart(splPartId).then((response) => {
      form.value = response.data
      saveTitle.value = '修改滑道'
    })
    saveTitle.value = '新增滑线'
    saveType.value = 'install'
  } else if (activeTab.value == 'fourth') {
    const cartPartId = row.cartPartId || ids.value
    getCrastopmodelpart(cartPartId).then((response) => {
      form.value = response.data
      saveTitle.value = '修改大车止档型号'
    })
    saveTitle.value = '新增大车止档型号'
    saveType.value = 'install'
  } else if (activeTab.value == 'five') {
    const paintPartId = row.paintPartId || ids.value
    getPaintpart(paintPartId).then((response) => {
      form.value = response.data
      saveTitle.value = '修改油漆'
    })
    saveTitle.value = '新增油漆'
    saveType.value = 'install'
  }
}

/** 删除按钮操作 */
function handleDelete(row) {
  //产品部件删除
  if (activeTab.value == 'first') {
    const productPartId = row.productPartId || ids.value
    proxy.$modal
      .confirm('是否确认删除此数据项？')
      .then(function () {
        return delProductpart(productPartId)
      })
      .then(() => {
        getList()
        proxy.$modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }
  //轨道删除
  if (activeTab.value == 'second') {
    const trackPartId = row.trackPartId || ids.value
    proxy.$modal
      .confirm('是否确认删除此数据项？')
      .then(function () {
        return delTrackpart(trackPartId)
      })
      .then(() => {
        getList()
        proxy.$modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }
  //滑线删除
  if (activeTab.value == 'third') {
    const splPartId = row.splPartId || ids.value
    proxy.$modal
      .confirm('是否确认删除此数据项？')
      .then(function () {
        return delSplpart(splPartId)
      })
      .then(() => {
        getList()
        proxy.$modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }
  //大车删除
  if (activeTab.value == 'fourth') {
    const cartPartId = row.cartPartId || ids.value
    proxy.$modal
      .confirm('是否确认删除此数据项？')
      .then(function () {
        return delCrastopmodelpart(cartPartId)
      })
      .then(() => {
        getList()
        proxy.$modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }
  //油漆删除
  if (activeTab.value == 'five') {
    const paintPartId = row.paintPartId || ids.value
    proxy.$modal
      .confirm('是否确认删除此数据项？')
      .then(function () {
        return delPaintpart(paintPartId)
      })
      .then(() => {
        getList()
        proxy.$modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }
}
/** 导出按钮操作 */
function handleExport() {
  this.download(
    'business/product/export',
    {
      ...queryParams.vallue,
    },
    `product_${new Date().getTime()}.xlsx`,
  )
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
  url: import.meta.env.VITE_APP_BASE_API + '/business/productParts/importData',
})

/** 导入按钮操作 */
function handleImport() {
  if (activeTab.value === 'first') {
    upload.title = '产品部件'
    upload.url =
      import.meta.env.VITE_APP_BASE_API + '/business/productpart/importData'
  } else if (activeTab.value === 'second') {
    upload.title = '轨道导入'
    upload.url =
      import.meta.env.VITE_APP_BASE_API + '/business/trackpart/importData'
  } else if (activeTab.value === 'third') {
    upload.title = '滑线导入'
    upload.url =
      import.meta.env.VITE_APP_BASE_API + '/business/splpart/importData'
  } else if (activeTab.value === 'fourth') {
    upload.title = '大车导入'
    upload.url =
      import.meta.env.VITE_APP_BASE_API +
      '/business/crastopmodelpart/importData'
  } else if (activeTab.value === 'five') {
    upload.title = '油漆导入'
    upload.url =
      import.meta.env.VITE_APP_BASE_API + '/business/paintpart/importData'
  }
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
</style>
