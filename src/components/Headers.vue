<script setup lang="ts">
import {router} from '../router'
import {parseRole} from "../utils"
import {User, SwitchButton} from "@element-plus/icons-vue"   //图标

const role = sessionStorage.getItem('role')    //登录的时候插入的

//退出登录
function logout() {
  ElMessageBox.confirm(
      '是否要退出登录？',
      '提示',
      {
        customClass: "customDialog",
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: "warning",
        showClose: false,
        roundButton: true,
        center: true
      }
  ).then(() => {
    sessionStorage.setItem('token', '')
    router.push({path: "/login"})
  })
}
</script>


<template>
  <el-header class="custom-header" height="20">
    <el-row :gutter="10">

      <el-col :span="3" class="header-icon">
        <router-link to="/dashboard" v-slot="{navigate}" class="no-link">
          <h1 @click="navigate" class="header-text"> 番茄商城</h1>
        </router-link>
      </el-col>

      <el-col :span="2">
        <el-tag class="role-tag" size="large">{{ parseRole(role) }}版</el-tag>
      </el-col>

      <el-col :span="15">
      </el-col>

      <el-col :span="1" v-if="role=='admin'" class="header-icon">
        <router-link  to="/createProduct" v-slot="{navigate}">
          <el-icon @click="navigate" :size="35" color="white" >
            <el-tooltip content="创建商品" placement="bottom">
              <el-icon-plus />
            </el-tooltip>
          </el-icon>
        </router-link>
      </el-col>

      <el-col :span="1" v-if="role=='user'" class="header-icon">
        <router-link   to="/cart" v-slot="{ navigate }">
          <el-icon @click="navigate" :size="35" color="white">
            <el-tooltip content="购物车" placement="bottom">
              <el-icon-shopping-cart-full /> <!-- 购物车图标 -->
            </el-tooltip>
          </el-icon>
        </router-link>
      </el-col>

      <el-col :span="1" class="header-icon">
        <router-link to="/allProduct" v-slot="{navigate}">
          <el-icon @click="navigate" :size="35" color="white" >
            <el-tooltip content="所有商品" placement="bottom">
              <el-icon-shop />
            </el-tooltip>
          </el-icon>
        </router-link>
      </el-col>

      <el-col :span="1" class="header-icon">
        <router-link to="/dashboard" v-slot="{navigate}">
          <el-icon @click="navigate" :size="35" color="white" >
            <el-tooltip content="个人中心" placement="bottom">
              <User />
            </el-tooltip>
          </el-icon>
        </router-link>
      </el-col>

      <el-col :span="1" class="header-icon">
        <a @click="logout">
          <el-icon :size="35" color="white" >
            <el-tooltip content="退出登录" placement="bottom">
              <SwitchButton />
            </el-tooltip>
          </el-icon>
        </a>
      </el-col>
    </el-row>
  </el-header>
</template>


<style scoped>
.custom-header {
  background-color: #409eff;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  display: flex;
  flex-direction: column;
}

.no-link {
  text-decoration: none;
}

.role-tag {
  margin-top: 20px;
  font-size: 20px;
}

.header-text {
  color:white;
  font-size: x-large;
  min-width: max-content;
  margin-top: 15px;
  margin-bottom: 15px;
}

.header-icon {
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content: center;
}
</style>
