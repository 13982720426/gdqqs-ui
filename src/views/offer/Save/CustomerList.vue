<template>
  <div class="customer-list">
    <el-radio-group v-model="checked" @change="radioChange">
      <div :key="item.key" v-for="item in $props.dataSource" class="list-item">
        <div class="item-radio">
          <el-radio :label="item.customerId" :value="item.customerId">
            {{ ' ' }}
          </el-radio>
        </div>
        <div class="item-body">
          <el-descriptions :column="3" size="small">
            <el-descriptions-item label="客户名称">
              {{ item.customerName }}
            </el-descriptions-item>
            <el-descriptions-item label="部门">
              {{ item.partment }}
            </el-descriptions-item>
            <el-descriptions-item label="客户性质">
              {{ item.customerNature === '1' ? '经销商' : '最终用户' }}
            </el-descriptions-item>

            <el-descriptions-item label="联系人">
              {{ item.contact }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ item.contactTell }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">
              {{ item.contactEmail }}
            </el-descriptions-item>
            <el-descriptions-item label="地址">
              {{ item.contactAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="邮政编码">
              {{ item.postCode }}
            </el-descriptions-item>
            <el-descriptions-item label="备注">
              {{ item.remark }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-radio-group>
  </div>
</template>

<script setup name="CustomerList">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  dataSource: {
    type: Array,
    default: () => [],
  },
  checked: {
    type: String,
    default: '',
  },
})

const checked = ref()
checked.value = props.checked

const emits = defineEmits(['select'])

const radioChange = (value) => {
  const item = props.dataSource.find((item) => item.customerId === value)
  checked.value = value
  emits('select', { id: value, node: item })
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
    background-color: #fafafa;
    margin-bottom: 12px;
    padding: 12px;

    .item-radio {
      flex: 0 0 30px;
    }

    .item-body {
      flex: 1 1 auto;

      :deep(.el-descriptions__body) {
        background-color: #fafafa !important;
      }
    }
  }
}
</style>
