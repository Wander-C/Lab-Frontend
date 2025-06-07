<script setup lang="ts">
import {ref} from "vue";
import {getCurrentInstance} from "vue";
import {getAdvertisementById, updateAdvertisementInfo} from "../../api/advertisements.ts";
import {uploadImage} from "../../api/tools.ts";
import {UploadFilled} from "@element-plus/icons-vue";

const role = sessionStorage.getItem('role')
const {proxy} = getCurrentInstance() as any
const adId = Number(proxy.$route.params.adId)

const title = ref('')
const content = ref('')
const imgUrl = ref('')
const productIds = ref<number[]>([])


const imageFileList = ref([])
function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function handleRemove(){
  imgUrl.value = ''
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
    imgUrl.value = res.data.data
  })
}

function getAdInfo() {
  getAdvertisementById(adId)
      .then(res => {
        title.value = res.data.data.title
        content.value = res.data.data.content
        imgUrl.value = res.data.data.imgUrl
        productIds.value = res.data.data.productIds
      })
}
getAdInfo()

function update() {
  updateAdvertisementInfo({
    id: adId.toString(),
    title: title.value == '' ? undefined : title.value,
    content: content.value == '' ? undefined : content.value,
    imgUrl: imgUrl.value == '' ? undefined : imgUrl.value,
    productIds: productIds.value
  }).then(res => {
    if (res.data.code === '200') {
      ElMessage({
        message: '更新成功',
        type: 'success',
        center: true,
      })
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
  <div class="advertisement-detail">
    <h1 v-if="role=='user'" class="title">{{title}}</h1>
    <el-row v-else>
      <el-col :span="20">
        <el-input
            v-model="title"
            style="margin-bottom: 20px"
        />
      </el-col>

      <el-col :span="4" v-if="role=='admin'">
        <el-button  type="primary" class="button" style="margin-left: 150px" @click="update">更新</el-button>
      </el-col>

    </el-row>

    <el-row :gutter="30">
      <el-col :span="6" class="image">
        <el-image
            :src="imgUrl"
            :preview-src-list="[imgUrl]"
            fit="contain"
            class="main-image"
        >
        </el-image>

        <h1 v-if="role=='admin'" for="newCover">↓↓↓↓替换新封面↓↓↓↓</h1>
        <el-upload v-if="role=='admin'"
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
      </el-col>

      <el-col :span="6">
        <label for="content" style="font-size: larger">内容</label>
        <el-input
            v-if="role=='admin'"
            id="content"
            v-model="content"
            type="textarea"
            :rows="3"
        />
        <p v-else>{{content}}</p>
      </el-col>
    </el-row>
  </div>

</template>

<style scoped>
.advertisement-detail {
  width: 90%;
  margin: 20px auto;
  border: solid 1px #ccc;
  padding: 20px;
}

.title {
  font-size: x-large;
  text-align: center;
}

.main-image {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  border: 2px solid #409eff !important;
  box-sizing: border-box;
}

</style>