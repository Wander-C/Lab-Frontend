<script setup lang="ts">
import {Close } from '@element-plus/icons-vue'
import {deleteProductById, getStockpileById} from "../api/products.ts";
import {parseRole} from "../utils";
import {router} from "../router";
import {ref} from "vue";
const props = defineProps({
  product: Object({
    id: Number,
    title: String,
    price: Number,
    cover: String,
    rate: Number,
    discountPrice: Number,
  })
})

const role = sessionStorage.getItem('role')
const productId = props.product.id;
const productRate = props.product.rate;
const productCover = props.product.cover;
const productTitle = props.product.title;
const productPrice = props.product.price;
const productDiscountPrice = props.product.discountPrice;
const productStockPileAmount = ref();
const productStockPileFrozen = ref();

getProductStockPile()
function getProductStockPile() {
  getStockpileById(productId).then((res) => {
    productStockPileAmount.value = res.data.data.amount;
    productStockPileFrozen.value = res.data.data.frozen;
  }
  )}

function isDelete() {
  ElMessageBox.confirm('确定删除该商品吗？', '提示', {
    customClass: "customDialog",
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    showClose: false,
    roundButton: true,
    center: true,
  }).then(() => {
    deleteProductById(productId).then((res) => {
      if (res.data.code === '200') {
        ElMessage({
          message: '删除成功',
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

  })
}

</script>

<template>
  <el-card class="productItem" shadow="hover">
    <div class="productCover">
      <img class="cover" :src="productCover"  alt="加载失败">
      <el-icon v-if="parseRole(role) === '管理员'" class="close-icon" @click="isDelete ">
        <el-tooltip content="删除" placement="top">
          <Close />
        </el-tooltip>
      </el-icon>
    </div>
    <h1 class="productTitle" >{{ productTitle }}</h1>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="价格">
        <el-tag v-if="productDiscountPrice == null" type="warning" class="product-price">
          ￥{{ productPrice }}
        </el-tag>
        <el-text v-if="productDiscountPrice != null" tag="del" style="font-size: smaller">￥{{ productPrice }}</el-text>
        <el-text v-if="productDiscountPrice != null" class="discount-price">￥{{ productDiscountPrice }}</el-text>
        </el-descriptions-item>
      <el-descriptions-item label="评分">
        <el-tag type="danger">
          {{productRate}} 分
        </el-tag>
      </el-descriptions-item>

      <el-descriptions-item label="剩余">
        {{productStockPileAmount-productStockPileFrozen}}
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<style scoped>
.productItem {
  width: 200px;
  height: 400px;
  position: relative;
  overflow: hidden;
}

.productCover {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.close-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  z-index: 10;
  font-size: 20px;
  color: red;
}

.product-price {
  color: red;
}

.productTitle {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
}

.productTitle:hover {
  color: red; /* 鼠标悬停时的文本颜色 */
  text-decoration: underline;
}

.discount-price {
  font-size: 12px;
  color: red;
  font-weight: bold;
}
</style>