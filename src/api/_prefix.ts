//总api
export const API_MODULE = '/api'

//用户模块
export const ACCOUNTS_MODULE = `${API_MODULE}/accounts`

//商品模块
export const PRODUCTS_MODULE = `${API_MODULE}/products`
export const STOCKS_MODULE = `${PRODUCTS_MODULE}/stockpile`

//购物车模块
export const CART_MODULE = `${API_MODULE}/cart`

//订单模块
export const ORDER_MODULE = `${API_MODULE}/orders`

//广告模块
export const ADVERTISEMENTS_MODULE = `${API_MODULE}/advertisements`

//活动模块
export const Promotions_MODULE = `${API_MODULE}/promotions`

//评论模块
export const COMMENTS_MODULE = `${API_MODULE}/comments`

//分类模块
export const CATEGORIES_MODULE = `${API_MODULE}/category`

//优惠券模块
export const COUPONS_MODULE = `${API_MODULE}/coupons`