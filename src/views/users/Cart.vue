<script setup lang="ts">
import { ref } from 'vue';
import {addProductToCart, deleteProductFromCart, updateCartItem, getCartItems, checkout,} from '../../api/carts.ts';
import type {CartItem,item}from '../../api/carts.ts'
import {getStockpileById} from '../../api/products.ts'

// //
// const items: item[] = [
//   {
//     cartItemId: 1,
//     productId: 101,
//     title: "商品A",
//     price: 99.99,
//     description: "这是商品A的描述信息。",
//     cover: "https://th.bing.com/th/id/OIP.YE928wcXeXYA465TQ7dV_AHaP_?w=115&h=189&c=7&r=0&o=5&dpr=1.3&pid=1.7",
//     detail: "这是商品A的详细信息，可以包括材质、尺寸、产地等内容。",
//     quantity: 2, // 该商品加购数量
//   },
//   {
//     cartItemId: 2,
//     productId: 102,
//     title: "商品B",
//     price: 199.99,
//     description: "这是商品B的描述信息。",
//     cover: "https://th.bing.com/th/id/OIP.dSGTAJQTqvykec2XzchxZQHaHa?rs=1&pid=ImgDetMain",
//     detail: "这是商品B的详细信息，可以包括材质、尺寸、产地等内容。",
//     quantity: 1, // 该商品加购数量
//   },
//   {
//     cartItemId: 3,
//     productId: 103,
//     title: "商品C",
//     price: 49.99,
//     description: "这是商品C的描述信息。",
//     cover: "https://th.bing.com/th/id/OIP.nE5Mf4w3MWaIkK0mDSwNHgHaHa?w=174&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
//     detail: "这是商品C的详细信息，可以包括材质、尺寸、产地等内容。",
//     quantity: 5, // 该商品加购数量
//   },
// ];
//
// const CartItems: CartItem={
//   items:items,
//   total:3,
//   price:250,
// }

const items = ref<item[]>([])
const total=ref(' ');//购物车一共多少件商品
const stock=ref(Array(total).fill(0));

fetchCartItems();
function fetchCartItems() {
  getCartItems().then((res) => {
    items.value=res.data.data.items;
    total.value=res.data.data.total;
  })
}

function handleQuantityChange(row: number) {
  updateCartItem(items.value[row].cartItemId, items.value[row].quantity).then((res) => {
    if (res.data.code === '200') {
      ElMessage({
        message: '更新成功！',
        type: 'success',
        center: true,
      })
      fetchCartItems();
    } else if (res.data.code === '400' || res.data.code === '401') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}//更新数量

// 删除购物车中的商品
function handleRemove(row: number) {
  deleteProductFromCart(items.value[row].cartItemId).then((res) => {
    if (res.data.code === '200') {
      ElMessage({
        message: '删除成功！',
        type: 'success',
        center: true,
      })
      fetchCartItems();
    } else if (res.data.code === '400' || res.data.code === '401') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}
//查看库存

//获取每一行的库存
for (let row = 0; row < Number(total.value); row++) {
  getStockpileByRow(row); // 依次获取每一行的库存
}
function getStockpileByRow(row: number) {
  getStockpileById(items.value[row].productId).then((res) => {
    stock.value[row]= res.data.data.stock;
  })
}
</script>

<template>
  <el-card class="box-card">
  <div class="cart-container">
    <h1>我的购物车</h1>
    <!-- 购物车为空 -->
    <div v-if="items.length === 0" class="empty-cart">
      <p>您的购物车是空的。</p>
    </div>
    <!-- 购物车列表 -->
    <div v-else class="cart-items">
      <el-table :data="items" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="cover" label="封面" width="150">
          <template #default="scope">
            <el-image
                :src="scope.row.cover"
                :preview-src-list="[scope.row.cover]"
                fit="contain"
                class="main-image"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="书名" width="120" />
        <el-table-column prop="description" label="描述" width="150" />
        <el-table-column prop="detail" label="详细信息" width="180" />
        <el-table-column prop="price" label="单价" width="150" />
        <el-table-column prop="quantity" label="修改数量" width="200" >
          <template #default="scope">
            <el-input-number v-model="scope.row.quantity" :min="1" :max="Number(stock[scope.row])" :controls-position="'right'" :disabled-input="true" @change="handleQuantityChange(scope.row)"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120">
          <template #default="scope">
            {{ (scope.row.quantity * scope.row.price).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作"width="120">
          <template #default="scope">
            <el-button type="text" style="color: red;" @click="handleRemove(scope.row)">删除商品</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!--   结算按钮 -->
    <div v-if="items.length > 0" class="submit">
      <el-button type="primary" >提交订单</el-button>
    </div>
  </div>
  </el-card>
</template>

<style scoped>

.box-card {
  max-width: 2400px;
}

.cart-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 10px;
  font-family: Arial, sans-serif;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #666;
}

.empty-cart {
  text-align: center;
  font-size: 18px;
  color: #999;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.item-info {
  flex: 1;
}

.item-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}


.submit{
  margin-top: 20px;
  text-align: center;
}
</style>
