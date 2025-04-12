<script setup lang="ts">
import {ref, computed} from "vue";
import {UploadFilled} from "@element-plus/icons-vue";
import {uploadImage} from "../../api/tools.ts";
import {createProduct} from "../../api/products.ts";
import {router} from "../../router";

type specificationInfo = {
  item: string,       // 规格名称
  value: string,      // 规格内容
}

const productTitle = ref("");
const productPrice = ref<number>();
const productCover = ref("");
const productRate = ref<number>();
const productDescription = ref("");
const productDetail = ref("");
const productSpecification = ref(new Set<specificationInfo>());
const imageFileList = ref([])

const hasTitleInput = computed(() => productTitle.value != '');
const hasPriceInput = computed(() => productPrice.value != null);
const hasRateInput = computed(() => productRate.value != null);

const isPriceLegal = computed(() => {
  return productPrice.value != null && productPrice.value >= 0
})

const isRateLegal = computed(() => {
  return productRate.value != null && productRate.value >= 0 && productRate.value <= 5
})

const createDisabled = computed(() => {
  return !hasTitleInput.value && !hasPriceInput.value && !hasRateInput.value
})

function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function handleUpload(file: any, fileList: any) {
  imageFileList.value = fileList
  let formData = new FormData()
  formData.append('file', file.raw)
  uploadImage(formData).then(res => {
    productCover.value = res.data.data
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
  productCover.value = ''
}

function handleCreateProduct() {
  createProduct({
    title: productTitle.value,
    price: productPrice.value == null ? 0 : productPrice.value,
    cover: productCover.value,
    rate: productRate.value == null ? 0 : productRate.value,
    description: productDescription.value,
    detail: productDetail.value,
    specification: productSpecification.value,
  }).then(res => {
    if (res.data.code === '200') {
      ElMessage({
        message: '创建成功！',
        type: 'success',
        center: true,
      })
      router.push({path: '/allProduct'})
    } else if (res.data.code === '400' || res.data.code === '401') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

const specificationIdCounter = ref(1)
const specificationItem = ref("")
const specificationValue = ref("")
const isAddDisabled = computed(() => {
  return specificationItem.value == "" || specificationValue.value == ""
})

function addSpecification() {
  const newSpecification : specificationInfo = {
    item: specificationItem.value,
    value: specificationValue.value,
  };
  productSpecification.value.add(newSpecification)
  specificationIdCounter.value++;
  specificationItem.value = ""
  specificationValue.value = ""
}

function handleDeleteSpecificationByItem(Item: string) {
  const specificationToDelete = Array.from(productSpecification.value).find((specification) => specification.item === Item)
  if (specificationToDelete) {
    productSpecification.value.delete(specificationToDelete)
  }
}
</script>

<template>
  <el-main class="main-frame bgimage">
    <el-card class="login-card">
      <div>
        <h1>增加商品</h1>
        <el-form>
          <el-row>
            <el-col :span="10">
              <el-form-item required>
                <label for="productTitle">商品名称(必填)</label>
                <el-input
                    id="productTitle"
                    placeholder="请输入商品名称"
                    v-model="productTitle"
                />
              </el-form-item>
            </el-col>

            <el-col :span="1"/>

            <el-col :span="6">
              <el-form-item required>
                <label v-if="!hasPriceInput" for="productPrice">商品价格(必填)</label>
                <label v-else-if="!isPriceLegal" for="productPrice" class="error-warn">不合法</label>
                <label v-else for="productPrice">商品价格(必填)</label>
                <el-input
                    id="productPrice"
                    placeholder="请输入商品价格"
                    v-model="productPrice"
                />
              </el-form-item>
            </el-col>

            <el-col :span="1"/>

            <el-col :span="6">
              <el-form-item required>
                <label v-if="!hasRateInput" for="productRate">商品评分(必填)</label>
                <label v-else-if="!isRateLegal" for="productRate" class="error-warn">不合法</label>
                <label v-else for="productRate">商品评分(必填)</label>
                <el-input
                    id="productRate"
                    placeholder="请输入商品评分"
                    v-model="productRate"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <label for="productDescription">商品描述</label>
            <el-input
                id="productDescription"
                placeholder="请输入商品描述"
                v-model="productDescription"
            />
          </el-form-item>

          <el-form-item>
            <label for="productDetail">商品详情</label>
            <el-input
                id="productDetail"
                placeholder="请输入商品详情"
                v-model="productDetail"
            />
          </el-form-item>

          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <h3>商品规格</h3>
                <el-button
                    type="primary"
                    @click="addSpecification"
                    :disabled="isAddDisabled"
                >添加规格</el-button>
              </div>
            </template>
            <el-form>
              <el-form-item>
                <label for="specificationItem">规格名称</label>
                <el-input
                    id="specificationItem"
                    placeholder="请输入规格名称"
                    v-model="specificationItem"
                />
              </el-form-item>

              <el-form-item>
                <label for="specificationValue">规格内容</label>
                <el-input label=""
                    id="specificationValue"
                    placeholder="请输入规格内容"
                    v-model="specificationValue"
                    type="textarea"
                />
              </el-form-item>

              <el-form-item>
                <label>已添加规格</label>
                <el-table
                    :data="Array.from(productSpecification.values())"
                    border
                    max-height="200"
                >
                  <el-table-column prop="item" label="规格名称" show-overflow-tooltip/>
                  <el-table-column prop="value" label="规格内容" show-overflow-tooltip/>
                  <el-table-column fixed="right" label="Operations" width="105">
                    <template #default="scope">
                      <el-button link type="danger" size="small" @click="handleDeleteSpecificationByItem(scope.row.item)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>

            </el-form>
          </el-card>

          <el-form-item>
            <label for="productCover">商品封面</label>
            <el-input
                id="productCover"
                placeholder="请输入商品封面"
                v-model="productCover"
                disabled
            />
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
            <el-button type="primary"
                       @click="handleCreateProduct"
                       :disabled="createDisabled"
            >创建</el-button>
            <el-button @click="$router.push('/allProduct')">返回</el-button>
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

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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