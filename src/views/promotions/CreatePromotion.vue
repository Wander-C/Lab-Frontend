<script setup lang="ts">
import {ref, computed} from "vue";
import {UploadFilled} from "@element-plus/icons-vue";
import {uploadImage} from "../../api/tools.ts";
import {createPromotion} from "../../api/promotions.ts";
import {getAllProduct} from "../../api/products.ts";
import {router} from "../../router";
import {Coupon} from "../../api/coupons.ts";

const  promotionTitle = ref("")
const promotionDescription = ref("")
const promotionImageUrl = ref("")
const promotionImageList = ref([])

const now  = new Date()
const promotionDuration = ref<[Date, Date]>([now, now])
const promotionStartTime = computed(() => promotionDuration.value[0])
const promotionEndTime = computed(() => promotionDuration.value[1])

const couponAmount = ref<number>(0)
const couponQuantity = ref<number>(0)
const couponMinAmount = ref<number>(0)
const coupons = ref<Coupon[]>([])
const isAddDisabled = computed(() => {
  return (couponAmount.value == 0 || couponAmount.value < 0 || couponAmount.value == null
      || couponQuantity.value == 0 || couponQuantity.value < 0 || couponQuantity.value == null
      || couponMinAmount.value == 0 || couponMinAmount.value < 0 || couponMinAmount.value == null)
})

const promotionDiscount = ref<number>(0)

const promotionProductIds = ref<number[]>([])

const productList = ref()
getAllProduct().then(res => {
  productList.value = res.data.data
})

function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function handleUpload(file: any, fileList: any) {
  promotionImageList.value = fileList
  let formData = new FormData()
  formData.append('file', file.raw)
  uploadImage(formData).then(res => {
    promotionImageUrl.value = res.data.data
  })
}

function handleExceed() {
  ElMessage({
    message: '最多只能上传一张图片',
    type: 'error',
    center: true,
  })
}

function handleRemove(){
  promotionImageUrl.value = ''
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function handleCreatePromotion() {
  createPromotion({
    title: promotionTitle.value,
    description: promotionDescription.value,
    imgUrl: promotionImageUrl.value,
    startTime: formatDate(promotionStartTime.value),
    endTime: formatDate(promotionEndTime.value),
    discount: promotionDiscount.value,
    coupon: coupons.value,
    productIds: promotionProductIds.value,
  }).then((res) => {
    if (res.data.code === "200") {
      ElMessage({
        message: '创建成功！',
        type: 'success',
        center: true,
      })
      router.push({path: '/allProduct'})
    } else if (res.data.code === "400" || res.data.code === "401") {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

const createDisabled = computed(() => {
  return !(promotionTitle.value && promotionDescription.value && promotionImageUrl.value && promotionStartTime.value
      && promotionEndTime.value && promotionProductIds.value.length > 0)
})

function addCoupon() {
  const newCoupon : Coupon = {
    amount: couponAmount.value,
    quantity: couponQuantity.value,
    startTime: formatDate(promotionStartTime.value),
    endTime: formatDate(promotionEndTime.value),
    minAmount: couponMinAmount.value,
  }
  coupons.value.push(newCoupon)
  couponAmount.value = 0
  couponQuantity.value = 0
  couponMinAmount.value = 0
}

function handleDeleteCoupon(amount : number) {
  const couponToDelete = Array.from(coupons.value).find((coupon) => coupon.amount === amount)
  if (couponToDelete) {
    coupons.value.splice(coupons.value.indexOf(couponToDelete), 1)
  }
}

</script>

<template>
  <el-main  class="main-frame bgimage">
    <el-card class="login-card">
      <div>
        <h1>创建活动</h1>
        <el-form label-position="top">
          <el-row>
            <el-col :span="16">
              <el-form-item label="活动名称" required>
                <el-input placeholder="请输入活动名称" v-model="promotionTitle"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="2"/>

            <el-col :span="6">
              <el-form-item label="折扣">
                <el-input v-model="promotionDiscount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="活动对象" required>
            <el-select
                v-model="promotionProductIds"
                multiple
                placeholder="请选择产品"
                filterable
                remote
                reserve-keyword
            >
              <el-option
                  v-for="item in productList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="活动内容" required>
            <el-input placeholder="请输入活动内容" v-model="promotionDescription"></el-input>
          </el-form-item>

          <el-form-item label="起止时间" required>
            <el-date-picker
                v-model="promotionDuration"
                type="datetimerange"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
                format="YYYY-MM-DD HH:mm:ss"
                date-format="YYYY/MM/DD ddd"
                time-format="A hh:mm:ss"
            />
          </el-form-item>

          <el-form-item>
            <el-card shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>优惠券</h3>
                  <el-button
                      type="primary"
                      @click="addCoupon"
                      :disabled="isAddDisabled"
                  >添加优惠券</el-button>
                </div>
              </template>
              <el-form label-position="top">
                <el-row>
                  <el-col :span="6">
                    <el-form-item label="优惠券面值" >
                      <el-input
                          v-model="couponAmount"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="2"></el-col>

                  <el-col :span="6">
                    <el-form-item label="优惠券数量" >
                      <el-input
                          v-model="couponQuantity"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="2"></el-col>

                  <el-col :span="6">
                    <el-form-item label="最低消费金额" >
                      <el-input
                          v-model="couponMinAmount"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item>
                  <label>已添加优惠券</label>
                  <el-table
                      :data="Array.from(coupons.values())"
                      border
                      max-height="200"
                  >
                    <el-table-column prop="amount" label="优惠券面值" show-overflow-tooltip/>
                    <el-table-column prop="quantity" label="优惠券数量" show-overflow-tooltip/>
                    <el-table-column prop="minAmount" label="最低消费金额" show-overflow-tooltip/>
                    <el-table-column fixed="right" label="Operations" width="105">
                      <template #default="scope">
                        <el-button link type="danger" size="small" @click="handleDeleteCoupon(scope.row.amount)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>

              </el-form>
            </el-card>
          </el-form-item>


          <el-form-item label="活动Url" required>
            <el-input
                v-model="promotionImageUrl"
                placeholder="活动Url"
                disabled
            >
            </el-input>
          </el-form-item>

          <el-upload
              drag
              :limit="1"
              v-model:file="promotionImageList"
              :http-request="uploadHttpRequest"
              :on-change="handleUpload"
              :on-exceed="handleExceed"
              :on-remove="handleRemove"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Drop file here or <em>click to upload</em>
            </div>
          </el-upload>

          <span class="button-group">
            <el-button type="primary"
                       @click="handleCreatePromotion"
                       :disabled="createDisabled"
            >创建</el-button>
            <el-button @click="$router.push('/allProduct')">返回</el-button>
          </span>
        </el-form>
      </div>
    </el-card>
  </el-main>
</template>

<style scoped>
.main-frame {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.bgimage {
  background-image: url("../../assets/shopping-1s-1084px.svg");
}

.login-card {
  width: 60%;
  padding: 10px;
}

.button-group {
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  justify-content: right;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>