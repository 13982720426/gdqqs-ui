<template>
    <div class="app-container">
        <el-row>
            <el-col :span="12">
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="Plus" size="mini" @click="handleAdd"
                            v-hasPermi="['business:product:add']">新增</el-button>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                    label-width="68px">
                    <el-form-item prop="craneOperation">
                        <el-input v-model="queryParams.craneOperation" placeholder="模糊搜索" clearable
                            @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="Search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="Refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="产品ID" align="center" prop="productId" />
            <el-table-column label="起重机类型" align="center" prop="craneType" />
            <el-table-column label="操作方式" align="center" prop="craneOperation" />
            <el-table-column label="遥控器" align="center" prop="control" />
            <el-table-column label="起重机型号" align="center" prop="craneModel" />
            <el-table-column label="跨度" align="center" prop="span" />
            <el-table-column label="起升高度" align="center" prop="liftHeight" />
            <el-table-column label="工作级别" align="center" prop="workLevel" />
            <el-table-column label="额定功率KW" align="center" prop="ratedPower" />
            <el-table-column label="起升速度" align="center" prop="liftSpeed" />
            <el-table-column label="小车运行速度" align="center" prop="crabSpeed" />
            <el-table-column label="大车运行速度" align="center" prop="cartSpeed" />
            <el-table-column label="最大轮压" align="center" prop="pressureMax" />
            <el-table-column label="上传设计总图" align="center" prop="uploadChart" />
            <el-table-column label="上传起重机数据" align="center" prop="uploadCrane" />
            <el-table-column label="上传起重机轮压数据" align="center" prop="uploadPressure" />
            <el-table-column label="上传工厂价BOM清单" align="center" prop="uploadPrice" />
            <el-table-column label="创建用户ID" align="center" prop="createUserId" />
            <el-table-column label="修改用户ID" align="center" prop="modifyUserId" />
            <el-table-column label="修改时间" align="center" prop="modifyTime" width="180">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.modifyTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark" />
            <el-table-column label="参数信息" align="center" prop="params" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['business:product:edit']">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                        v-hasPermi="['business:product:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script setup name="Product">
import { listProduct, getProduct, delProduct, addProduct, updateProduct } from "@/api/business/product";

const { proxy } = getCurrentInstance();
const router = useRouter();

const productList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 10,
    }
});

const { queryParams } = toRefs(data);

/** 查询产品列表 */
function getList() {
    loading.value = true;
    listProduct(queryParams.vallue).then(response => {
        productList.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
}
/** 重置按钮操作 */
function resetQuery() {
    proxy.resetForm("queryForm");
    handleQuery();
}
// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.productId)
    single.value = selection.length !== 1
    multiple.value = !selection.length
}
/** 新增按钮操作 */
function handleAdd() {
    router.push("/product/save/index")
}
/** 修改按钮操作 */
function handleUpdate(row) {
    const productId = row.productId || ids.value
    router.push({ path: "/product/save/index", params: { productId } })
}

/** 删除按钮操作 */
function handleDelete(row) {
    const productIds = row.productId || ids.value;
    proxy.$modal.confirm('是否确认删除产品编号为"' + productIds + '"的数据项？').then(function () {
        return delProduct(productIds);
    }).then(() => {
        getList();
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
    this.download('business/product/export', {
        ...queryParams.vallue
    }, `product_${new Date().getTime()}.xlsx`)
}

getList();
</script>
