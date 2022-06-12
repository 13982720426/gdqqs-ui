<template>
  <div class="customer-list">
    <el-radio-group v-model="checked" @change="radioChange">
        <div v-for="item in props.dataSource" class="list-item">
          <div class="item-radio">
            <el-radio :label="item.id">{{" "}}</el-radio>
          </div>
          <div class="item-body">
            <el-descriptions :column="3" size="small">
              <el-descriptions-item label="客户名称">xxxxx</el-descriptions-item>
              <el-descriptions-item label="部门">kooriookami</el-descriptions-item>
              <el-descriptions-item label="客户性质">kooriookami</el-descriptions-item>
              <el-descriptions-item label="联系人">kooriookami</el-descriptions-item>
              <el-descriptions-item label="联系电话">kooriookami</el-descriptions-item>
              <el-descriptions-item label="邮箱">kooriookami</el-descriptions-item>
              <el-descriptions-item label="地址">kooriookami</el-descriptions-item>
              <el-descriptions-item label="邮政编码">kooriookami</el-descriptions-item>
              <el-descriptions-item label="备注">kooriookami</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
    </el-radio-group>
  </div>
</template>

<script setup name="CustomerList">
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
  dataSource: {
    type: Array,
    default: () => []
  },
  checked: {
    type: [String, undefined],
    default: undefined
  }
})

const checked = ref('')

const emits = defineEmits()

const radioChange = (value) => {
  const item = props.dataSource.find(item => item.id === value)
  checked.value = value
  emits('change', { id: value, node: item })
}


</script>

<style lang="scss" scoped>
.customer-list {
  width: 100%;
  overflow-y: auto;
  max-height: 300px;

  > div {
    flex-direction: column;
    width: 100%;
  }

  .list-item {
    width: 100%;
    display: flex;
    background-color: #FAFAFA;
    margin-bottom: 12px;
    padding: 12px;

    .item-radio {
      flex: 0 0 30px;
    }

    .item-body {
      flex: 1 1 auto;

      :deep(.el-descriptions__body) {
        background-color: #FAFAFA !important;
      }
    }
  }
}
</style>