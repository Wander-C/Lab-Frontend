<script setup lang="ts">
import {ref, computed} from 'vue'
import {accountsGet, accountsUpdate} from '../../api/accounts.ts'
import {parseRole} from "../../untils"
import {UploadFilled, UserFilled} from "@element-plus/icons-vue";
import {uploadImage} from "../../api/tools.ts";
import {router} from "../../router";

const role = sessionStorage.getItem("role")
const username = sessionStorage.getItem("username") || ''

const displayInfoCard = ref(true)

const avatar=ref('')//头像
const email = ref('')//邮箱
const location = ref('')//地址
const name = ref('')//实名
const tel = ref('')//电话
const password = ref('')//密码

const newName = ref('')//新实名
const newAvatar = ref('')//新头像
const newTel = ref('')//新电话
const newEmail = ref('')//新邮箱
const newLocation = ref('')//新地址
const newPassword = ref('')//新密码

const hasEmailInput = computed(() => newEmail.value != '')
const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const isEmailLegal = computed(() => EmailRegex.test(newEmail.value))
const hasTelInput = computed(() => newTel.value != '')
const MobileRegex = /^1\d{10}$/
const isTelLegal = computed(() => MobileRegex.test(newTel.value))

// 修改密码
const passwordRegex = /^(?![a-zA-Z]+$)(?![0-9]+$)(?![^a-zA-Z0-9]+$).{6,12}$/
const confirmPassword = ref('')
const hasNewPasswordInput = computed(() => newPassword.value != '')
const isNewPasswordLegal = computed(() => passwordRegex.test(newPassword.value))
const hasConfirmPasswordInput = computed(() => confirmPassword.value != '')
const isNewPasswordIdentical = computed(() => newPassword.value == confirmPassword.value)
const changeDisabled = computed(() => {
  return !(hasConfirmPasswordInput.value && isNewPasswordIdentical.value)
})

const updateDisabled = computed(() => {
  return !((!hasTelInput.value || isTelLegal.value) && (!hasEmailInput.value || isEmailLegal.value))
})

const imageFileList = ref([])
function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function handleRemove(){
  newAvatar.value = ''
}

function handleExceed() {
  ElMessage({
    message: '最多只能上传一张图片',
    type: 'error',
    center: true,
  })
}

function handleUpload(file: any, fileList: any) {
  imageFileList.value = fileList
  let formData = new FormData()
  formData.append('file', file.raw)
  uploadImage(formData).then(res => {
    newAvatar.value = res.data.data
  })
}

getUserInfo()
function getUserInfo() {
  accountsGet(username).then((res) => {
    avatar.value = res.data.data.avatar
    email.value = res.data.data.email
    location.value = res.data.data.location
    name.value = res.data.data.name
    tel.value = res.data.data.telephone
    password.value = res.data.data.password
  })
}



