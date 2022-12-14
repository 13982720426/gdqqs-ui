<template>
  <div class="app-container offer-warp">
    <div class="header">
      <div>
        <el-space>
          <el-button
            type="primary"
            icon="Plus"
            v-hasPermi="['offer:add']"
            @click="jumpAdd"
          >
            新增
          </el-button>
        </el-space>
      </div>
      <div>
        <el-space>
          <el-input
            v-model="searchText"
            style="width: 200px"
            placeholder="请输入报价单名称"
          />
          <el-button type="primary" @click="queryData(searchText)">
            查询
          </el-button>
          <el-button @click="onReset()">重置</el-button>
        </el-space>
      </div>
    </div>
    <el-table
      :data="dataSource"
      :default-sort="{ prop: 'createTime', order: 'descending' }"
      style="width: 100%"
    >
      <el-table-column prop="offerName" label="报价单名称" min-width="150" />
      <el-table-column prop="offerCode" label="编号" min-width="200" />
      <el-table-column
        prop="createTime"
        label="报价时间"
        sortable
        min-width="200"
      />
      <el-table-column prop="customerName" label="客户信息" min-width="200">
        <template #default="{ row }">
          {{ row.customerName }}{{ ' ' }}{{ row.contactTell }}
        </template>
      </el-table-column>
      <el-table-column prop="contractPrice" label="合同价格" min-width="130" />
      <el-table-column prop="profit" label="利润" min-width="130" />
      <el-table-column prop="createUserName" label="创建人" min-width="130" />
      <el-table-column prop="name" label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button @click="view(row.offerId)">详情查看</el-button>
          <el-button @click="edit(row.offerId)">编辑</el-button>
          <!-- <el-button @click="exportData(row.offerId)">导出</el-button> -->
          <el-popconfirm
            confirm-button-text="WORD"
            cancel-button-text="PDF"
            title="请选择导出方式"
            @confirm="confirmEvent(row.offerId)"
            @cancel="cancelEvent(row.offerId)"
          >
            <template #reference>
              <el-button>导出</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="params.pageNum"
      v-model:limit="params.pageSize"
      @pagination="queryData()"
    />
  </div>
</template>

<script setup name="offer">
import BaseTable from './BaseTable'
import { queryList } from '@/api/offer'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { delOffer } from '../../api/business/offer'
import useOfferStore from '@/store/modules/offer'


const { proxy } = getCurrentInstance()

const offerStore = useOfferStore()

const router = useRouter()
const activeName = ref('All')
const searchText = ref(undefined)
const dataSource = ref([])

const total = ref(0)
const params = reactive({
  pageNum: 1,
  pageSize: 10,
})

const queryData = async (name) => {
  if (name) {
    params.offerName = name
  } else {
    params.offerName = undefined
  }
  const resp = await queryList(params)
  if (resp.code === 200) {
    total.value = resp.total
    dataSource.value = resp.rows
  }
}

const jumpAdd = () => {
  offerStore.init()
  router.push('/offer/save')
}

const edit = (id) => {
  router.push({
    path: `/offer/save`,
    query: {
      id,
      type: 'edit',
    },
  })
}

const view = (id) => {
  router.push({
    path: `/offer/save`,
    query: {
      id,
      type: 'view',
    },
  })
}

const confirmEvent = (id) => {
  proxy.download(
    'business/offer/exportWord',
    { offerId:id },
    `offer_${new Date().getTime()}.docx`,
  )
}
const cancelEvent = (id) => {
  proxy.download(
    'business/offer/exportPdf',
    { offerId:id },
    `offer_${new Date().getTime()}.pdf`,
  )
}

const onReset = () => {
  searchText.value = undefined
  queryData()
}

const deleteOffer = async (id) => {
  const resp = await delOffer(id)
  if (resp.code) {
    queryData()
  }
}

onMounted(() => {
  queryData()
  offerStore.init()
})
</script>

<style lang="scss" scoped>
.offer-warp {
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
  }
}
</style>
