<!-- 暂时没用 -->
<template>
  <el-table
    :data="dataSource"
    style="width: 100%"
  >
    <el-table-column prop="offerName" label="报价单名称"/>
    <el-table-column prop="offerCode" label="编号" width="180" />
    <el-table-column prop="createTime" label="报价时间" width="160" />
    <el-table-column prop="customerName" label="客户信息" width="180" />
    <el-table-column prop="contractPrice" label="合同价格" width="180" />
    <el-table-column prop="profit" label="利润" width="180" />
    <el-table-column prop="createUserName" label="创建人" width="180" />
    <el-table-column prop="name" label="操作" width="300" fixed="right">
      <template #default>
        <el-button>详情查看</el-button>
        <el-button>编辑</el-button>
        <el-button>导出</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup name="BaseTable">
import {onMounted, ref} from 'vue'
import { queryList } from '@/api/offer'

const props = defineProps({
  type: {
    type: String,
    default: 'All'
  }
})

const dataSource = ref([])

const queryData = async (name) => {
  const params = {}
  if (name) {
    params.offerName = name
  }
  const resp = await queryList(params)
  if (resp.code === 200) {
    dataSource.value = resp.rows
  }
}

onMounted(() => {
  queryData()
})

</script>

<style scoped>

</style>