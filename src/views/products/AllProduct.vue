<script setup lang="ts">
import { ref } from "vue";
import ProductItem from "../../components/ProductItem.vue";

const productList = ref([
    {
        productId: 1,
        productTitle: "Product 1",
        productPrice: 100,
        productCover: "",
    },{
        productId: 2,
        productTitle: "Product 2",
        productPrice: 200,
        productCover: "",
    },{
        productId: 3,
        productTitle: "Product 3",
        productPrice: 300,
        productCover: "",
    }, {
        productId: 4,
        productTitle: "Product 4",
        productPrice: 400,
        productCover: "",
    }, {
        productId: 5,
        productTitle: "Product 5",
        productPrice: 500,
        productCover: "",
    }, {
        productId: 6,
        productTitle: "Product 6",
        productPrice: 600,
        productCover: "",
    }, {
        productId: 7,
        productTitle: "Product 7",
        productPrice: 700,
        productCover: "",
  }

])
</script>

<template>
  <div class="allProduct">
    <ProductItem
        v-for="product in productList"
        :key="product.productId"
        :product="product"

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