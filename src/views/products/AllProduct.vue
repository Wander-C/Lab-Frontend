<script setup lang="ts">
import { ref } from "vue";
import ProductItem from "../../components/ProductItem.vue";
import {getAllProduct} from "../../api/products.ts";
import {router} from "../../router";
import {deleteAdvertisementById, getAllAdvertisements} from "../../api/advertisements.ts";
import {parseRole} from "../../utils";
import {Delete} from "@element-plus/icons-vue";

const role = sessionStorage.getItem("role");

const AdList = ref()
getAllAdvertisements().then(res => {
    AdList.value = res.data.data
})

const productList = ref()
getAllProduct().then(res => {
    productList.value = res.data.data
})

function toProductDetail(productId: number) {
    router.push("/productDetail/" + productId.toString());
}

function toAdvertisementDetail(adId: number) {
  router.push("/advertisementDetail/" + adId.toString());
}

function isDelete(adId: number) {
  ElMessageBox.confirm('确定删除该商品吗？', '提示', {
    customClass: "customDialog",
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    showClose: false,
    roundButton: true,
    center: true,
  }).then(() => {
    deleteAdvertisementById(adId).then(res => {
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
  <div v-if="AdList.length > 0" class="advertisement">
    <el-carousel style="width: 700px">
      <el-carousel-item v-for="ad in AdList" :key="ad.id" @dblclick="toAdvertisementDetail(ad.id)">
        <img :src="ad.imgUrl" alt="广告图片" class="advertisement-image"/>
        <el-icon v-if="parseRole(role) === '管理员'" class="close-icon" @click="isDelete(ad.id)">
          <el-tooltip content="删除" placement="top">
            <Delete />
          </el-tooltip>
        </el-icon>
      </el-carousel-item>
    </el-carousel>
  </div>
  <div class="allProduct">
    <ProductItem
        v-for="product in productList"
        :product="product"
        :key="product.id"
        @dblclick="toProductDetail(Number(product.id))"
        class="productItem"
    />
  </div>

</template>

<style scoped>
.advertisement {
  margin-top: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-content: center;
}

.allProduct {
  margin-top: 10px;
  display: flex;
  flex-flow: wrap;
  justify-content: space-evenly;
  align-content: start;
}

.productItem {
  margin: 10px;
}

.advertisement-image {
  width: 700px;
  height: 300px;
}

.close-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  z-index: 10;
  font-size: 30px;
  color: red;
}
</style>