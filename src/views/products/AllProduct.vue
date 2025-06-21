<script setup lang="ts">
import { ref } from "vue";
import ProductItem from "../../components/ProductItem.vue";
import {getAllProduct, search} from "../../api/products.ts";
import {router} from "../../router";
import {deleteAdvertisementById, getAllAdvertisements} from "../../api/advertisements.ts";
import {parseRole} from "../../utils";
import {Close} from "@element-plus/icons-vue";
import {deleteCategory, getAllCategory, getProducts} from "../../api/category.ts";
import {getAllPromotions} from "../../api/promotions.ts";


const role = sessionStorage.getItem("role");

const AdList = ref<any[]>([])
getAllAdvertisements().then(res => {
    AdList.value = res.data.data
})

const productList = ref<any[]>([])
getAllProduct().then(res => {
    productList.value = res.data.data
})

const promotionList = ref<any[]>([])
getAllPromotions().then(res => {
  promotionList.value = res.data.data
})

const categories = ref<{id: number, name: string}[]>([])
getAllCategory().then(res => {
  categories.value = [{ id: 0, name: '全部' }, ...res.data.data]
})
const activeCategory = ref('0')  // 默认选中“全部”

function handleCategorySelect(index: string) {
  activeCategory.value = index
  if (index === '0') {
    getAllProduct().then(res => {
      productList.value = res.data.data
    })
  } else {
    getProducts(Number(index)).then(res => {
      productList.value = res.data.data
    })
  }
}

function toProductDetail(productId: number) {
    router.push("/productDetail/" + productId.toString());
}

function toAdvertisementDetail(adId: number) {
  router.push("/advertisementDetail/" + adId.toString());
}

function toPromotionDetail(promotionId: number) {
  router.push("/promotionDetail/" + promotionId.toString());
}

function isDelete(adId: number) {
  ElMessageBox.confirm('确定删除该广告吗？', '提示', {
    customClass: "customDialog",
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    showClose: false,
    roundButton: true,
    center: true,
  }).then(() => {
    deleteAdvertisementById(adId).then(res => {
      if (res.data.code === '200') {
        ElMessage({
          message: '删除成功',
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
  })
}

function isDeleteC(categoryId: number) {
  ElMessageBox.confirm('确定删除该分类吗？', '提示', {
    customClass: "customDialog",
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    showClose: false,
    roundButton: true,
    center: true,
  }).then(() => {
    deleteCategory(categoryId).then(res => {
      if (res.data.code === '200') {
        ElMessage({
          message: '删除成功',
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
  })
  window.location.reload()
}

const searchKeyword = ref('')
function handleSearch() {
  if (searchKeyword.value === '') {
    getAllProduct().then(res => {
      productList.value = res.data.data
    })
  }else {
    search(searchKeyword.value).then(res => {
      productList.value = res.data.data
    })
  }

}

function sortByPrice() {
  // 切换排序状态（升序/降序）
  const isAscending = !productList.value.some((item, i) => i > 0 && item.price < productList.value[i - 1].price);

  productList.value.sort((a, b) => {
    if (isAscending) {
      return a.price - b.price; // 升序
    } else {
      return b.price - a.price; // 降序
    }
  });
}

function sortByRate() {
  // 切换排序状态（升序/降序）
  const isAscending = !productList.value.some((item, i) => i > 0 && item.rate < productList.value[i - 1].rate);

  productList.value.sort((a, b) => {
    if (isAscending) {
      return a.rate - b.rate; // 升序
    } else {
      return b.rate - a.rate; // 降序
    }
  });
}
</script>

<template>
  <el-container style="height: 100vh; border: 1px solid #ccc;">
    <el-aside class="cart-aside">
      <el-menu
          class="cart-menu"
          default-active=activeCategory.value
          background-color="#8B7355"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleCategorySelect"
      >
        <el-menu-item
            v-for="category in categories"
            :key="category.id"
            :index="category.id.toString()"
            style="--el-menu-item-padding: 0"
        >
          <div
              style="display: flex; align-items: center; width: 100%; padding: 0 20px;"
          >
            <span>{{ category.name }}</span>
            <el-icon v-if="parseRole(role) === '管理员'&& category.name !== '全部'" class="close-icon" @click.stop="isDeleteC(Number(category.id)) ">
              <el-tooltip content="删除" placement="top">
                <Close />
              </el-tooltip>
            </el-icon>
          </div>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="background-color: #f0f2f5;">
      <div class="search-container">
        <el-input
            v-model="searchKeyword"
            placeholder="搜索商品名称"
            clearable
        >
          <template #append>
            <el-button style="background: red; color: white" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <div class="ad-promotion-container">
        <div v-if="AdList.length > 0" class="advertisement">
          <el-carousel style="width: 700px">
            <el-carousel-item v-for="ad in AdList" :key="ad.id" @dblclick="toAdvertisementDetail(ad.id)">
              <img :src="ad.imgUrl" alt="广告图片" class="advertisement-image"/>
              <el-icon v-if="parseRole(role) === '管理员'" class="close-icon" @click="isDelete(ad.id)">
                <el-tooltip content="删除" placement="top">
                  <Close />
                </el-tooltip>
              </el-icon>
            </el-carousel-item>
          </el-carousel>
        </div>

        <div v-if="promotionList.length > 0" class="advertisement">
          <el-carousel style="width: 500px">
            <el-carousel-item v-for="promotion in promotionList" :key="promotion.id" @dblclick="toPromotionDetail(promotion.id)">
              <img :src="promotion.imgUrl" alt="促销图片" class="promotion-image"/>
              <el-icon v-if="parseRole(role) === '管理员'" class="close-icon" @click="isDelete(promotion.id)">
                <el-tooltip content="删除" placement="top">
                  <Close />
                </el-tooltip>
              </el-icon>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <div>
        <el-checkbox class="checkbox" @change="sortByPrice">按价格排序</el-checkbox>
        <el-checkbox class="checkbox" @change="sortByRate">按评分排序</el-checkbox>
      </div>

      <div class="allProduct">
        <ProductItem
            v-for="product in productList"
            :product="product"
            :key="product.id"
            @dblclick="toProductDetail(Number(product.id))"
            class="productItem"
        />
      </div>
    </el-main>
  </el-container>
</template>


<style scoped>

.ad-promotion-container {
  display: flex;
  align-items: flex-start; /* 上边缘对齐 */
  justify-content: space-around; /* 水平分布 */
  gap: 20px; /* 两者之间的间距 */
  margin-top: 10px;
}

.advertisement {
  margin-top: 10px;
  display: flex;
}

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

.advertisement-image {
  width: 700px;
  height: 300px;
  margin-top: 10px;
}

.promotion-image {
  width: 500px;
  height: 300px;
  margin-top: 10px;
}

.close-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  z-index: 10;
  font-size: 30px;
  color: red;
}

.search-container {
  text-align: center;
  width: 60%;
  margin: 10px auto;
  display: flex;
}

.cart-aside  {

  width:200px;
  background-color: #8B7355;
  color: white;
}

.checkbox {
  margin-top: 20px;
  margin-left: 20px;
}
</style>