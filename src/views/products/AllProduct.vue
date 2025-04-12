<script setup lang="ts">
import { ref } from "vue";
import ProductItem from "../../components/ProductItem.vue";
import {getAllProduct} from "../../api/products.ts";

const productList1 = ref([
    {
        productId: 1,
        productTitle: "Product 1",
        productPrice: 100,
        productCover: "http://dyy-1.oss-cn-nanjing.aliyuncs.com/t01b0ee34ea4870e36a_%E5%89%AF%E6%9C%AC.jpg",
        productDescribe: "Product 1 Describe",
        productDetail: "Product 1 Detail",
        productRate: 5,
    },{
        productId: 2,
        productTitle: "Product 2",
        productPrice: 200,
        productCover: "http://dyy-1.oss-cn-nanjing.aliyuncs.com/t01b0ee34ea4870e36a_%E5%89%AF%E6%9C%AC.jpg",
        productDescribe: "Product 2 Describe",
        productDetail: "Product 2 Detail",
        productRate: 4.5,
    }
])

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