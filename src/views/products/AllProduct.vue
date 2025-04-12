<script setup lang="ts">
import { ref } from "vue";
import ProductItem from "../../components/ProductItem.vue";
import {getAllProduct} from "../../api/products.ts";
import {router} from "../../router";

const productList = ref([])
getAllProduct().then(res => {
    productList.value = res.data.data
})

</script>

<template>
  <div class="allProduct">
    <ProductItem
        v-for="product in productList"
        :product="product"
        :key="product.id"
        @dblclick="router.push(`/productDetail/${product.title}`)"
    />
  </div>


</template>

<style scoped>
.allProduct {
  display: flex;
  flex-flow: wrap;
  justify-content: space-evenly;
  align-content: start;
}
</style>