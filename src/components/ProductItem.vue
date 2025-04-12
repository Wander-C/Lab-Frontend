<script setup lang="ts">
import {Delete } from '@element-plus/icons-vue'
import {deleteProductById} from "../api/products.ts";
import {parseRole} from "../untils";
const props = defineProps({
  product: Object({
    id: Number,
    title: String,
    price: Number,
    cover: String,
    rate: Number,
  })
})

const role = sessionStorage.getItem('role')
const productId = props.product.id;
const productRate = props.product.rate;
const productCover = props.product.cover;
const productTitle = props.product.title;
const productPrice = props.product.price;

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
    deleteProductById(productId);
    ElMessage({
      message: '删除成功',
      type: 'success',
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
          <Delete />
        </el-tooltip>
      </el-icon>
    </div>
    <h1 class="productTitle" >{{ productTitle }}</h1>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="价格">
        <el-tag type="warning">
          {{ productPrice }}￥
        </el-tag>
        </el-descriptions-item>
      <el-descriptions-item label="评分">
          <el-rate
          v-model="productRate"
          disabled
          show-score
          text-color="#ff9900"
          score-template="&nbsp; {value} 分"
          />
      </el-descriptions-item>
    </el-descriptions>


  </el-card>
</template>

<style scoped>
.productItem {
  width: 300px;
  height: 400px;
  position: relative;
  overflow: hidden;
}

.productCover {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 10;
  font-size: 25px;
  color: red;
}

.productTitle {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
}

.productTitle:hover {
  color: brown; /* 鼠标悬停时的文本颜色 */
  text-decoration: underline;
}
</style>