function updateInfo() {
  accountsUpdate({
    username: username,
    password: newPassword.value=='' ? undefined : newPassword.value,
    name: newName.value=='' ? undefined : newName.value,
    avatar:newAvatar.value=='' ? undefined : newAvatar.value,
    telephone: newTel.value=='' ? undefined : newTel.value,
    email: newEmail.value=='' ? undefined : newEmail.value,
    location: newLocation.value=='' ? undefined : newLocation.value,
  }).then(res => {
    if (res.data.code === '200') {
      ElMessage({
        message: '更新成功！',
        type: 'success',
        center: true,
      })
      getUserInfo()
    } else if (res.data.code === '400' || res.data.code === '401') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

function updatePassword() {
  accountsUpdate({
    username: username,
    password: newPassword.value,
  }).then(res => {
    newPassword.value = ''
    confirmPassword.value = ''
    if (res.data.code === '200') {
      ElMessageBox.alert('密码修改成功，请重新登录', '提示', {
        customClass: 'customDialog',
        confirmButtonText: '跳转到登录',
        type: 'success',
        showClose: false,
        roundButton: true,
        center: true,
      }).then(() => {router.push({path: "/login"})})
    } else if (res.data.code === '400' || res.data.code === '401') {
      ElMessage({
        customClass: 'customDialog',
        message: res.data.msg,
        type: 'error',
      })
      newPassword.value = ''
      confirmPassword.value = ''
    }
  })
}
</script>


<template>
  <el-main class="main-container">
    <el-card class="aside-card">
      <div class="avatar-area">
        <el-avatar :src=avatar :size="80">
        </el-avatar>
        <span class="avatar-text"> 欢迎您，{{ username }}</span>
      </div>

      <el-divider></el-divider>

      <el-descriptions
          :column="1"
          border
          title="个人信息"
      >
        <template #extra>
          <el-button type="primary" @click="displayInfoCard = !displayInfoCard">
            <span v-if="displayInfoCard">修改密码</span>
            <span v-else>修改个人信息</span>
          </el-button>
        </template>

        <el-descriptions-item label="身份">
          <el-tag>{{ parseRole(role) }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="邮箱" >
          {{ email }}
        </el-descriptions-item>

        <el-descriptions-item label="联系电话">
          {{ tel }}
        </el-descriptions-item>

        <el-descriptions-item label="真实姓名">
          {{ name }}
        </el-descriptions-item>

        <el-descriptions-item label="地址">
          {{ location }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card v-if="displayInfoCard" class="wrap">
      <el-card  class="change-card">
        <template #header>
          <div class="card-header">
            <span>修改个人信息</span>
            <el-button @click="updateInfo" :disabled="updateDisabled">更新</el-button>
          </div>
        </template>

        <el-form>
          <el-form-item>
            <label for="name">实名</label>
            <el-input type="text" id="newName" v-model="newName"/>
          </el-form-item>

          <el-form-item>
            <label v-if="!hasEmailInput" for="email">邮箱</label>
            <label v-else-if="!isEmailLegal" for="email" class="error-warn">邮箱不合法</label>
            <label v-else for="email">邮箱</label>
            <el-input
                :class="{'error-warn-input': hasEmailInput && !isEmailLegal}"
                id = "email"
                v-model="newEmail"
                placeholder="请输入邮箱"
            />
          </el-form-item>

          <el-form-item>
            <label v-if="!hasTelInput" for="telephone">手机号</label>
            <label v-else-if="!isTelLegal" for="telephone" class="error-warn">手机号不合法</label>
            <label v-else for="telephone">手机号</label>
            <el-input
                :class="{'error-warn-input': hasTelInput && !isTelLegal}"
                id = "telephone"
                v-model="newTel"
                placeholder="请输入手机号"
            />
          </el-form-item>

          <el-form-item>
            <label for="address">收货地址</label>
            <el-input id="address" type="textarea" rows="3" v-model="newLocation" ></el-input>
          </el-form-item>

          <el-form-item>
            <label for="newAvatar">新头像</label>
            <el-input
                id = "newAvatar"
                v-model="newAvatar"
                placeholder="新头像URL"
                disabled
            />
          </el-form-item>

          <el-upload
              drag
              :limit="1"
              v-model:file-list="imageFileList"
              :http-request="uploadHttpRequest"
              :on-change="handleUpload"
              :on-exceed="handleExceed"
              :on-remove="handleRemove"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
          </el-upload>

        </el-form>
      </el-card>
    </el-card>

    <el-card v-if="!displayInfoCard" class="wrap">
      <el-card  class="change-card">
        <template #header>
          <div class="card-header">
            <span>修改密码</span>
            <el-button @click="updatePassword" :disabled="changeDisabled">更新</el-button>
          </div>
        </template>

        <el-form>
          <el-form-item>
            <label v-if="!hasNewPasswordInput" for="newPassword">新密码</label>
            <label v-else-if="!isNewPasswordLegal" for="newPassword" class="error-warn">密码不合法</label>
            <label v-else for="newPassword">新密码</label>
            <el-input
                id="newPassword"
                v-model="newPassword"
                show-password
                placeholder="请输入新密码"
            />
          </el-form-item>

          <el-form-item>
            <label for="confirmPassword">确认新密码</label>
            <el-input
                id="confirmPassword"
                v-model="confirmPassword"
                :disabled="!hasNewPasswordInput || !isNewPasswordLegal"
                show-password
            />
          </el-form-item>
        </el-form>
      </el-card>
    </el-card>


  </el-main>

</template>


<style scoped>

.error-warn {
  color: red;
}

.error-warn-input {
  --el-input-focus-border-color: red;
}

.main-container {
  display: flex;
  flex-direction: row;
  padding: 15px;
  gap: 5px;
  justify-content: center;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wrap{
  width: 60%;
  flex-direction: column;
}

.change-card {
  width: 100%;
  height: 80%;
}

.different-card {
  width: 100%;
  height: 50%;
}


.avatar-area {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 30px;
}

.avatar-text {
  font-size: x-large;
  font-weight: bolder;
  padding-right: 40px;
}


</style>
