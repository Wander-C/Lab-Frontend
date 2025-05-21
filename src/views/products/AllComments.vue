<script setup lang="ts">
import { getCurrentInstance, ref } from "vue";
import {createComment, getCommentsByProductId} from "../../api/comment.ts";
import { ElMessage } from 'element-plus';
const { proxy } = getCurrentInstance() as any;
const productId = Number(proxy.$route.params.productId);
const comments = ref();
const dialogVisible = ref(false);
const score = ref(0);
const commentContent = ref();

getComments(productId);

function getComments(productId: number) {
  getCommentsByProductId(productId).then((res) => {
    comments.value = res.data.data;
    if (!comments.value || comments.value.length === 0) {
      comments.value = null;
    }
  });
}

const username = sessionStorage.getItem("username") || '';
const addable = ref(true);

function handleClick() {
  addable.value = true;
  if (comments.value) {
    for (let i = 0; i < comments.value.length; i++) {
      if (comments.value[i].userName === username) {
        addable.value = false;
        break; // 找到后立即退出循环
      }
    }
  }

  if (addable.value) {
    dialogVisible.value = true;
  } else {
    ElMessage({
      message: '你已经写过评论了',
      type: 'error',
      center: true,
    });
  }
}

function handleSubmit() {
  if(commentContent.value!=''){
    createComment({
      userName : username,
      productId : productId,
      score : score.value,
      content : commentContent.value,
    }).then((res) => {
      if (res.data.code === '200') {
        ElMessage({
          message: '评论成功！',
          type: 'success',
          center: true,
        })
      }
    })
  }
  dialogVisible.value = false;
  getComments(productId);
  // 处理提交逻辑
}
</script>

<template>
  <el-card class="comment-container" shadow="hover">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h1>评论区</h1>
      <el-button type="primary" @click="handleClick">写评论</el-button>
    </div>
    <el-dialog title="写评论" v-model="dialogVisible" width="50%">
      <el-form label-width="80px">
        <el-form-item label="评分">
          <el-input-number v-model="score" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="评论内容">
          <el-input type="textarea" v-model="commentContent"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" >
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
    </el-dialog>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <div class="scrollable-content">
          <el-card
              v-if="comments != null"
              v-for="comment in comments"
              :key="comment.id"
              class="comment-item"
              shadow="hover"
          >
            <div class="comment-header">
              <!-- 用户名靠左 -->
              <span class="user-name">用户*{{ comment.userName }}*给出的评价：</span>
              <!-- 评分居中，使用星星符号显示 -->
              <span class="rating">
                <el-rate
                    v-model="comment.score"
                    :max="10"
                    disabled
                    show-score
                    score-template="{value} 分"
                    class="rating"
                ></el-rate>
              </span>
              <div />
            </div>
            <div class="comment-body">
              {{ comment.content }}
            </div>
          </el-card>
          <el-card v-else class="comment-item" shadow="hover">o(╥﹏╥)o还没有人评论哦~</el-card>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped>
.comment-container {
  width: 90%;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
}

/* 滚动内容区域 */
.scrollable-content {
  max-height: 400px; /* 最大高度 */
  overflow-y: auto; /* 允许垂直滚动 */
  margin-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end; /* 按钮右对齐 */
}

.comment-item {
  display: flex;
  flex-direction: column; /* 让内容垂直排列 */
}

.comment-header {
  display: flex;
  justify-content: space-between; /* 用户名靠左，评分靠右 */
  align-items: center; /* 垂直居中对齐 */
  margin-bottom: 10px; /* 与评论内容保持间距 */
}

.user-name {
  font-weight: bold; /* 突出用户名 */
  color: black;
  flex: 1; /* 让用户名占满剩余空间 */
  min-width: 0; /* 防止溢出 */
}

.rating {
  min-width: 150px; /* 最小宽度 */
  display: flex;
  justify-content: flex-end; /* 评分靠右对齐 */
  align-items: center;
  flex-shrink: 0; /* 防止评分区域被压缩 */
}



.comment-body {
  margin-top: 12px; /* 评论内容与头部保持间距 */
  font-size: 24px; /* 修改字体大小 */
  line-height: 1.5;
  font-family: 'Arial', sans-serif; /* 自定义字体 */
  color: #D2691E; /* 土黄 */
}

.comment-item {
  color: #D2691E;
}
</style>
