<template>
  <div class="inform">
    <el-form
      :model="state.user"
      ref="userinfo"
      :rules="rules"
      label-width="80px"
      style="padding: 20px"
    >
      <el-form-item label="我的角色" prop="">
        <el-row :gutter="20">
          <el-col :span="14">
            <el-input maxlength="30" v-model="state.user.adminName" disabled="true" />
          </el-col>
          <el-col :span="10">
            <span>当前角色不可修改</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="账户名" prop="userName">
        <el-row :gutter="20">
          <el-col :span="14">
            <el-input disabled="true" v-model="state.user.userName" />
          </el-col>
          <el-col :span="10">
            <span>当前角色不可修改</span>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="用户名" prop="nickName">
        <el-input maxlength="30" v-model="state.user.nickName" style="width: 22%" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="state.user.sex">
          <el-radio label="0">男</el-radio>
          <el-radio label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-row :gutter="20">
          <el-col :span="22">
            <el-input @click="editCropper()" v-model="state.user.avatar" />
          </el-col>
          <el-col :span="2">
            <div class="user-info-head" @click="editCropper()">
              <el-icon><UploadFilled /></el-icon>
              上传头像
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input maxlength="11" v-model="state.user.phonenumber" style="width: 22%" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input maxlength="50" v-model="state.user.email" style="width: 22%" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          v-model="state.user.remark"
          maxlength="300"
          show-word-limit
          style="width: 22%"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" color="#ffdac6" class="sel">确认修改</el-button>
        <el-button type="danger" @click="close">重新填写</el-button>
      </el-form-item>
    </el-form>

    <el-dialog
      :title="title"
      v-model="open"
      width="800px"
      append-to-body
      @opened="modalOpened"
      @close="closeDialog"
    >
      <el-row>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            @realTime="realTime"
            v-if="visible"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <div class="avatar-upload-preview">
            <img :src="options.previews.url" :style="options.previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload
            action="#"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <el-button>
              选择
              <el-icon class="el-icon--right"><Upload /></el-icon>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{ span: 1, offset: 2 }" :md="2">
          <el-button icon="Plus" @click="changeScale(1)"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button icon="Minus" @click="changeScale(-1)"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button icon="RefreshLeft" @click="rotateLeft()"></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button icon="RefreshRight" @click="rotateRight()"></el-button>
        </el-col>
        <el-col :lg="{ span: 2, offset: 6 }" :md="2">
          <el-button type="primary" @click="open = false" color="#ffdac6" class="sel">
            确 定
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup name="Information">
import { updateUserProfile, uploadAvatar } from '@/api/system/user'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import useUserStore from '@/store/modules/user'
import { getUserProfile } from '@/api/system/user'
import userAvatarVue from '../user/profile/userAvatar.vue'
import { ref } from 'vue'

const state = reactive({
  user: {
    adminName:''
  },
})

function getUser() {
  getUserProfile().then(response => {
    state.user = response.data
    state.user.adminName = response.data.roles[0].roleName
  })
}

const { proxy } = getCurrentInstance()

const rules = ref({
  nickName: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  phonenumber: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
})
/** 提交按钮 */
function submit() {
  proxy.$refs['saveFormRef'].validate(valid => {
    uploadImg()
    updateUserProfile(state.user).then(response => {
      proxy.$modal.msgSuccess('修改成功')
    })
  })
}
/** 关闭按钮 */
function close() {
  getUser()
}
/**上传头像 */

const userStore = useUserStore()

const open = ref(false)
const visible = ref(false)

//图片裁剪数据
const options = reactive({
  img: userStore.avatar, // 裁剪图片的地址
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixedBox: true, // 固定截图框大小 不允许改变
  previews: {}, //预览数据
})

/** 编辑头像 */
function editCropper() {
  open.value = true
}
/** 打开弹出层结束时的回调 */
function modalOpened() {
  visible.value = true
}
/** 覆盖默认上传行为 */
function requestUpload() {}
/** 向左旋转 */
function rotateLeft() {
  proxy.$refs.cropper.rotateLeft()
}
/** 向右旋转 */
function rotateRight() {
  proxy.$refs.cropper.rotateRight()
}
/** 图片缩放 */
function changeScale(num) {
  num = num || 1
  proxy.$refs.cropper.changeScale(num)
}
/** 上传预处理 */
function beforeUpload(file) {
  if (file.type.indexOf('image/') == -1) {
    proxy.$modal.msgError('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
  } else {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      options.img = reader.result
    }
  }
}
/** 上传图片 */
function uploadImg() {
  proxy.$refs.cropper.getCropBlob(data => {
    let formData = new FormData()
    formData.append('avatarfile', data)
    uploadAvatar(formData).then(response => {
      open.value = false
      options.img = import.meta.env.VITE_APP_BASE_API + response.imgUrl
      userStore.avatar = options.img
      proxy.$modal.msgSuccess('修改成功')
      visible.value = false
    })
  })
}
/** 实时预览 */
function realTime(data) {
  options.previews = data
}
/** 关闭窗口 */
function closeDialog() {
  options.img = userStore.avatar
  options.visible = false
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
