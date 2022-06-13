<template>
  <div class="inform">
    <div style="padding: 20px">基本信息</div>
    <el-form :model="state.user" :rules="rules" label-width="80px" style="padding: 20px">
      <el-row :gutter="50">
        <el-col :span="6">
          <el-form-item label="客户姓名" prop="customerName">
            <el-input maxlength="30" v-model="state.user.nickName" placeholder="请输入"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="部门" prop="customerDept">
            <el-input maxlength="30" v-model="state.user.nickName" placeholder="请输入"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户性质" prop="customerProperty">
            <el-select
              v-model="state.user.nickName"
              placeholder="请选择客户性质"
              style="width: 100%"
            >
              <el-option
                v-for="dict in dataScopeOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="50">
        <el-col :span="6">
          <el-form-item label="联系人" prop="contact">
            <el-input maxlength="30" v-model="state.user.nickName" placeholder="请输入"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话" prop="phonenum">
            <el-input maxlength="30" v-model="state.user.nickName" placeholder="请输入"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邮箱" prop="email">
            <el-input maxlength="30" v-model="state.user.nickName" placeholder="请输入"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="50">
        <el-col :span="6">
          <el-form-item label="地址" prop="adress">
            <el-input maxlength="30" v-model="state.user.nickName" placeholder="请输入"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="邮政编码" prop="zipCode">
            <el-input maxlength="30" v-model="state.user.nickName" placeholder="请输入"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="50">
        <el-col :span="18">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="state.user.remark" maxlength="300" show-word-limit placeholder="请输入"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="submit" color="#ffdac6" class="sel">保存</el-button>
        <el-button type="danger" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="Information">
import { updateUserProfile, uploadAvatar } from '@/api/system/user'
import useUserStore from '@/store/modules/user'
import { getUserProfile } from '@/api/system/user'
import { ref } from 'vue-demi'

const state = reactive({
  user: {},
})
const dataScopeOptions = ref([
  { value: '1', label: '全部数据权限' },
  { value: '2', label: '自定数据权限' },
  { value: '3', label: '本部门数据权限' },
  { value: '4', label: '本部门及以下数据权限' },
  { value: '5', label: '仅本人数据权限' },
])


function getUser() {
  getUserProfile().then(response => {
    state.user = response.data
  })
}

const { proxy } = getCurrentInstance()

const rules = ref({
  customerName: [{ required: true, message: '客户姓名不能为空', trigger: 'blur' }],
  customerDept: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
  customerProperty: [{ required: true, message: '客户性质不能为空', trigger: 'blur' }],
  contact: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
  adress: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  phonenum: [
    { required: true, message: '联系电话不能为空', trigger: 'blur' },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
})
/** 提交按钮 */
function submit() {
  updateUserProfile(state.user).then(response => {
    proxy.$modal.msgSuccess('修改成功')
  })
}
/** 关闭按钮 */
function close() {
  getUser()
}
getUser()
</script>
<style scoped>
.user-info-head {
  width: 100px;
  height: 30px;
  color: #ff5800;
  background: #ffdac6;
  text-align: center;
}
.inform {
  height: 100%;
  background: #ffffff;
}
.sel {
  color: #ff5800;
}
</style>
