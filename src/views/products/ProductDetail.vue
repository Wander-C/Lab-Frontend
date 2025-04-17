<script setup lang="ts">
import {getCurrentInstance, ref} from 'vue'
import {getProductById, updateProductInfo, getStockpileById, adjustStockpile} from '../../api/products.ts'
import {addProductToCart, getCartItems,updateCartItem} from "../../api/carts.ts";
import type { specificationInfo } from '../../api/products.ts'
import {UploadFilled} from "@element-plus/icons-vue";
import {uploadImage} from "../../api/tools.ts";

const role = sessionStorage.getItem("role");
const {proxy} = getCurrentInstance() as any
const productId = Number(proxy.$route.params.productId)

const title = ref('')// title: string,
const price = ref('')//     price: number,
const rate = ref('')//     rate: number,           // 评分,0~10
const description = ref('')//     description?: string,   // 描述
const cover = ref('')//     cover?: string,         // 封面URL
const detail = ref('')//     detail?: string,        // 详细说明
const specifications = ref<specificationInfo[]>([])//     specification?: Set<specificationInfo>,    // 规格说明,为集合，一个商品可以对应多个规格

const amount = ref('')//库存量
const frozen = ref('')//冻结量
const addInCart = ref('1')//我想加入购物车的量
const amountInCart=ref('0')//购物车中已有的量

getStockpileById(productId).then((res) => {
  amount.value = res.data.data.amount;
  frozen.value = res.data.data.frozen;
})

const imageFileList = ref([])
function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function handleRemove(){
  cover.value = ''
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
    cover.value = res.data.data
  })
}



getProduct(productId);
function getProduct(ID: number) {
  getProductById(ID).then((res) => {//   id: string,
    title.value = res.data.data.title//   title: string,
    price.value = res.data.data.price//   price: number,
    rate.value = res.data.data.rate//   rate: number,           // 评分,0~10
    description.value = res.data.data.description//   description?: string,   // 描述
    cover.value = res.data.data.cover//   cover?: string,         // 封面URL
    detail.value = res.data.data.detail//   detail?: string,        // 详细说明
    specifications.value = res.data.data.specifications//   specification?: Set<specificationInfo>,    // 规格说明
  })
}

