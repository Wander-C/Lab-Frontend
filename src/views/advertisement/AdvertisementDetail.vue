<script setup lang="ts">
import {ref} from "vue";
import {getCurrentInstance} from "vue";
import {getAdvertisementById, updateAdvertisementInfo} from "../../api/advertisements.ts";
import {uploadImage} from "../../api/tools.ts";
import {UploadFilled} from "@element-plus/icons-vue";
import {router} from "../../router";

const role = sessionStorage.getItem('role')
const {proxy} = getCurrentInstance() as any
const adId = Number(proxy.$route.params.adId)

const title = ref('')
const content = ref('')
const imgUrl = ref('')
const productIds = ref<number[]>([])
const productList = ref([])

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
        productList.value = res.data.data.productVOs
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

function toProductDetail(productId: number) {
  router.push("/productDetail/" + productId.toString());
}

</script>

<template>
  <div v-if="role == 'admin'" class="advertisement-detail">
    <el-row>
      <el-col :span="20">
        <el-input
            v-model="title"
            style="margin-bottom: 20px"
        />
      </el-col>

      <el-col :span="4" v-if="role=='admin'">
        <el-button type="primary" class="button" style="margin-left: 150px" @click="update">更新</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="30">
      <el-col :span="8" class="image">
        <el-image
            :src="imgUrl"
            :preview-src-list="[imgUrl]"
            fit="contain"
            class="main-image"
        >
        </el-image>

        <h1 for="newCover">↓↓↓↓替换新封面↓↓↓↓</h1>
        <el-upload v-if="role=='admin'"
                   drag
                   :limit="1"
                   v-model:file-list="imageFileList"
                   :http-request="uploadHttpRequest"
                   :on-change="handleUpload"
                   :on-exceed="handleExceed"
                   :on-remove="handleRemove"
        >
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
        </el-upload>

        <label for="content" style="font-size: larger">内容</label>
        <el-input
            id="content"
            v-model="content"
            type="textarea"
            :rows="3"
        />
      </el-col>

      <el-col :span="16">
        <el-table :data="productList" border @row-dblclick="(row) => toProductDetail(row.id)">
          <el-table-column prop="cover" label="封面" width="150">
            <template #default="scope">
              <el-image
                  :src="scope.row.cover"
                  :preview-src-list="[scope.row.cover]"
                  fit="contain"
              />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>

  <div v-else>
    <el-image
        :src="imgUrl"
        class="user-image"
    >
    </el-image>
    <div class="advertisement-detail">
      <el-table :data="productList" border @row-dblclick="(row) => toProductDetail(row.id)">
        <el-table-column prop="cover" label="封面" width="150">
          <template #default="scope">
            <el-image
                :src="scope.row.cover"
                :preview-src-list="[scope.row.cover]"
                fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="书名">
          <template #default="scope">
            <el-text tag="b">{{ scope.row.title }}</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="price" label="价格">
          <template #default="scope">
            <el-tag>￥{{ scope.row.price }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="评分">
          <template #default="scope">
            <el-text class="value">{{ scope.row.rate }}</el-text>
          </template>
        </el-table-column>

      </el-table>
    </div>

  </div>

</template>

<style scoped>
.advertisement-detail {
  width: 70%;
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
  height: 250px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  border: 2px solid #409eff !important;
  box-sizing: border-box;
}

.user-image {
  width: 100%;
  height: 600px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  box-sizing: border-box;
}

.value {
  color: red;
  font-size: larger;
  font-weight: bold;
}
</style>