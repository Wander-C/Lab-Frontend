<script setup lang="ts">

import {computed, getCurrentInstance, ref} from "vue";
import {getPromotionById, updatePromotionInfo} from "../../api/promotions.ts";
import {UploadFilled, Promotion} from "@element-plus/icons-vue";
import {uploadImage} from "../../api/tools.ts";
import {getAllProduct, getProductById} from "../../api/products.ts";
import {claimCoupon, Coupon} from "../../api/coupons.ts";
import {router} from "../../router";

const role = sessionStorage.getItem('role')
const {proxy} = getCurrentInstance() as any
const promotionId = Number(proxy.$route.params.promotionId)

const title = ref('')
const description = ref('')
const imgUrl = ref('')
let startTime = ref('')
let endTime = ref('')
const discount = ref<number>(0)
const coupons = ref<Coupon[]>([])
const couponAmount = ref<number>(0)
const couponQuantity = ref<number>(0)
const couponMinAmount = ref<number>(0)
const isAddDisabled = computed(() => {
  return (couponAmount.value == 0 || couponAmount.value < 0 || couponAmount.value == null
      || couponQuantity.value == 0 || couponQuantity.value < 0 || couponQuantity.value == null
      || couponMinAmount.value == 0 || couponMinAmount.value < 0 || couponMinAmount.value == null)
})
const productIds = ref<number[]>([])

const duration = ref([startTime.value, endTime.value]);

const timeRemaining = ref('')

getPromotion(promotionId)
function  getPromotion(id: number) {
  getPromotionById(id).then((res) => {
    title.value = res.data.data.title
    description.value = res.data.data.description
    imgUrl.value = res.data.data.imgUrl
    startTime.value = res.data.data.startTime.split('.')[0].replace(' ', 'T')
    endTime.value = res.data.data.endTime.split('.')[0].replace(' ', 'T')
    discount.value = res.data.data.discount
    coupons.value = res.data.data.coupon
    productIds.value = res.data.data.productIds

    calculateTimeRemaining()
    duration.value = [startTime.value, endTime.value]
    startTime = computed(() => duration.value[0])
    endTime = computed(() => duration.value[1])
    getProductList()
  })
}

function calculateTimeRemaining() {
  const now = new Date();
  const start = new Date(startTime.value);
  const end = new Date(endTime.value); // 使用 trim() 去除隐藏字符

  if (start > now) {
    timeRemaining.value = "未开始";
    return;
  }
  if (end < now) {
    timeRemaining.value = "已结束";
    return;
  }

  const diff = end.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  timeRemaining.value = `${days}天${hours}小时`;
}

