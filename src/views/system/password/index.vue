<template>
  <div class="inform">
    <el-form ref="pwdRef" :model="user" :rules="rules" label-width="80px" style="padding: 20px">
      <el-form-item label="当前密码" prop="oldPassword">
        <el-input placeholder="请输入旧密码" type="password" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input placeholder="请输入新密码" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input placeholder="请确认密码" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit"  color="#ffdac6" class="sel">确认修改</el-button>
        <el-button type="danger" @click="close">重新填写</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="Password">
import { updateUserPwd } from '@/api/system/user'

const { proxy } = getCurrentInstance()

const user = reactive({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined,
})

const equalToPassword = (rule, value, callback) => {
  if (user.newPassword !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
const rules = ref({
  oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { required: true, validator: equalToPassword, trigger: 'blur' },
  ],
})

/** 提交按钮 */
function submit() {
  proxy.$refs.pwdRef.validate(valid => {
    if (valid) {
      updateUserPwd(user.oldPassword, user.newPassword).then(response => {
        proxy.$modal.msgSuccess('修改成功')
      })
    }
  })
}
/** 关闭按钮 */
function close() {
  proxy.$tab.closePage()
}
</script>
<style scoped>
.inform {
  height: 100%;
  background: #ffffff;
}
.sel {
  color: #ff5800;
}

</style>
