<script setup lang="ts">
import {getCurrentInstance, ref} from 'vue'
import {getProductById, updateProductInfo, getStockpileById, adjustStockpile} from '../../api/products.ts'
import {addProductToCart, getCartItems,updateCartItem} from "../../api/carts.ts";
import type { specificationInfo } from '../../api/products.ts'
import type {item} from "../../api/carts.ts";
import {UploadFilled} from "@element-plus/icons-vue";
import {uploadImage} from "../../api/tools.ts";
import AllComments from "./AllComments.vue";
import {addCategory,getAllCategory, getCategory, removeCategory} from "../../api/category.ts";
import {ElMessage} from "element-plus";


const role = sessionStorage.getItem("role");
const {proxy} = getCurrentInstance() as any
const productId = Number(proxy.$route.params.productId)

const title = ref('')// title: string,
const price = ref()//     price: number,
const discountPrice = ref()
const rate = ref()//     rate: number,           // 评分,0~10
const description = ref('')//     description?: string,   // 描述
const cover = ref('')//     cover?: string,         // 封面URL
const detail = ref('')//     detail?: string,        // 详细说明
const specifications = ref<specificationInfo[]>([])//     specification?: Set<specificationInfo>,    // 规格说明,为集合，一个商品可以对应多个规格

const amount = ref()//库存量
const frozen = ref()//冻结量
const available = ref()// 可用库存
const addInCart = ref(1)//我想加入购物车的量
const amountInCart=ref(0)//购物车中已有的量
const categories = ref<{id: number, name: string}[]>([])
getCategory(productId).then((res) => {
  categories.value = res.data.data
})
const allcategories = ref<{id: number, name: string}[]>([])
getAllCategory().then(res => {
  allcategories.value = res.data.data
})
const dialogVisible = ref(false)
const selectedCategoryId = ref<number | null>(null)

getStockpileById(productId).then((res) => {
  amount.value = res.data.data.amount;
  frozen.value = res.data.data.frozen;
  available.value = res.data.data.amount - res.data.data.frozen;
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
    discountPrice.value = res.data.data.discountPrice
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
  }).then((res) => {
    if (res.data.code === '200') {
      ElMessage({
        message: '更新成功',
        type: 'success',
        center: true,
      })
      getStockpileById(productId).then((res) => {
        amount.value = res.data.data.amount;
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
        const cartItems = cartResponse.data.data;
        // 查找是否已经存在相同 productId 的商品
        const existingItem = cartItems.find((item: item) => item.productId === productId);
        if (existingItem) {
          // 如果商品已经存在，更新数量
          amountInCart.value = existingItem.quantity;
        }
      })
}

// 添加或修改购物车中商品的数量
function upsertCartItem(){
  getCartItems().then(cartResponse => {
    const cartItems = cartResponse.data.data; // 返回的数据是一个数组，包含购物车中的所有商品
    // 查找是否已经存在相同 productId 的商品
    const existingItem = cartItems.find((item: item) => item.productId === productId);
    if (existingItem) {
      // 如果商品已经存在，更新其数量
      const cartItemId = existingItem.cartItemId;
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

function handleSubmit() {

  addCategory(selectedCategoryId.value,productId).then((res) => {
    if (res.data.code === '200') {
      ElMessage({
        message: '添加成功！',
        type: 'success',
        center: true,
      })
    }
  })
  dialogVisible.value = false;
  window.location.reload();
  // 处理提交逻辑
  }

function deleteCategory(id:number) {
  removeCategory(id,productId).then((res) => {
    if (res.data.code === '200') {
      ElMessage({
        message: '删除成功！',
        type: 'success',
        center: true,
      })
    }
  })
  window.location.reload();
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
            <el-input-number v-model="addInCart" :min="0"  :max="Number(available)-Number(amountInCart)"  :precision="0"/>
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
              <span v-if="role == 'user'" class="price-value">
                <span v-if="discountPrice == null">
                ¥{{ price }}
                </span>
                <span v-else>
                  <el-text tag="del">¥{{ price }}</el-text>
                  ¥{{ discountPrice }}
                </span>
              </span>
              <el-input-number v-else v-model="price" :min="0" :precision="2"/>
            </div>

            <!-- 库存 -->
            <div class="stockpile-section">
              <el-row style="margin-bottom: 20px;">
                <span class="stockpile-label">库存：</span>
                <span v-if="role == 'user'" class="stockpile-value">{{ amount }}</span>
                <el-input-number v-else  v-model="amount" :min="0" :precision="0"/>
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
                  :rows="6"
                  placeholder="请输入商品介绍"
              />
            </div>
            <!-- 商品详情 -->
            <div class="detail-section">
              <h3>商品详情</h3>
              <div v-if="role == 'user'" v-html="detail"  class="detail-content"></div>
              <el-input
                  v-else
                  v-model="detail"
                  type="textarea"
                  :rows="9"
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
          <div v-if="role === 'user'" style="margin-top: 20px">
            <h3>分类</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <el-tag
                  v-for="cat in categories"
                  :key="cat.id"
                  type="success"
                  effect="plain"
              >
                {{ cat.name }}
              </el-tag>
            </div>
          </div>

          <!-- 管理员编辑规格 -->
          <div v-else v-for="(spec, index) in specifications" :key="index" style="margin-bottom: 10px">
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
          <div style="margin-top: 30px">
            <h3>分类标签</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <el-tag
                  v-for="cat in categories"
                  :key="cat.id"
                  type="success"
                  effect="plain"
                  closable
                  @close="deleteCategory(cat.id)"
              >
                {{ cat.name }}
              </el-tag>

              <!-- 添加分类按钮 -->
              <el-button
                  :disabled="title==''||price==''"
                  type="primary"
                  @click="dialogVisible = true"
                  class="save-button"
                  style="position: absolute; right: 0"
              >
                添加分类
              </el-button>

            </div>
          </div>
        </el-row>

      </el-col>

    </el-row>
  </div>
  <AllComments/>
  <el-dialog v-model="dialogVisible" title="选择分类" width="30%">
    <el-select
        v-model="selectedCategoryId"
        placeholder="请选择分类"
        style="width: 100%"
    >
      <el-option
          v-for="cat in allcategories"
          :key="cat.id"
          :label="cat.name"
          :value="cat.id"
      />
    </el-select>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :disabled="!selectedCategoryId">添加</el-button>
    </template>
  </el-dialog>
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

.detail-content {
  max-height: 200px; /* 设置最大高度 */
  overflow-y: auto;   /* 超出部分可垂直滚动 */
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  background-color: #f9f9f9;
  font-size: 14px;
  line-height: 1.6;
}
</style>