function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function handleUpload(file: any, fileList: any) {
  imgUrl.value = fileList
  let formData = new FormData()
  formData.append('file', file.raw)
  uploadImage(formData).then(res => {
    imgUrl.value = res.data.data
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
  imgUrl.value = ''
}

const productList = ref<any[]>([])
getProductList()
function getProductList() {
  Promise.all(
      productIds.value.map(id => getProductById(id))
  ).then(responses => {
    productList.value = responses
        .filter(res => res.data.code === "200")
        .map(res => res.data.data);
  });
}

const allProductsList = ref<any[]>([])
getAllProductsList()
function getAllProductsList() {
  getAllProduct().then(res => {
    allProductsList.value = res.data.data
  })
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

function updatePromotion() {
  updatePromotionInfo({
    id: promotionId,
    title: title.value,
    description: description.value,
    imgUrl: imgUrl.value,
    productIds: productIds.value,
    startTime: formatDate(new Date(startTime.value)),
    endTime: formatDate(new Date(endTime.value)),
    discount: discount.value,
    coupon: coupons.value,
  }).then( res => {
    if (res.data.code === "200") {
      ElMessage({
        message: '修改成功！',
        type: 'success',
        center: true,
      })
    } else if (res.data.code === "400" || res.data.code === "401"){
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

function addCoupon() {
  const newCoupon : Coupon = {
    amount: couponAmount.value,
    quantity: couponQuantity.value,
    startTime: formatDate(new Date(startTime.value)),
    endTime: formatDate(new Date(endTime.value)),
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

function handleClaimCoupon(amount: number) {
  claimCoupon(amount).then((res) => {
    if (res.data.code === '200') {
      ElMessage({
        message: '领取成功',
        type: 'success',
        center: true,
      })
      getPromotion(promotionId)
    } else if (res.data.code === '400' || res.data.code === '401') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}

function toProductDetail(productId: number) {
  router.push("/productDetail/" + productId.toString());
}
</script>

<template>
  <el-button v-if="role == 'admin'" type="primary" class="update" @click="updatePromotion">保存修改</el-button>
  <div class="promotion-detail">
    <div class="title-wrapper">
      <div v-if="role == 'user'" class="title-wrapper">
        <div class="title-container">
          <h1 class="title-main">{{ title }}</h1>
        </div>
        <span class="title-time" role="status">剩余{{ timeRemaining }}</span>
      </div>

      <div v-else >
        <el-row style="margin-bottom: 20px">
          <el-col :span="18">
            <span>标题</span>
            <el-input v-model="title" />
          </el-col>
        </el-row>
        <span class="title-time" role="status">剩余{{ timeRemaining }}</span>
      </div>
    </div>

    <div v-if="role == 'admin'">
      <el-row :gutter ="30">
        <el-col :span="10">
          <div>
            <el-image
                :src="imgUrl"
                :preview-src-list="[imgUrl]"
                fit="contain"
                class="main-image"
            />
            <h1 for="newCover">↓↓↓↓替换新封面↓↓↓↓</h1>
            <el-upload
                drag
                :limit="1"
                v-model:file="imgUrl"
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
          </div>
        </el-col>

        <el-col :span="14">
          <el-form label-position="top">
            <el-form-item label="起止时间">
              <el-date-picker
                  v-model="duration"
                  type="datetimerange"
                  range-separator="To"
                  start-placeholder="Start date"
                  end-placeholder="End date"
                  format="YYYY-MM-DD HH:mm:ss"
                  date-format="YYYY/MM/DD ddd"
                  time-format="A hh:mm:ss"
              />
            </el-form-item>

            <el-form-item label="内容">
              <el-input
                  v-model="description"
                  type="textarea"
                  :rows="4"
              />
            </el-form-item>

            <el-form-item label="折扣">
              <el-input v-model="discount" />
            </el-form-item>

            <el-form-item>
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <h3>优惠券</h3>
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

                    <el-col :span="1"></el-col>

                    <el-col :span="6">
                      <el-form-item label="优惠券数量" >
                        <el-input
                            v-model="couponQuantity"
                        />
                      </el-form-item>
                    </el-col>

                    <el-col :span="1"></el-col>

                    <el-col :span="6">
                      <el-form-item label="最低消费金额" >
                        <el-input
                            v-model="couponMinAmount"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="1"></el-col>

                    <el-col :span="3">
                      <el-button
                          type="primary"
                          @click="addCoupon"
                          :disabled="isAddDisabled"
                      >添加</el-button>
                    </el-col>

                  </el-row>

                  <el-divider/>

                  <el-form-item label="已有优惠券">
                    <el-table
                        :data="Array.from(coupons.values())"
                        max-height="200"
                    >
                      <el-table-column prop="amount" label="优惠券面值" show-overflow-tooltip>
                        <template #default="scope">
                          <el-input v-model="scope.row.amount"/>
                        </template>
                      </el-table-column>
                      <el-table-column prop="quantity" label="优惠券数量" show-overflow-tooltip>
                        <template #default="scope">
                          <el-input v-model="scope.row.quantity"/>
                        </template>
                      </el-table-column>
                      <el-table-column prop="minAmount" label="最低消费金额" show-overflow-tooltip>
                        <template #default="scope">
                          <el-input v-model="scope.row.minAmount"/>
                        </template>
                      </el-table-column>
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

          </el-form>

        </el-col>
      </el-row>
    </div>

    <div v-if="role == 'user'">
      <div>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-image
                :src="imgUrl"
                :preview-src-list="[imgUrl]"
                fit="contain"
                class="main-image"
            ></el-image>
          </el-col>
          <el-col :span="18">
            <el-form>
              <el-form-item>
                <el-text v-if="discount > 0" class="discount-tag">
                  <el-icon><Promotion /></el-icon>
                  全场优惠 {{ discount }}折！！！
                </el-text>
              </el-form-item>

              <el-form-item>
                <h1>领取优惠券</h1>
                <el-table :data="coupons" border>
                  <el-table-column prop="amount" label="面值"></el-table-column>
                  <el-table-column prop="quantity" label="剩余数量"></el-table-column>
                  <el-table-column prop="minAmount" label="最低消费金额"></el-table-column><el-table-column fixed="right" label="Operations" width="105">
                  <template #default="scope">
                    <el-button link type="danger" size="small" @click="handleClaimCoupon(scope.row.id)">
                      <el-tag >领取</el-tag>
                    </el-button>
                  </template>
                </el-table-column>

                </el-table>
              </el-form-item>
            </el-form>


          </el-col>
        </el-row>
      </div>
    </div>

    <el-card>
      <template #header>
        <div class="card-header">
          <h1>关联商品</h1>
          <el-select
              v-if="role == 'admin'"
              v-model="productIds"
              multiple
              placeholder="请选择产品"
              filterable
              remote
              reserve-keyword
              style="width: 80%"
          >
            <el-option
                v-for="item in allProductsList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
            />
          </el-select>
        </div>
      </template>
      <el-table :data="productList" height="700" @row-dblclick="(row) => toProductDetail(row.id)">
        <el-table-column prop="cover" label="封面" width="150">
          <template #default="scope">
            <el-image
                :src="scope.row.cover"
                :preview-src-list="[scope.row.cover]"
                fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="书名">
          <template #default="scope">
            <el-text tag="b">{{ scope.row.title }}</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="price" label="价格">
          <template #default="scope">
            <el-text tag="del">￥{{ scope.row.price }}</el-text>
            <el-text class="discount-price">￥{{ scope.row.discountPrice }}</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="rate" label="评分">
          <template #default="scope">
            <el-text class="value">{{ scope.row.rate }}</el-text>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


  </div>
</template>

<style scoped>
.promotion-detail {
  width: 70%;
  margin: 20px auto;
  padding: 20px;
  border: #ebeef5 1px solid;
}

.update{
  position: absolute;
  right: 50px;
  top: 100px;
  font-size: x-large;
}

/* 标题整体容器，设置为相对定位，用于包含绝对定位的时间标签 */
.title-wrapper {
  position: relative; /* 允许内部元素使用绝对定位 */
  width: 100%;        /* 宽度占满父容器 */
  padding: 0 0;    /* 上下内边距，增加标题区域的垂直空间感 */
}

/* 标题内容容器，使用 Flex 布局实现水平居中 */
.title-container {
  display: flex;
  justify-content: center; /* 水平居中标题 */
  align-items: center;     /* 垂直居中（如果有多行文本也适用） */
}

/* 主标题样式，促销活动名称 */
.title-main {
  font-size: 3rem;         /* 大字号，突出显示 */
  font-weight: bold;       /* 加粗字体增强视觉权重 */
  color: #333;             /* 深灰色文字，对比度高 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 轻微阴影提升可读性 */
  margin: 0;               /* 去除默认的 margin，避免布局偏移 */
}

/* 剩余时间标签样式，固定在右侧 */
.title-time {
  position: absolute;              /* 绝对定位，不参与文档流 */
  right: 20px;                     /* 距离右边 20px */
  top: 50%;                        /* 先定位到父容器一半位置 */
  transform: translateY(-50%); /* 再向上移动自身的一半高度 */

  font-size: 1.2rem;               /* 字体略小于主标题 */
  font-weight: 600;                /* 半粗体，比普通文字更显眼 */
  color: #ffffff;                  /* 白色文字，提高对比度 */
  background-color: red;          /* 红色背景，突出剩余时间状态 */
  padding: 6px 12px;               /* 内边距，让文字与背景之间有空隙 */
  border-radius: 6px;              /* 圆角边框，视觉更柔和 */
}

.main-image {
  width: 100%;
  height: 400px;
  border-radius: 8px;
}

.value {
  color: red;
  font-size: larger;
  font-weight: bold;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.discount-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-weight: bold;
  border-radius: 4px;
  font-size: 30px;
}

.discount-price {
  font-size: 20px;
  color: red;
  font-weight: bold;
}

</style>