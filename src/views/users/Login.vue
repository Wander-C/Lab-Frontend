<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import {router} from "../../router";
import {accountsGet, accountsLogin} from "../../api/accounts.ts";

// 输入框值（需要在前端拦截不合法输入：是否为空+额外规则）
const username = ref('')
const password = ref('')

// 用户名是否为空
const hasUsernameInput = computed(() => username.value != '')
// 密码是否为空
const hasPasswordInput = computed(() => password.value != '')

// 密码不设置特殊规则
// 登录按钮可用性
const loginDisabled = computed(() => {
  return !(hasPasswordInput.value && hasUsernameInput.value)
})

// 登录按钮触发
function handleLogin() {
  accountsLogin({
    username: username.value,
    password: password.value,
  }).then((res) => {
    if (res.data.code === '200') {
      ElMessage({
        message: '登录成功!',
        type: 'success',
        center: true,
      })

      const token = res.data.data
      sessionStorage.setItem('token', token)
      accountsGet(username.value).then((res) => {
        sessionStorage.setItem('username', res.data.data.username)
        sessionStorage.setItem('role', res.data.data.role)
        sessionStorage.setItem('id', res.data.data.id)
        router.push({path: '/home'})
      })
    } else if (res.data.code === '400' || res.data.code === '401') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
      password.value = ''
    }
})
}
</script>

<template>
  <el-main class="main-frame bgimage">
    <div class="login-frame">
          <img src="../../assets/cover.png" alt="cover" class="cover"></img>

          <div style="width: 300px">
            <h1>登入您的账户</h1>
            <el-form>
              <el-form-item>
                <label for="username">用户名</label>

                <el-input id="username" type="text" v-model="username"
                          required
                          placeholder="请输入用户名"/>
              </el-form-item>

              <el-form-item>
                <label for="password">密码</label>
                <el-input id="password" type="password" v-model="password"
                          required
                          placeholder="••••••••"/>
              </el-form-item>

              <span class="button-group">
              <el-button @click.prevent="handleLogin" :disabled="loginDisabled"
                         type="primary">登入</el-button>
              <router-link to="/register" v-slot="{navigate}">
                <el-button @click="navigate">去注册</el-button>
              </router-link>
          </span>
            </el-form>
          </div>

    </div>
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

.login-frame {
  display: flex;
  align-items: flex-start; /* 上边缘对齐 */
  justify-content: space-around; /* 水平分布 */
  gap: 20px; /* 两者之间的间距 */
  border: #999999 1px solid;
}

.cover {
  width: 500px;
  height: 100%;
}
.bgimage {
  //background-image: url("../../assets/cover.png");
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