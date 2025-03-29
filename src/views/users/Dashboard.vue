<script setup lang="ts">
import {ref, computed} from 'vue'
import {accountsGet, accountsUpdate} from '../../api/accounts.ts'
import {parseRole} from "../../utils"
import {router} from '../../router'
import {UserFilled} from "@element-plus/icons-vue";

const role = sessionStorage.getItem("role")
const username = sessionStorage.getItem("username") || ''


const hasEmailInput = computed(() => newEmail.value != '')
const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const isEmailLegal = computed(() => EmailRegex.test(newEmail.value))
const hasTelInput = computed(() => newTel.value != '')
const MobileRegex = /^1\d{10}$/
const isTelLegal = computed(() => MobileRegex.test(newTel.value))

const avatar=ref('')//头像
const email = ref('')//邮箱
const location = ref('')//地址
const name = ref('')
const tel = ref('')

const newName = ref('')//新实名
const newAvatar = ref('')//新头像
const newTel = ref('')//新电话
const newEmail = ref('')//新邮箱
const newLocation = ref('')//新地址

const updateDisabled = computed(() => {
  return !((!hasTelInput.value || isTelLegal.value) && (!hasEmailInput.value || isEmailLegal.value))
})



getUserInfo()
function getUserInfo() {
  accountsGet(username).then((res) => {
    avatar.value = res.data.data.avatar
    email.value = res.data.data.email
    location.value = res.data.data.location
    name.value = res.data.data.name
    tel.value = res.data.data.telephone
  })
}



function updateInfo() {
  accountsUpdate({
    username: username,
    name: newName.value=='' ? undefined : newName.value,
    avatar:newAvatar.value=='' ? undefined : avatar.value,
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
</script>


<template>
  <el-main class="main-container">
    <el-card class="aside-card">
      <div class="avatar-area">
        <el-avatar :icon="UserFilled" :size="80">
        </el-avatar>
        <span class="avatar-text"> 欢迎您，{{ username }}</span>
      </div>

      <el-divider></el-divider>

      <el-descriptions
          :column="1"
          border
          title="个人信息"
      >

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

    <!--    todo-->
    <el-card class="wrap">
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
