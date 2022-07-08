<template>
  <div class="app-container offer-warp">
    <div class="header">
      <div>
        <el-space>
          <el-button
            color="#ffdac6"
            class="sel"
            type="primary"
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['system:dict:add']"
          >
            新增
          </el-button>
          <!-- <el-button
            type="primary"
            icon="Download"
            size="mini"
            @click="handleImport"
            color="#ffdac6"
            class="sel"
            v-hasPermi="['system:dict:import']"
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
            v-hasPermi="['system:dict:export']"
          >
            导出
          </el-button> -->
        </el-space>
      </div>
      <div>
        <el-space>
          <el-form
            :model="queryParams"
            ref="queryRef"
            :inline="true"
            v-show="showSearch"
            label-width="68px"
          >
            <el-form-item prop="dictLabel">
              <el-input
                v-model="queryParams.dictLabel"
                placeholder="请输入物料编码"
                clearable
                @keyup.enter="handleQuery"
              />
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
        </el-space>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="dataList"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column
        v-if="false"
        label="主键"
        align="center"
        prop="dictCode"
      />
      <el-table-column label="物料编码" align="center" prop="dictLabel" />
      <el-table-column label="价格" align="center" prop="dictValue" />

      <el-table-column label="创建时间" align="center" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="dataRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item style="width: 80%" label="物料编码" prop="dictLabel">
          <el-input v-model="form.dictLabel" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item style="width: 80%" label="价格" prop="dictValue">
          <el-input
            v-model="form.dictValue"
            placeholder="请输入价格"
            type="number"
            min="0"
            max="99999"
            oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Data">
import {
  optionselect as getDictOptionselect,
  getType,
} from '@/api/system/dict/type'
import {
  listData,
  getData,
  delData,
  addData,
  updateData,
} from '@/api/system/dict/data'

const { proxy } = getCurrentInstance()
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

const dataList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')
const defaultDictType = ref('sys_part_code')
const typeOptions = ref([])
const route = useRoute()

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    dictName: undefined,
    dictType: defaultDictType,
  },
  rules: {
    dictValue: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
    dictLabel: [
      { required: true, message: '物料编码不能为空', trigger: 'blur' },
    ],
  },
})

const { queryParams, form, rules } = toRefs(data)

/** 查询物料编码列表 */
function getList() {
  loading.value = true
  listData(queryParams.value).then((response) => {
    dataList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}
/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}
/** 表单重置 */
function reset() {
  form.value = {
    dictCode: undefined,
    dictLabel: undefined,
    dictType: undefined,
    cssClass: undefined,
    listClass: 'default',
    dictSort: 0,
    status: '0',
    remark: undefined,
  }
  proxy.resetForm('dataRef')
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}
/** 返回按钮操作 */
function handleClose() {
  const obj = { path: '/system/dict' }
  proxy.$tab.closeOpenPage(obj)
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef')
  queryParams.value.dictType = defaultDictType
  handleQuery()
}
/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加物料编码'
  form.value.dictType = queryParams.value.dictType
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.dictCode)
  single.value = selection.length != 1
  multiple.value = !selection.length
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const dictCode = row.dictCode || ids.value
  getData(dictCode).then((response) => {
    form.value = response.data
    open.value = true
    title.value = '修改物料编码'
  })
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs['dataRef'].validate((valid) => {
    if (valid) {
      if (form.value.dictCode != undefined) {
        updateData(form.value).then((response) => {
          if (response.code === 200) proxy.$modal.msgSuccess('修改成功')
          else proxy.$modal.msgError('修改失败')
        })
      } else {
        addData(form.value).then((response) => {
          if (response.code === 200) proxy.$modal.msgSuccess('添加成功')
          else proxy.$modal.msgError('添加失败')
        })
      }
      open.value = false
      getList()
    }
  })
}
/** 删除按钮操作 */
function handleDelete(row) {
  const dictCodes = row.dictCode || ids.value
  proxy.$modal
    .confirm('是否确认删除物料编码为"' + row.dictLabel + '"的数据项？')
    .then(function () {
      return delData(dictCodes)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}
// /** 导出按钮操作 */
// function handleExport() {
//   proxy.download(
//     'system/dict/data/export',
//     {
//       ...queryParams.value,
//     },
//     `dict_data_${new Date().getTime()}.xlsx`,
//   )
// }

getList()
</script>
<style lang="scss" scoped>
.offer-warp {
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
  }
}
.sel {
  color: #ff5800;
}
</style>
