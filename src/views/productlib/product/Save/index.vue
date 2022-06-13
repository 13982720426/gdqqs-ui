<template>
    <div class="save-container">
        <el-form ref="saveFormRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="操作方式" prop="craneOperation">
                <el-input v-model="form.craneOperation" placeholder="请输入操作方式" />
            </el-form-item>
            <el-form-item label="遥控器" prop="control">
                <el-input v-model="form.control" placeholder="请输入遥控器" />
            </el-form-item>
            <el-form-item label="起重机型号" prop="craneModel">
                <el-input v-model="form.craneModel" placeholder="请输入起重机型号" />
            </el-form-item>
            <el-form-item label="跨度" prop="span">
                <el-input v-model="form.span" placeholder="请输入跨度" />
            </el-form-item>
            <el-form-item label="起升高度" prop="liftHeight">
                <el-input v-model="form.liftHeight" placeholder="请输入起升高度" />
            </el-form-item>
            <el-form-item label="工作级别" prop="workLevel">
                <el-input v-model="form.workLevel" placeholder="请输入工作级别" />
            </el-form-item>
            <el-form-item label="额定功率KW" prop="ratedPower">
                <el-input v-model="form.ratedPower" placeholder="请输入额定功率KW" />
            </el-form-item>
            <el-form-item label="起升速度" prop="liftSpeed">
                <el-input v-model="form.liftSpeed" placeholder="请输入起升速度" />
            </el-form-item>
            <el-form-item label="小车运行速度" prop="crabSpeed">
                <el-input v-model="form.crabSpeed" placeholder="请输入小车运行速度" />
            </el-form-item>
            <el-form-item label="大车运行速度" prop="cartSpeed">
                <el-input v-model="form.cartSpeed" placeholder="请输入大车运行速度" />
            </el-form-item>
            <el-form-item label="最大轮压" prop="pressureMax">
                <el-input v-model="form.pressureMax" placeholder="请输入最大轮压" />
            </el-form-item>
            <el-form-item label="上传设计总图" prop="uploadChart">
                <el-input v-model="form.uploadChart" placeholder="请输入上传设计总图" />
            </el-form-item>
            <el-form-item label="上传起重机数据" prop="uploadCrane">
                <el-input v-model="form.uploadCrane" placeholder="请输入上传起重机数据" />
            </el-form-item>
            <el-form-item label="上传起重机轮压数据" prop="uploadPressure">
                <el-input v-model="form.uploadPressure" placeholder="请输入上传起重机轮压数据" />
            </el-form-item>
            <el-form-item label="上传工厂价BOM清单" prop="uploadPrice">
                <el-input v-model="form.uploadPrice" placeholder="请输入上传工厂价BOM清单" />
            </el-form-item>
        </el-form>
        <div class="save-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </div>
</template>
<script setup name="ProductSave">
import { listProduct, getProduct, delProduct, addProduct, updateProduct } from "@/api/business/product";

const { proxy } = getCurrentInstance();

const data = reactive({
    form: {},
    rules: {
    }
});

const { form, rules } = toRefs(data);
const route = useRoute();

// 取消按钮
function cancel() {
    open.value = false;
    reset();
}
// 表单重置
function reset() {
    form.value = {
        productId: null,
        craneType: null,
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
        createUserId: null,
        createTime: null,
        modifyUserId: null,
        modifyTime: null,
        remark: null,
        params: null
    };
    proxy.resetForm("saveFormRef");
}

/** 提交按钮 */
function submitForm() {
    this.$refs["form"].validate(valid => {
        if (valid) {
            if (form.value.productId != null) {
                updateProduct(form.value).then(response => {
                    proxy.$modal.msgSuccess("修改成功");
                    open.value = false;
                    getList();
                });
            } else {
                addProduct(form.value).then(response => {
                    proxy.$modal.msgSuccess("新增成功");
                    open.value = false;
                    getList();
                });
            }
        }
    });
}

onMounted(() => {
    console.log('route', route)
    //  getProduct(productId).then(response => {
    //     form.value = response.data;
    //     open.value = true;
    //     title.value = "修改产品";
    // });
})
</script>