function updateProduct() {
  updateProductInfo({
        id: productId,
        title: title.value,
        price: Number(price.value),
        rate: Number(rate.value),
        description: description.value==''?undefined:description.value,
        cover: cover.value=='' ? undefined : cover.value,
        detail: detail.value=='' ? undefined : detail.value,
        specifications: specifications == undefined ? undefined : specifications.value,
        // specification: (specifications.value!= undefined && specifications.value.length > 0)
        //     ? new Set(specifications.value)  // 转换为Set类型
        //     : undefined
      }
  ).then((res) => {
    if (res.data.code === '200') {
      ElMessage({
        message: '更新成功！',
        type: 'success',
        center: true,
      })
      getProduct(productId);
    } else if (res.data.code === '400' || res.data.code === '401') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

function alterStockpile() {
  adjustStockpile({
    productId: productId.toString(),
    amount: Number(amount.value),
    frozen: Number(frozen.value),
  }).then((res) => {
    if (res.data.code === '200') {
      ElMessage({
        message: '更新成功',
        type: 'success',
        center: true,
      })
      getStockpileById(productId).then((res) => {
        amount.value = res.data.data.amount;
        frozen.value = res.data.data.frozen;
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

getAmountInCart();
function getAmountInCart() {
  getCartItems() // 首先获取购物车中的所有商品
      .then(cartResponse => {
        const cartItems = cartResponse.data;
        // 查找是否已经存在相同 productId 的商品
        const existingItem = cartItems.find((item: { productId: string }) => item.productId === productId.toString());
        if (existingItem) {
          // 如果商品已经存在，更新数量
          amount.value = existingItem.amount;
        }
      })
}

// 添加或修改购物车中商品的数量
function upsertCartItem(){
  getCartItems().then(cartResponse => {
    const cartItems = cartResponse.data; // 返回的数据是一个数组，包含购物车中的所有商品
    // 查找是否已经存在相同 productId 的商品
    const existingItem = cartItems.find((item: { productId: string }) => item.productId === productId.toString());
    if (existingItem) {
      // 如果商品已经存在，更新其数量
      const cartItemId = existingItem.id;
      updateCartItem(cartItemId, Number(amountInCart.value)+Number(addInCart.value)).then((res) => {
        if (res.data.code === '200') {
          ElMessage({
            message: '更新成功！',
            type: 'success',
            center: true,
          })
          getAmountInCart();
        } else if (res.data.code === '400' || res.data.code === '401') {
          ElMessage({
            message: res.data.msg,
            type: 'error',
            center: true,
          })
        }
      })
    } else {
      // 如果商品不存在，添加到购物车
      addProductToCart(productId.toString(), Number(addInCart.value)).then((res) => {
        if (res.data.code === '200') {
          ElMessage({
            message: '更新成功！',
            type: 'success',
            center: true,
          })
          getAmountInCart();
        } else if (res.data.code === '400' || res.data.code === '401') {
          ElMessage({
            message: res.data.msg,
            type: 'error',
            center: true,
          })
        }
      })
    }
  })
}

</script>

<template>
  <div class="product-container">
    <el-row :gutter="30">
      <!-- 左侧图片区域 -->
      <el-col :span="6">
        <div class="image-section">
          <el-image
              :src="cover"
              :preview-src-list="[cover]"
              fit="contain"
              class="main-image"
          />
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
          <el-card v-if="role=='user'">
            <div style="display: flex; gap: 10px">
            <el-input-number v-model="addInCart" :min="0"  :max="Number(amount)-Number(amountInCart)"  :precision="0"/>
            <el-button type="primary" @click="upsertCartItem">加入购物车</el-button>
            </div>
          </el-card>
        </div>
      </el-col>

      <!-- 中间核心信息区域 -->
      <el-col :span="8">
        <div class="info-section">
          <!-- 标题 -->
          <h1 v-if="role == 'user'">{{ title }}</h1>
          <el-input v-else v-model="title" placeholder="商品标题" />

          <!-- 整合价格、评分、详情 -->
          <div class="core-info">
            <!-- 价格 -->
            <div class="price-section">
              <span class="price-label">价格：</span>
              <span v-if="role == 'user'" class="price-value">¥{{ price }}</span>
              <el-input-number v-else v-model="price" :min="0" :precision="2"/>
            </div>

            <!-- 库存 -->
            <div class="stockpile-section">
              <el-row style="margin-bottom: 20px;">
                <span class="stockpile-label">库存：</span>
                <span v-if="role == 'user'" class="stockpile-value">{{ amount }}</span>
                <el-input-number v-else  v-model="amount" :min="0" :precision="0"/>
                <el-col :span="2"/>
              </el-row>
              <el-row>
                <span class="stockpile-label">冻结量：</span>
                <el-input-number v-if="role=='admin'"  v-model="frozen" :min="0" :precision="0"/>
                <el-col :span="2"/>
                <el-button v-if="role == 'admin'" @click="alterStockpile" type="primary">更新库存</el-button>
              </el-row>

            </div>

            <!-- 评分 -->
            <div class="rate-section">
              <span class="rate-label">评分：</span>
              <el-rate v-model="rate" :max="10" :disabled="role == 'user'" show-score score-template="{value} 分"/>
            </div>
            <div class="discription-section">
              <h3>商品描述</h3>
              <div v-if="role !== 'admin'" v-html="description"></div>
              <el-input
                  v-else
                  v-model="description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入商品介绍"
              />
            </div>
            <!-- 商品详情 -->
            <div class="detail-section">
              <h3>商品详情</h3>
              <div v-if="role == 'user'" v-html="detail"></div>
              <el-input
                  v-else
                  v-model="detail"
                  type="textarea"
                  :rows="7"
                  placeholder="请输入商品详情"
              />
            </div>
          </div>
        </div>
      </el-col>

      <!-- 右侧规格参数区域 -->
      <el-col :span="10">
        <div class="spec-section">
          <h3>规格参数</h3>
          <el-table :data="specifications" v-if="role === 'user'" style="width: 100%">
            <el-table-column prop="item" label="参数名" min-width="120"/>
            <el-table-column prop="value" label="参数值" min-width="180"/>
          </el-table>

          <!-- 管理员编辑规格 -->
          <div v-else v-for="(spec, index) in specifications" :key="index">
            <el-input
                v-model="spec.item"
                placeholder="参数名"
                style="width: 30%; margin-right: 10px"
            />
            <el-input
                v-model="spec.value"
                placeholder="参数值"
                style="width: 55%; margin-right: 10px"
            />
            <el-button
                type="danger"
                @click="specifications.splice(index, 1)"
            >删除</el-button>
          </div>
        </div>
        <el-row v-if="role === 'admin'">
          <el-col :span="24" style="position: relative;padding-top: 20px">
            <el-button
                :disabled="title==''||price==''"
                type="primary"
                @click="updateProduct"
                class="save-button"
                style="position: absolute; right: 0"
            >
              保存修改
            </el-button>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.core-info {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-section {
  margin-top: 20px;
}

.spec-section {
  padding: 15px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.product-container {
  width: 90%;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ebeef5;
}

.main-image {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  border: 2px solid #409eff !important;
  box-sizing: border-box;
}

.price-section {
  margin: 20px 0;

  .price-label {
    font-size: 16px;
    color: #666;
  }

  .price-value {
    font-size: 28px;
    color: #ff5000;
    font-weight: bold;
  }
}

.stockpile-section {
  margin: 20px 0;

  .stockpile-label {
    margin-top: 10px;
    font-size: 16px;
    color: #666;
  }

  .stockpile-value {
    font-size: 28px;
    color: #ff5000;
    font-weight: bold;
  }
}
</style>
