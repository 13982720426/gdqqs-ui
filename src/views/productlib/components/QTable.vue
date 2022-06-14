<template>
    <el-table v-loading="loading" :data="data" @selection-change="selectionChange">
        <el-table-column v-for="item in columns" :key="item.id" :label="item.label" :prop="item.prop"
            :align="item.align">
            <template #default="{ row }">
            <!-- {{row}} -->
                <span>{{ item.format ? item.format(row) : row[item.prop] }}</span>
            </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
            <template #default="{ row }">
                <slot :row="row"></slot>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup name="QTable">
const emit = defineEmits();
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
        default: false
    },
});

// 返回选择的每一项
function selectionChange(selection) {
    emit("handleSelectionChange", selection);
}

</script>