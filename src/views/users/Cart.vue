<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {addProductToCart, deleteProductFromCart, updateCartItem, getCartItems} from '../../api/carts.ts';
import type {Cart,item}from '../../api/carts.ts'
import {router} from "../../router";

const CartItems = ref<item[]>([])
const totalAmount = ref(0);
const selectedItems = ref<item[]>([]);

const isLoading = ref(false);

const handleSelectChange = (selection: item[]) => {
  selectedItems.value = selection;
  totalAmount.value = selectedItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
}

//获取购物车数据
const fetchCartItems = async () => {
  try {
    isLoading.value = true;
    const res = await getCartItems();
    CartItems.value = res.data.data; // 假设返回的数据是一个数组

  } catch (error) {
    console.error('获取购物车数据失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 添加商品到购物车
const handleAddToCart = async (productId: string, quantity: number) => {
  try {
    await addProductToCart(productId, quantity);
    await fetchCartItems(); // 刷新购物车数据
  } catch (error) {
    console.error('添加商品失败:', error);
  }
};

// 删除购物车中的商品
const handleDeleteCartItem = async (cartItemId: string) => {
  try {
    await deleteProductFromCart(cartItemId);
    await fetchCartItems(); // 刷新购物车数据
  } catch (error) {
    console.error('删除商品失败:', error);
  }
};

// 更新购物车中商品的数量
// const handleUpdateCartItem = async (cartItemId: string, quantity: number) => {
//   try {
//     await updateCartItem(cartItemId, quantity);
//     await fetchCartItems(); // 刷新购物车数据
//   } catch (error) {
//     console.error('更新商品数量失败:', error);
//   }
// };
const handleUpdateCartItem = async (cartItemId: string, quantity: number) => {
  updateCartItem(cartItemId, quantity) .then((res) => {
    if (res.data.code === '200') {
      ElMessage({
        message: '修改成功！',
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
}

const createOrder = () => {
  if (selectedItems.value.length === 0) {
    ElMessage({
      message: '请选择商品进行结算！',
      type: 'error',
      center: true,
    })
    return
  }
  sessionStorage.setItem('selectedItems', JSON.stringify(selectedItems.value))
  router.push({
    path: '/orderDetail',
  })
}

// 页面加载时获取购物车数据
onMounted(() => {
  fetchCartItems();
});
</script>

<template>
  <el-card class="box-card">
  <div class="cart-container">
    <h1>我的购物车</h1>


    <!-- 购物车为空 -->
    <div v-if="CartItems.length === 0" class="empty-cart">
      <p>您的购物车是空的。</p>
    </div>

    <!-- 购物车列表 -->
    <div v-else class="cart-items">
      <el-table :data="CartItems" style="width: 100%" @selection-change="handleSelectChange">
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
        <el-table-column prop="quantity" label="数量" width="200" >
          <template #default="scope">
            <el-input-number v-model="scope.row.quantity"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120">
          <template #default="scope">
            {{ (scope.row.quantity * scope.row.price).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作"width="120">
          <template #default="scope">
            <el-button type="text" @click="handleUpdateCartItem(scope.row.cartItemId, scope.row.quantity)">修改数量</el-button>
            <el-button type="text" style="color: red;" @click="handleDeleteCartItem(scope.row.cartItemId)">删除商品</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!--   结算按钮 -->
    <div v-if="CartItems.length > 0" class="submit">
      <span class="total-price">总价：￥{{ totalAmount }}</span>
      <el-button type="primary" @click="createOrder">去结算</el-button>
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
  text-align: end;
}

.total-price {
  margin-right: 440px;
  font-weight: bold;
  font-size: 18px;
  color: red;
}
</style>
