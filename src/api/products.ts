// 商品模块
import {PRODUCTS_MODULE} from "./_prefix.ts";
import {STOCKS_MODULE} from "./_prefix.ts";
import {axios} from "../utils/request";

type specificationInfo = {
    id: string,         // 规格ID
    item: string,       // 规格名称
    value: string,      // 规格内容
    productId: string,  // 规格必须属于指定商品
}

type productInfo = {
    title: string,
    price: number,
    rate: number,           // 评分,0~10
    description?: string,   // 描述
    cover?: string,         // 封面URL
    detail?: string,        // 详细说明
    specification?: Set<specificationInfo>,    // 规格说明,为集合，一个商品可以对应多个规格
}

type productInfoUpdate = {
    id: string,
    title: string,
    price: number,
    rate: number,           // 评分,0~10
    description?: string,   // 描述
    cover?: string,         // 封面URL
    detail?: string,        // 详细说明
    specification?: Set<specificationInfo>,    // 规格说明
}

type stockpileInfo = {
    productId: string,  // 商品ID
    amount: number,     // 库存数量
}

export const getAllProduct = () => {
    return axios.get(`${PRODUCTS_MODULE}`)
        .then(res => {
            return res
        })
}

export const getProductById = (id: number) => {
    return axios.get(`${PRODUCTS_MODULE}/${id}`)
        .then(res => {
            return res
        })
}

export const createProduct = (productInfo: productInfo) => {
    return axios.post(`${PRODUCTS_MODULE}`, productInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

export const updateProductInfo = (id : number ,productInfoUpdate: productInfoUpdate) => {
    return axios.put(`${PRODUCTS_MODULE}/${id}`, productInfoUpdate,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

export const deleteProductById = (id: number) => {
    return axios.delete(`${PRODUCTS_MODULE}/${id}`)
        .then(res => {
            return res
        })
}

export const adjustStockpile = (stockpileInfo: stockpileInfo) => {
    return axios.patch(`${STOCKS_MODULE}/${stockpileInfo.productId}`, stockpileInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

export const getStockpileById = (productId: number) => {
    return axios.get(`${STOCKS_MODULE}/${productId}`)
        .then(res => {
            return res
        })
}
