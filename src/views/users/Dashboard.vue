<script setup lang="ts">
import {ref, computed} from 'vue'
import {accountsGet, accountsUpdate} from '../../api/accounts.ts'
import {parseRole} from "../../utils"
import {router} from '../../router'
import {UserFilled} from "@element-plus/icons-vue";

const role = sessionStorage.getItem("role")
const username = sessionStorage.getItem("username") || ''

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

const displayInfoCard = ref(true)


getUserInfo()
function getUserInfo() {
  accountsGet(username).then((res) => {
    avatar.value = res.data.result.avatar
    email.value = res.data.result.email
    location.value = res.data.result.location
    name.value = res.data.result.name
    tel.value = res.data.result.telephone
  })
}



function updateInfo() {
  accountsUpdate({
    username: username,
    name: newName.value,
    avatar:newAvatar.value,
    telephone: newTel.value,
    email: newEmail.value,
    location: newLocation.value,
  }).then(res => {
    if (res.data.code === '000') {
      ElMessage({
        customClass: 'customMessage',
        type: 'success',
        message: '更新成功！',
      })
      getUserInfo()
    } else if (res.data.code === '400') {
      ElMessage({
        customClass: 'customMessage',
        type: 'error',
        message: res.data.msg,
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
      <el-card v-if="displayInfoCard" class="change-card">
        <template #header>
          <div class="card-header">
            <span>修改个人信息</span>
            <el-button @click="updateInfo">更新</el-button>
          </div>
        </template>

        <el-form>
          <el-form-item>
            <label for="name">昵称</label>
            <el-input type="text" id="name" v-model="newName"/>
          </el-form-item>

          <el-form-item>
            <label for="phone">手机号</label>
            <el-input id="phone" v-model="tel" disabled/>
          </el-form-item>

          <el-form-item v-if="role === 'CUSTOMER' || role === 'STAFF'">
            <label for="address">收货地址</label>
            <el-input id="address" type="textarea"
                      rows="4"
                      v-model="location" placeholder="中华门"></el-input>
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
