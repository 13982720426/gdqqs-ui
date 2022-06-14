<template>
  <el-table v-loading="loading" :data="data" @selection-change="selectionChange">
    <el-table-column
      v-for="item in columns"
      :key="item.id"
      :label="item.label"
      :prop="item.prop"
      :align="item.align"
    >
      <template #default="{ row }">
        <!-- {{ row }} -->
        <span>
          {{ item.format ? item.format(row) : deepFormat(row, item.prop) }}
        </span>
      </template>
    </el-table-column>

    <el-table-column
      label="操作"
      align="center"
      class-name="small-padding fixed-width"
      fixed="right"
      width="200"
    >
      <template #default="{ row }">
        <slot :row="row"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup name="QTable">
const emit = defineEmits()
const props = defineProps({
  // 表格数据
  data: {
    type: Array,
    default: () => [],
  },
  // 列标题
  columns: {
    type: Array,
    default: () => [],
  },
  // 加载中标志
  loading: {
    type: Boolean,
    default: false,
  },
})

// 返回选择的每一项
function selectionChange(selection) {
  emit('handleSelectionChange', selection)
}

function deepFormat(row, key) {
  if (!row || !key) return ''
  if (key.indexOf('.') === -1) return row[key]
  const keys = key.split('.')
  let data = ''
  const r = row[keys[0]]
  if (!r) return ''
  keys?.forEach((e, i) => {
    if (i === 0) data = row[e]
    else {
      if (!data[e]) return data
      data = data[e]
    }
  })
  return data
}
</script>
