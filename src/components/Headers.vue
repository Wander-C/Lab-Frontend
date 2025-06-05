<script setup lang="ts">
import {router} from '../router'
import {parseRole} from "../utils"
import {User, SwitchButton} from "@element-plus/icons-vue"
import {ref} from "vue";
import {createComment} from "../api/comment.ts";
import {ElMessage} from "element-plus";
import {createCategory} from "../api/category.ts";   //图标

const role = sessionStorage.getItem('role')    //登录的时候插入的
const dialogVisible = ref(false);
const categoryName = ref();

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

function handCommand(command: string) {
  switch (command) {
    case "创建商品":
      router.push({path: "/createProduct"})
          break;
    case "创建广告":
      router.push({path: "/createAdvertisement"})
          break;
    case "创建分类":
      dialogVisible.value = true;
          break;
  }
}

function handleSubmit() {
  if(categoryName.value!=''){
    createCategory(categoryName.value).then((res) => {
      if (res.data.code === '200') {
        ElMessage({
          message: '创建成功！',
          type: 'success',
          center: true,
        })
      }
    })
  }
  dialogVisible.value = false;
  // 处理提交逻辑
  window.location.reload()
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

      <el-col :span="1" class="header-icon" v-if="parseRole(role) === '管理员'">
        <el-dropdown placement="bottom" @command="handCommand">
          <el-icon :size="35" color="white">
            <el-icon-plus />
          </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="创建商品">创建商品</el-dropdown-item>
                <el-dropdown-item command="创建广告">创建广告</el-dropdown-item>
                <el-dropdown-item command="创建分类">创建分类</el-dropdown-item>
              </el-dropdown-menu>
            </template>
        </el-dropdown>
      </el-col>
<!--      <el-col :span="1" class="header-icon">-->
<!--        <router-link v-if="parseRole(role) === '管理员'" to="/createProduct" v-slot="{navigate}">-->
<!--          <el-icon @click="navigate" :size="35" color="white" >-->
<!--            <el-tooltip content="创建商品" placement="bottom">-->
<!--              <el-icon-plus />-->
<!--            </el-tooltip>-->
<!--          </el-icon>-->
<!--        </router-link>-->
<!--      </el-col>-->

      <el-col :span="1" class="header-icon">
        <router-link to="/allProduct" v-slot="{navigate}">
          <el-icon @click="navigate" :size="35" color="white" >
            <el-tooltip content="所有商品" placement="bottom">
              <el-icon-shop />
            </el-tooltip>
          </el-icon>
        </router-link>
      </el-col>

      <el-col :span="1" class="header-icon"  v-if="parseRole(role) === '顾客'">
        <router-link to="/cart" v-slot="{ navigate }">
          <el-icon @click="navigate" :size="35" color="white">
            <el-tooltip content="购物车" placement="bottom">
              <el-icon-shopping-cart-full /> <!-- 购物车图标 -->
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
  <el-dialog title="创建分类" v-model="dialogVisible" width="50%">
    <el-form label-width="80px">
      <el-form-item label="分类名">
        <el-input type="textarea" v-model="categoryName"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" >
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
  </el-dialog>
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
