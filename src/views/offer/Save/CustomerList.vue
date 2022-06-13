<template>
  <div class="customer-list">
    <el-radio-group v-model="checked" @change="radioChange">
        <div v-for="item in props.dataSource" class="list-item">
          <div class="item-radio">
            <el-radio :label="item.customerId">{{" "}}</el-radio>
          </div>
          <div class="item-body">
            <el-descriptions :column="3" size="small">
              <el-descriptions-item label="客户名称">{{ item.customerName }}</el-descriptions-item>
              <el-descriptions-item label="部门">{{ item.partment }}</el-descriptions-item>
              <el-descriptions-item label="客户性质">{{ item.customerNature }}</el-descriptions-item>
              <el-descriptions-item label="联系人">{{ item.contact }}</el-descriptions-item>
              <el-descriptions-item label="联系电话">{{ item.contactTell }}</el-descriptions-item>
              <el-descriptions-item label="邮箱">{{ item.contactEmail }}</el-descriptions-item>
              <el-descriptions-item label="地址">{{ item.contactAddress }}</el-descriptions-item>
              <el-descriptions-item label="邮政编码">{{ item.postCode }}</el-descriptions-item>
              <el-descriptions-item label="备注">{{ item.remark }}</el-descriptions-item>
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
  const item = props.dataSource.find(item => item.customerId === value)
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