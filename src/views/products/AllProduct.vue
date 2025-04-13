<script setup lang="ts">
import { ref } from "vue";
import ProductItem from "../../components/ProductItem.vue";
import {getAllProduct} from "../../api/products.ts";
import {router} from "../../router";

const productList = ref()
getAllProduct().then(res => {
    productList.value = res.data.data
})

function toProductDetail(productId: number) {
    router.push("/productDetail/" + productId.toString());
}

</script>

<template>
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
</style>