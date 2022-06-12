<template>
  <el-table
    :data="dataSource"
    style="width: 100%"
  >
    <el-table-column prop="name" label="报价单名称" width="180" />
    <el-table-column prop="name" label="数量" width="180" />
    <el-table-column prop="name" label="编号" width="180" />
    <el-table-column prop="name" label="报价时间" width="180" />
    <el-table-column prop="name" label="客户信息" width="180" />
    <el-table-column prop="name" label="合同价格" width="180" />
    <el-table-column prop="name" label="利润" width="180" />
    <el-table-column prop="name" label="状态" width="180" />
    <el-table-column prop="name" label="创建人" width="180" />
    <el-table-column prop="name" label="操作" width="200" fixed="right">
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

const props = defineProps({
  type: {
    type: String,
    default: 'All'
  }
})

const dataSource = ref([])

const queryData = (type) => {

}

onMounted(() => {
  queryData(props.type)
})

</script>

<style scoped>

</style>