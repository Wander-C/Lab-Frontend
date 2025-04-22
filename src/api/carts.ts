import {CART_MODULE} from "./_prefix.ts";
import {axios} from "../utils/request.ts";

// 收货人信息,自定义，后续可添加
type consigneeInfo = {
    name: string,
    phone: string,
    address: string,
}

// 订单信息
type checkoutInfo = {
    cartItemIds: number[],
    shipping_address: consigneeInfo,
    payment_method: string,
}
export type item ={
    cartItemId: number,
    productId: number,
    title: string,
    price: number,
    description: string,
    cover: string,
    detail: string,
    quantity: number, //该商品加购数量
}

export type Cart = {
    items: item[],
    total: number,
    totalAmount: number,
}
// 添加商品到购物车
export const addProductToCart = (productId: string, quantity: number) => {
    return axios.post(`${CART_MODULE}/`, {productId: productId, quantity: quantity},
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        }
    )
}

// 从购物车中删除商品
export const deleteProductFromCart = (cartItemId: string) => {
    return axios.delete(`${CART_MODULE}/${cartItemId}`)
        .then(res => {
            return res
        }
    )
}

// 修改购物车中商品的数量
export const updateCartItem = (cartItemId: string, quantity: number) => {
    return axios.patch(`${CART_MODULE}/${cartItemId}`, {quantity: quantity},
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

// 获取购物车中所有商品
export const getCartItems = () => {
    return axios.get(`${CART_MODULE}/`)
        .then(res => {
            return res
        })
}

// 提交订单
export const checkout = (checkoutInfo: checkoutInfo) => {
    return axios.post(`${CART_MODULE}/checkout`, checkoutInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}
