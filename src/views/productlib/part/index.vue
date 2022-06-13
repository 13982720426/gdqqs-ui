<template>
    <div class="app-container" v-show="showList">
        <div class="search-tool">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus" size="mini" @click="handleAdd"
                        v-hasPermi="['business:product:add']">新增</el-button>
                </el-col>
            </el-row>
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
                <el-form-item prop="craneOperation">
                    <el-input v-model="queryParams.craneOperation" placeholder="模糊搜索" clearable
                        @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                    <el-button icon="Refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-tabs v-model="activeTab" class="demo-tabs">
            <el-tab-pane label="轨道" name="first">
                <QTable :loading="loading" :data="trackPartList" :columns="trackPartColumns"
                    @selectionChange="handleSelectionChange">
                    <template #default="{ row }">
                        <el-button size="mini" type="text" icon="Edit" @click="handleUpdate(row)"
                            v-hasPermi="['business:product:edit']">修改</el-button>
                        <el-button size="mini" type="text" icon="Delete" @click="handleDelete(row)"
                            v-hasPermi="['business:product:remove']">删除</el-button>
                    </template>
                </QTable>
            </el-tab-pane>
            <el-tab-pane label="滑线" name="second">
                <QTable :loading="loading" :data="splPartList" :columns="splPartColumns"
                    @selectionChange="handleSelectionChange">
                    <template #default="{ row }">
                        <el-button size="mini" type="text" icon="Edit" @click="handleUpdate(row)"
                            v-hasPermi="['business:product:edit']">修改</el-button>
                        <el-button size="mini" type="text" icon="Delete" @click="handleDelete(row)"
                            v-hasPermi="['business:product:remove']">删除</el-button>
                    </template>
                </QTable>
            </el-tab-pane>
            <el-tab-pane label="大车止档型号" name="third">
                <QTable :loading="loading" :data="crastopmodelPartList" :columns="crastopmodelPartColumns"
                    @selectionChange="handleSelectionChange">
                    <template #default="{ row }">
                        <el-button size="mini" type="text" icon="Edit" @click="handleUpdate(row)"
                            v-hasPermi="['business:product:edit']">修改</el-button>
                        <el-button size="mini" type="text" icon="Delete" @click="handleDelete(row)"
                            v-hasPermi="['business:product:remove']">删除</el-button>
                    </template>
                </QTable>
            </el-tab-pane>
            <el-tab-pane label="油漆" name="fourth"></el-tab-pane>
            <el-tab-pane label="产品部件" name="six"></el-tab-pane>
        </el-tabs>

        <!-- <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="起重机类型" align="center" prop="craneType">
                <template #default="{ row }">
                    <span>{{ craneTypeFormat(row) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作方式" align="center" prop="craneOperation">
                <template #default="{ row }">
                    <span>{{ craneOperationFormat(row) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="起重机型号" align="center" prop="craneModel">
                <template #default="{ row }">
                    <span>{{ craneModelFormat(row) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="跨度" align="center" prop="span">
                <template #default="{ row }">
                    <span>{{ spanFormat(row) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="起升高度" align="center" prop="liftHeight">
                <template #default="{ row }">
                    <span>{{ liftHeightFormat(row) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="工作级别" align="center" prop="workLevel">
                <template #default="{ row }">
                    <span>{{ workLevelFormat(row) }}</span>
                </template>
            </el-table-column>
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
            v-model:limit="queryParams.pageSize" @pagination="getList" /> -->
    </div>
    <SaveTitle :title="saveTitle" v-show="!showList">
        <el-form ref="saveFormRef" :model="form" :rules="rules" label-width="150px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="起重机类型" prop="craneType">
                        <el-select v-model="form.craneType" placeholder="请选择" clearable>
                            <el-option v-for="dict in q_crane_type" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="操作方式" prop="craneOperation">
                        <el-select v-model="form.craneOperation" placeholder="请选择" clearable>
                            <el-option v-for="dict in q_oper_mode" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="遥控器" prop="control">
                        <el-select v-model="form.control" placeholder="请选择" clearable>
                            <el-option v-for="dict in sys_yes_no" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="起重机型号" prop="craneModel">
                        <template v-if="form.craneType == 1">
                            <el-select v-model="form.craneModel" placeholder="请选择" clearable style="width: 53%">
                                <el-option v-for="dict in q_single_crane_model" :key="dict.value" :label="dict.label"
                                    :value="dict.value" />
                            </el-select>
                        </template>
                        <template v-else-if="form.craneType == 2">
                            <el-select v-model="form.craneModel" placeholder="请选择" clearable style="width: 53%">
                                <el-option v-for="dict in q_double_crane_model" :key="dict.value" :label="dict.label"
                                    :value="dict.value" />
                            </el-select>
                        </template>
                        <template v-else-if="form.craneType == 3">
                            <el-select v-model="form.craneModel" placeholder="请选择" clearable style="width: 53%">
                                <el-option v-for="dict in q_susp_crane_model" :key="dict.value" :label="dict.label"
                                    :value="dict.value" />
                            </el-select>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="跨度" prop="span">
                        <template v-if="form.craneType == 1">
                            <el-select v-model="form.span" placeholder="请选择" clearable style="width: 53%">
                                <el-option v-for="dict in q_single_crane_span" :key="dict.value" :label="dict.label"
                                    :value="dict.value" />
                            </el-select>
                        </template>
                        <template v-else-if="form.craneType == 2">
                            <el-select v-model="form.span" placeholder="请选择" clearable style="width: 53%">
                                <el-option v-for="dict in q_double_crane_span" :key="dict.value" :label="dict.label"
                                    :value="dict.value" />
                            </el-select>
                        </template>
                        <template v-else-if="form.craneType == 3">
                            <el-select v-model="form.span" placeholder="请选择" clearable style="width: 53%">
                                <el-option v-for="dict in q_susp_crane_span" :key="dict.value" :label="dict.label"
                                    :value="dict.value" />
                            </el-select>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="起升高度" prop="liftHeight">
                        <template v-if="form.craneType == 1">
                            <el-select v-model="form.liftHeight" placeholder="请选择" clearable style="width: 53%">
                                <el-option v-for="dict in q_single_crane_lift_height" :key="dict.value"
                                    :label="dict.label" :value="dict.value" />
                            </el-select>
                        </template>
                        <template v-else-if="form.craneType == 2">
                            <el-select v-model="form.liftHeight" placeholder="请选择" clearable style="width: 53%">
                                <el-option v-for="dict in q_double_crane_lift_height" :key="dict.value"
                                    :label="dict.label" :value="dict.value" />
                            </el-select>
                        </template>
                        <template v-else-if="form.craneType == 3">
                            <el-select v-model="form.liftHeight" placeholder="请选择" clearable style="width: 53%">
                                <el-option v-for="dict in q_susp_crane_lift_height" :key="dict.value"
                                    :label="dict.label" :value="dict.value" />
                            </el-select>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="工作级别" prop="workLevel">
                        <template v-if="form.craneType == 1">
                            <el-select v-model="form.workLevel" placeholder="请选择" clearable style="width: 53%">
                                <el-option v-for="dict in q_single_crane_work_level" :key="dict.value"
                                    :label="dict.label" :value="dict.value" />
                            </el-select>
                        </template>
                        <template v-else-if="form.craneType == 2">
                            <el-select v-model="form.workLevel" placeholder="请选择" clearable style="width: 53%">
                                <el-option v-for="dict in q_double_crane_work_level" :key="dict.value"
                                    :label="dict.label" :value="dict.value" />
                            </el-select>
                        </template>
                        <template v-else-if="form.craneType == 3">
                            <el-select v-model="form.workLevel" placeholder="请选择" clearable style="width: 53%">
                                <el-option v-for="dict in q_susp_crane_work_level" :key="dict.value" :label="dict.label"
                                    :value="dict.value" />
                            </el-select>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="额定功率KW" prop="ratedPower">
                        <el-select v-model="form.ratedPower" placeholder="请选择" clearable style="width: 53%">
                            <el-option v-for="dict in q_rated_power" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="起升速度" prop="liftSpeed">
                        <el-select v-model="form.liftSpeed" placeholder="请选择" clearable style="width: 53%">
                            <el-option v-for="dict in q_lift_speed" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="小车运行速度" prop="crabSpeed">
                        <el-select v-model="form.crabSpeed" placeholder="请选择" clearable style="width: 53%">
                            <el-option v-for="dict in q_crab_speed" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="大车运行速度" prop="cartSpeed">
                        <el-select v-model="form.cartSpeed" placeholder="请选择" clearable style="width: 53%">
                            <el-option v-for="dict in q_cart_speed" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="最大轮压" prop="pressureMax">
                        <el-select v-model="form.pressureMax" placeholder="请选择" clearable style="width: 53%">
                            <el-option v-for="dict in q_pressure_max" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="上传设计总图" prop="uploadChart">
                        <file-upload :modelValue="form.uploadChart" :fileType="['.PDF', '.pdf']" btnText="上传文件"
                            btnIcon="Upload" :isShowTip="false" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="上传起重机数据" prop="uploadCrane">
                        <file-upload :modelValue="form.uploadCrane" :fileType="['.DOCX', '.docx']" btnText="上传文件"
                            btnIcon="Upload" :isShowTip="false" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="上传起重机轮压数据" prop="uploadPressure">
                        <file-upload :modelValue="form.uploadPressure" :fileType="['.DOCX', '.docx']" btnText="上传文件"
                            btnIcon="Upload" :isShowTip="false" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="上传工厂价BOM清单" prop="uploadPrice">
                        <file-upload :modelValue="form.uploadPrice" :fileType="['.xls', '.xlsx']" btnText="上传文件"
                            btnIcon="Upload" :isShowTip="false" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="save-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </SaveTitle>
</template>

<script setup name="Part">
import {
    listTrackpart,
    getTrackpart,
    addTrackpart,
    updateTrackpart,
    delTrackpart,
} from "@/api/business/trackpart";
import {
    listSplpart,
    getSplpart,
    addSplpart,
    updateSplpart,
    delSplpart,
} from "@/api/business/splpart";
import {
    listCrastopmodelpart,
    getCrastopmodelpart,
    addCrastopmodelpart,
    updateCrastopmodelpart,
    delCrastopmodelpart,
} from "@/api/business/crastopmodelpart";
import {
    listPaintpart,
    getPaintpart,
    addPaintpart,
    updatePaintpart,
    delPaintpart,
} from "@/api/business/paintpart";
import {
    listProductpart,
    getProductpart,
    addProductpart,
    updateProductpart,
    delProductpart,
} from "@/api/business/productpart";
import SaveTitle from "@/views/offer/components/Title";
import QTable from "../components/QTable.vue";

const { proxy } = getCurrentInstance();
const router = useRouter();

const productList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const showList = ref(true);
const saveTitle = ref("新增产品");
const activeTab = ref("first");
const trackPartList = ref([]);
const trackPartColumns = ref([
    {
        id: 1,
        prop: "partType",
        label: "部件类型",
        align: "center",
        format: () => { },
    },
    {
        id: 2,
        prop: "fixedMode",
        label: "固定方式",
        align: "center",
        format: () => { },
    },
    {
        id: 3,
        prop: "trackModel",
        label: "轨道型号",
        align: "center",
        format: () => { },
    },
    {
        id: 4,
        prop: "sgltrackLength",
        label: "单根长度(米)",
        align: "center",
    },
    {
        id: 5,
        prop: "sgltrackWeight",
        label: "单根重量(公斤/米)",
        align: "center",
    },
    {
        id: 6,
        prop: "trackUnprice",
        label: "轨道单价(元/公斤)",
        align: "center",
    },
    {
        id: 7,
        prop: "tppUnprice",
        label: "压板单价",
        align: "center",
    },
    {
        id: 8,
        prop: "cpUnprice",
        label: "联结板单价",
        align: "center",
    },
    {
        id: 9,
        prop: "thsUnprice",
        label: "吊装台班单价",
        align: "center",
    },
]);
const splPartList = ref([]);
const splPartColumns = ref([{
    id: 1,
    prop: "partType",
    label: "部件类型",
    align: "center",
    format: () => { },
}, {
    id: 2,
    prop: "splLevel",
    label: "滑线级数",
    align: "center",
}, {
    id: 3,
    prop: "electricMax",
    label: "最大电流",
    align: "center",
}, {
    id: 4,
    prop: "trolleyUnprice",
    label: "滑触线单价",
    align: "center",
},
{
    id: 5,
    prop: "collector",
    label: "集电器",
    align: "center",
},
{
    id: 6,
    prop: "installUnprice",
    label: "安装费单价",
    align: "center",
},
{
    id: 7,
    prop: "idlightUnprice",
    label: "指示灯单价",
    align: "center",
},
{
    id: 8,
    prop: "rcableUnprice",
    label: "上升电缆单价",
    align: "center",
}])
const crastopmodelPartList = ref([]);
const crastopmodelPartColumns = ref([{
    id: 1,
    prop: "partType",
    label: "部件类型",
    align: "center",
    format: () => { },
}, {
    id: 2,
    prop: "weight",
    label: "重量",
    align: "center",
}, {
    id: 3,
    prop: "unprice",
    label: "单价",
    align: "center",
}])

const data = reactive({
    queryParams: {
        pageNum: 1,
        pageSize: 10,
    },
    form: {},
    rules: {},
});

const { queryParams, form, rules } = toRefs(data);

const {
    q_crane_type,
    q_oper_mode,
    sys_yes_no,
    q_single_crane_model,
    q_double_crane_model,
    q_susp_crane_model,
    q_single_crane_span,
    q_double_crane_span,
    q_susp_crane_span,
    q_single_crane_lift_height,
    q_double_crane_lift_height,
    q_susp_crane_lift_height,
    q_single_crane_work_level,
    q_double_crane_work_level,
    q_susp_crane_work_level,
    q_rated_power,
    q_lift_speed,
    q_crab_speed,
    q_cart_speed,
    q_pressure_max,
} = proxy.useDict(
    "q_crane_type",
    "q_oper_mode",
    "sys_yes_no",
    "q_single_crane_model",
    "q_double_crane_model",
    "q_susp_crane_model",
    "q_single_crane_span",
    "q_double_crane_span",
    "q_susp_crane_span",
    "q_single_crane_lift_height",
    "q_double_crane_lift_height",
    "q_susp_crane_lift_height",
    "q_single_crane_work_level",
    "q_double_crane_work_level",
    "q_susp_crane_work_level",
    "q_rated_power",
    "q_lift_speed",
    "q_crab_speed",
    "q_cart_speed",
    "q_pressure_max"
);

// 超重机类型翻译
function craneTypeFormat(row, column) {
    return proxy.selectDictLabel(q_crane_type.value, row.craneType);
}
// 操作方式翻译
function craneOperationFormat(row, column) {
    return proxy.selectDictLabel(q_oper_mode.value, row.craneOperation);
}
// 起重机型号翻译
function craneModelFormat(row, column) {
    if (row.craneType == 1) {
        return proxy.selectDictLabel(q_single_crane_model.value, row.craneModel);
    } else if (row.craneType == 2) {
        return proxy.selectDictLabel(q_double_crane_model.value, row.craneModel);
    } else if (row.craneType == 3) {
        return proxy.selectDictLabel(q_susp_crane_model.value, row.craneModel);
    }
}
// 跨度翻译
function spanFormat(row, column) {
    if (row.craneType == 1) {
        return proxy.selectDictLabel(q_single_crane_span.value, row.span);
    } else if (row.craneType == 2) {
        return proxy.selectDictLabel(q_double_crane_span.value, row.span);
    } else if (row.craneType == 3) {
        return proxy.selectDictLabel(q_susp_crane_span.value, row.span);
    }
}
//起升高度翻译
function liftHeightFormat(row, column) {
    if (row.craneType == 1) {
        return proxy.selectDictLabel(
            q_single_crane_lift_height.value,
            row.liftHeight
        );
    } else if (row.craneType == 2) {
        return proxy.selectDictLabel(
            q_double_crane_lift_height.value,
            row.liftHeight
        );
    } else if (row.craneType == 3) {
        return proxy.selectDictLabel(
            q_susp_crane_lift_height.value,
            row.liftHeight
        );
    }
}
// 工作级别翻译
function workLevelFormat(row, column) {
    if (row.craneType == 1) {
        return proxy.selectDictLabel(
            q_single_crane_work_level.value,
            row.workLevel
        );
    } else if (row.craneType == 2) {
        return proxy.selectDictLabel(
            q_double_crane_work_level.value,
            row.workLevel
        );
    } else if (row.craneType == 3) {
        return proxy.selectDictLabel(q_susp_crane_work_level.value, row.workLevel);
    }
}

/** 查询产品列表 */
function getList() {
    loading.value = true;
    if (activeTab.value == 'first') {
        listTrackpart(queryParams.value).then((response) => {
            trackPartList.value = response.rows;
            total.value = response.total;
            loading.value = false;
        });
    } else if (activeTab.value == 'second') {
        listSplpart(queryParams.value).then((response) => {
            splPartList.value = response.rows;
            total.value = response.total;
            loading.value = false;
        });
    } else if (activeTab.value == 'third') {
        listSplpart(queryParams.value).then((response) => {
            splPartList.value = response.rows;
            total.value = response.total;
            loading.value = false;
        });
        crastopmodelPartList
    } else if (activeTab.value == 'fourth') {

    } else if (activeTab.value == 'six') {

    }
}

// 取消按钮
function cancel() {
    showList.value = true;
    reset();
}
// 表单重置
function reset() {
    form.value = {
        craneType: "1",
        craneOperation: null,
        control: null,
        craneModel: null,
        span: null,
        liftHeight: null,
        workLevel: null,
        ratedPower: null,
        liftSpeed: null,
        crabSpeed: null,
        cartSpeed: null,
        pressureMax: null,
        uploadChart: null,
        uploadCrane: null,
        uploadPressure: null,
        uploadPrice: null,
    };
    proxy.resetForm("saveFormRef");
}

/** 提交按钮 */
function submitForm() {
    proxy.$refs["saveFormRef"].validate((valid) => {
        if (valid) {
            if (form.value.productId != null) {
                updateProduct(form.value).then((response) => {
                    proxy.$modal.msgSuccess("修改成功");
                    showList.value = true;
                    getList();
                });
            } else {
                addProduct(form.value).then((response) => {
                    proxy.$modal.msgSuccess("新增成功");
                    showList.value = true;
                    getList();
                });
            }
        }
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
    ids.value = selection.map((item) => item.productId);
    single.value = selection.length !== 1;
    multiple.value = !selection.length;
}
/** 新增按钮操作 */
function handleAdd() {
    reset();
    showList.value = false;
}
/** 修改按钮操作 */
function handleUpdate(row) {
    console.log("🚀 ~ file: index.vue ~ line 562 ~ handleUpdate ~ row", row)
    const productId = row.productId || ids.value;
    // getProduct(productId).then((response) => {
    //     form.value = response.data;
    //     showList.value = false;
    //     saveTitle.value = "修改产品";
    // });
}

/** 删除按钮操作 */
function handleDelete(row) {
    const productIds = row.productId || ids.value;
    proxy.$modal
        .confirm('是否确认删除产品编号为"' + productIds + '"的数据项？')
        .then(function () {
            return delProduct(productIds);
        })
        .then(() => {
            getList();
            proxy.$modal.msgSuccess("删除成功");
        })
        .catch(() => { });
}
/** 导出按钮操作 */
function handleExport() {
    this.download(
        "business/product/export",
        {
            ...queryParams.vallue,
        },
        `product_${new Date().getTime()}.xlsx`
    );
}

getList();
</script>
<style lang="scss" scoped>
.save-container {
    background-color: #ffffff;
}

.search-tool {
    display: flex;
    justify-content: space-between;
}
</style>
