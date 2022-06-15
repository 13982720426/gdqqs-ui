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
          <el-button
              plain
              icon="Plus"
              v-hasPermi="['offer:import']"
          >
            导入
          </el-button>
        </el-space>
      </div>
      <div>
        <el-space>
          <el-input v-model="searchText" style="width: 200px;" placeholder="请输入报价单名称"/>
          <el-button type="primary" @click="queryData(searchText)">查询</el-button>
          <el-button @click="onReset()">重置</el-button>
        </el-space>
      </div>
    </div>
    <el-table
        :data="dataSource"
        style="width: 100%"
    >
      <el-table-column prop="offerName" label="报价单名称"/>
      <el-table-column prop="offerCode" label="编号" width="180"/>
      <el-table-column prop="createTime" label="报价时间" width="160"/>
      <el-table-column prop="customerName" label="客户信息" width="180"/>
      <el-table-column prop="contractPrice" label="合同价格" width="180"/>
      <el-table-column prop="profit" label="利润" width="180"/>
      <el-table-column prop="createUserName" label="创建人" width="180"/>
      <el-table-column prop="name" label="操作" width="300" fixed="right">
        <template #default="{row}">
          <el-button @click="view(row.offerId)">详情查看</el-button>
          <el-button @click="edit(row.offerId)">编辑</el-button>
          <el-button>导出</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup name="offer">
import BaseTable from './BaseTable'
import {queryList} from '@/api/offer'
import {ref, onMounted} from 'vue'
import {useRouter} from "vue-router";
import {delOffer} from "../../api/business/offer";
import useOfferStore from '@/store/modules/offer'

const offerStore = useOfferStore()

const router = useRouter();
const activeName = ref('All')
const searchText = ref(undefined)
const dataSource = ref([])

const queryData = async (name) => {
  const params = {}
  console.log(name)
  if (name) {
    params.offerName = name
  }
  const resp = await queryList(params)
  if (resp.code === 200) {
    dataSource.value = resp.rows
  }
}

const jumpAdd = () => {
  offerStore.init()
  router.push('/offer/save');
}

const edit = (id) => {
  router.push({
    path: `/offer/save`,
    query: {
      id,
      type: 'edit'
    }
  });
}

const view = (id) => {
  router.push({
    path: `/offer/save`,
    query: {
      id,
      type: 'view'
    }
  });
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