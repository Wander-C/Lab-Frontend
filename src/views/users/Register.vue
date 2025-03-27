<script setup lang="ts">
import {computed, ref} from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import {uploadImage} from "../../api/tools.ts";
import {accountsRegister} from "../../api/accounts.ts";
import {router} from "../../router";

const username = ref('')
const password = ref('')
const name = ref('')
const avatar = ref('')
const role = ref('')
const telephone = ref('')
const email = ref('')
const location = ref('')
const imageFileList = ref([]);

// 用户名是否为空
const hasUsernameInput = computed(() => username.value != '')
// 密码是否为空
const hasPasswordInput = computed(() => password.value != '')
// 真实姓名是否为空
const hasNameInput = computed(() => name.value != '')
// 身份是否为空
const hasRoleInput = computed(() => role.value != '')
// 号码是否为空、号码规则、号码是否合法
const hasTelInput = computed(() => telephone.value != '')
const MobileRegex = /^1\d{10}$/
const isTelLegal = computed(() => MobileRegex.test(telephone.value))
// 邮箱是否为空、邮箱规则、邮箱是否合法
const hasEmailInput = computed(() => email.value != '')
const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const isEmailLegal = computed(() => EmailRegex.test(email.value))

const registerDisabled = computed(() => {
  return !(hasUsernameInput.value && hasPasswordInput.value && hasNameInput.value && hasRoleInput.value
          && (!hasTelInput.value || isTelLegal.value) && (!hasEmailInput.value || isEmailLegal.value))
})

function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function handleUpload(file: any, fileList: any) {
  imageFileList.value = fileList
  let formData = new FormData()
  formData.append('file', file.raw)
  uploadImage(formData).then(res => {
    avatar.value = res.data.result
  })
}

function handleExceed() {
  ElMessage({
    message: '最多只能上传一张图片',
    type: 'error',
    center: true,
  })
}

function handleRemove() {
  avatar.value = ''
}

function handleRegister() {
  accountsRegister({
    username: username.value,
    password: password.value,
    name: name.value,
    avatar: avatar.value,
    role: role.value,
    telephone: telephone.value,
    email: email.value,
    location: location.value,
  }).then(res => {
    if (res.data.code === 200) {
      ElMessage({
        message: res.data.data,
        type: 'success',
        center: true,
      })
      router.push({path: '/login'})
    } else if (res.data.code === 400) {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}
</script>

<template>
  <el-main class="main-frame bgimage">
    <el-card class="login-card">
      <div>
        <h1>创建一个新的账户</h1>

        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item required>
                <label for="username">用户名</label>
                <el-input
                    :class="{ 'error-warn-input': !hasUsernameInput }"
                    id = "username"
                    v-model="username"
                    placeholder="请输入用户名"
                />
              </el-form-item>
            </el-col>

            <el-col :span="1"/>

            <el-col :span="8">
              <el-form-item required>
                <label for="name">真实姓名</label>
                <el-input
                    :class="{ 'error-warn-input': !hasNameInput }"
                    id = "name"
                    v-model="name"
                    placeholder="请输入真实姓名"
                />
              </el-form-item>
            </el-col>

            <el-col :span="1"/>

            <el-col :span="6">
              <el-form-item required>
                <label for="role">身份</label>
                <el-select id = "role" v-model="role" placeholder="请选择身份">
                  <el-option value="CUSTOMER" label="顾客"/>
                  <el-option value="MANAGER" label="管理员"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="11">
              <el-form-item required>
                <label for="password">密码</label>
                <el-input
                    :class="{ 'error-warn-input': !hasPasswordInput }"
                    id = "password"
                    v-model="password"
                    placeholder="请输入密码"
                    show-password
                />
              </el-form-item>
            </el-col>

            <el-col :span="2"/>

            <el-col :span="11">
              <el-form-item>
                <label for="telephone">手机号</label>
                <el-input
                    :class="{'error-warn-input': hasTelInput && !isTelLegal}"
                    id = "telephone"
                    v-model="telephone"
                    placeholder="请输入手机号"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="17">
              <el-form-item>
                <label for="location">位置</label>
                <el-input id = "location" v-model="location" placeholder="请输入位置" />
              </el-form-item>
            </el-col>

            <el-col :span="1"/>

            <el-col :span="6">
              <el-form-item>
                <label for="email">邮箱</label>
                <el-input
                    :class="{'error-warn-input': hasEmailInput && !isEmailLegal}"
                    id = "email"
                    v-model="email"
                    placeholder="请输入邮箱"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <label for="avatar">头像URL</label>
            <el-input id = "avatar" v-model="avatar" placeholder="头像URL" disabled/>
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

          <span class="button-group">
            <el-button type="primary" @click="handleRegister" :disabled="registerDisabled">创建账户</el-button>
            <el-button
                @click="$router.push('/login')">
              去登录
            </el-button>
          </span>

        </el-form>
      </div>
    </el-card>
  </el-main>
</template>

<style scoped>
.main-frame {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.bgimage {
  background-image: url("../../assets/shopping-1s-1084px.svg");
}

.login-card {
  width: 60%;
  padding: 10px;
}

.error-warn {
  color: red;
}

.error-warn-input {
  --el-input-focus-border-color: red;
}

.button-group {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  justify-content: right;
}
</style>