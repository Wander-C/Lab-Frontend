<script setup lang="ts">

const props = defineProps({
  product: Object({
    productId: Number,
    productTitle: String,
    productPrice: Number,
    productCover: String,
  })
})
</script>

<template>
  <el-card class="productItem">
    <div class="productCover">
      <img :src="props.product.productCover"  alt="product">
    </div>

    <h1 class="productTitle">{{ props.product.productTitle }}</h1>

  </el-card>
</template>

<style scoped>
.productItem {
  width: 200px;
  height: 300px;
  margin: 10px;
  border-radius: 10px;
}

.productCover {
  width: 100%;
  height: 100px;
}

.productTitle {
  width: 100%;
  height: 20px;
}
</style>