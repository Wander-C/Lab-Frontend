<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { createAdvertisement} from "../../api/advertisements.ts";
import {uploadImage} from "../../api/tools.ts";
import {UploadFilled} from "@element-plus/icons-vue";

const adTitle = ref("");
const adContent = ref("");
const productId = ref<number>(0);
const imgUrl = ref("");

const isValidForm = computed(() => {
  return adTitle.value !=null &&adContent.value !== "" &&productId.value !=null;
});

const isProductIdLegal = computed(() => {
  return productId.value != null && productId.value > 0
})


function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function handleUpload(file: any) {
  imgUrl.value = file
  let formData = new FormData()
  formData.append('file', file.raw)
  uploadImage(formData).then(res => {
    imgUrl.value = res.data.data
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
  imgUrl.value = ''
}

function createAd() {
  if (isValidForm.value&&isProductIdLegal.value) {
    createAdvertisement({
      title: adTitle.value,
      content: adContent.value,
      imgUrl: imgUrl.value,
      productId: productId.value,
    }).then((res) => {
      if (res.data.code === "200") {
        ElMessage({
          message: "创建成功！",
          type: "success",
          center: true,
        });
        resetForm();
      } else {
        ElMessage({
          message: res.data.msg || "创建失败，请稍后再试。",
          type: "error",
          center: true,
        });
      }
    });
  } else {
    ElMessage({
      message: "请检查表单数据是否完整。",
      type: "warning",
      center: true,
    });
  }
}

function resetForm() {
  adTitle.value = "";
  adContent.value = "";
  productId.value = 0;
  imgUrl.value = "";
}
</script>

<template>
  <el-main class="main-frame bgimage">
    <el-card class="login-card">
      <div>
        <h1>创建广告</h1>
        <el-form label-position="top" label-width="120px">
          <el-form-item label="广告标题(必填)" required>
            <el-input v-model="adTitle" placeholder="请输入广告标题"></el-input>
          </el-form-item>
          <el-form-item label="广告内容(必填)" required>
            <el-input
                type="textarea"
                v-model="adContent"
                placeholder="请输入广告内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="产品ID(必填)" required>
            <el-input
                v-model.number="productId"
                placeholder="请输入产品ID"
            ></el-input>
          </el-form-item>
          <el-form-item label="广告封面" class="full-width">
            <el-input
                v-model="imgUrl"
                placeholder="请输入广告封面"
                disabled
            />
            <el-upload
                drag
                :limit="1"
                v-model:file="imgUrl"
                :http-request="uploadHttpRequest"
                :on-change="handleUpload"
                :on-exceed="handleExceed"
                :on-remove="handleRemove"
                class="upload-full-width"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button
                type="primary"
                @click="createAd"
                :disabled="!isValidForm"
            >
              创建
            </el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
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

.full-width {
  width: 100%;
}

.upload-full-width {
  width: 100%;
}

.el-upload__text {
  text-align: center;
  width: 100%;
}
</style>
