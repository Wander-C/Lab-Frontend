<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {item} from "../../api/carts.ts";
import { checkout } from "../../api/carts.ts";
import { payOrder } from "../../api/orders.ts";
import {router} from "../../router";
import {getUserCoupons} from "../../api/coupons.ts";

onMounted(() => {})

const showPaymentForm = ref(false)

const selectedItems = JSON.parse(sessionStorage.getItem('selectedItems')  || '[]')
const cartItemsIds = selectedItems.map((item: item) => item.cartItemId)
const totalAmount = selectedItems.reduce((total: number, item: item) => total + item.price * item.quantity, 0)
const name = ref('')
const phone = ref('')
const address = ref('')
const paymentMethod = ref('')
const orderId = ref('')
const paymentForm = ref('')
const coupons = ref<any[]>([])
const coupon = ref<number>(0)

getCoupons()
function getCoupons() {
  getUserCoupons().then((res) => {
    coupons.value = res.data.data
  })
}

const isDisabled = () => {
  return !(name.value && phone.value && address.value && paymentMethod.value)
}

function handleCheckout() {
  checkout({
    cartItemIds: cartItemsIds,
    shipping_address: {
      name: name.value,
      phone: phone.value,
      address: address.value,
    },
    payment_method: paymentMethod.value,
  }).then((res) => {
    if (res.data.code === '200') {
      ElMessage({
        message: '订单提交成功!',
        type: 'success',
        center: true,
      })
      orderId.value = res.data.data.orderId
      showPaymentForm.value = true
    } else if (res.data.code === '400' || res.data.code === '401') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

function handlePayOrder() {
  payOrder(
      Number(orderId.value)
  ).then((res) => {
    if (res.data.code === '200') {
      ElMessageBox.alert('支付成功！', {
        center: true,
        confirmButtonText: '确定',
        callback() {
          router.push('/cart')
        }
      })
      paymentForm.value = res.data.data.paymentForm
    } else if (res.data.code === '400' || res.data.code === '401') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
})
}

</script>

<template>
  <el-main class="order-detail">
    <div>
      <el-row>
        <h1>结算订单</h1>
      </el-row>
    </div>

    <el-divider/>

    <div>
      <h3>收货信息</h3>
      <el-form>
        <el-row>
          <el-col :span="16">
            <el-form-item label="收货人">
              <el-input
                  v-model="name"
                  placeholder="请输入收货人姓名"
              />
            </el-form-item>
          </el-col>

          <el-col :span="2"/>
          <el-col :span="6">
            <el-form-item label="支付方式">
              <el-select v-model="paymentMethod" placeholder="请选择支付方式">
                <el-option label="ALIPAY" value="ALIPAY"></el-option>
                <el-option label="微信" value="微信"></el-option>
                <el-option label="货到付款" value="货到付款"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="手机号">
          <el-input
              v-model="phone"
              placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input
              v-model="address"
              placeholder="请输入收货地址"
          />
        </el-form-item>
      </el-form>
    </div>

    <el-divider/>

    <div style="margin-bottom: 20px">
      <el-row justify="space-between" align="middle">
        <h3>商品信息</h3>
        <el-button type="text" @click="$router.push('/cart')">
          返回购物车
        </el-button>
      </el-row>
      <el-table :data="selectedItems" border>
        <el-table-column prop="cover" label="商品封面">
          <template #default="scope">
            <el-image
                :src="scope.row.cover"
                :preview-src-list="[scope.row.cover]"
                fit="contain"
                class="main-image"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="quantity" label="数量"></el-table-column>
        <el-table-column prop="total" label="小计">
          <template #default="scope">
            <span class="total">￥{{scope.row.price * scope.row.quantity}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-row justify="end">
      <span class="total-price">总价：￥{{ totalAmount }}</span>
      <el-select
          v-model="coupon"
          placeholder="请选择优惠券"
          style="width: 200px;"
          clearable
          @change="totalAmount = totalAmount - coupon"
      >
        <el-option
            v-for="coupon in coupons"
            :key="coupon.id"
            :label="coupon.amount"
            :value="coupon.amount"
        />
      </el-select>
    </el-row>
    <el-row justify="end" style="margin-top: 10px">
      <el-button
          type="primary"
          :disabled="isDisabled()"
          @click="handleCheckout"
      >提交订单</el-button>
    </el-row>

    <el-dialog v-model="showPaymentForm" width="30%">
      <h2>订单已提交，请尽快付款！</h2>
      <el-form>
        <el-form-item label="应付金额">
          <span class="total">￥{{ totalAmount }}</span>
        </el-form-item>
        <el-form-item label="支付方式">
          <span class="total">{{ paymentMethod }}</span>
        </el-form-item>
        <el-form-item label="订单号">
          <span class="total">{{ orderId }}</span>
        </el-form-item>
          {{paymentForm}}
        <el-form-item>
          <el-button type="primary" @click="showPaymentForm = false">取消</el-button>
          <el-button type="primary" @click="handlePayOrder">立即支付</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </el-main>
</template>

<style scoped>
.order-detail {
  width: 80%;
  justify-content: center;
  margin: 0 auto;
}

.total {
  color: red;
  font-weight: bold;
  font-size: 20px;
}

.total-price {
  font-size: 20px;
  margin-right: 20px;
  font-weight: bold;
  color: red;
}
</style>