import {PRODUCTS_MODULE} from "./_prefix.ts";
import {axios} from "../untils/request";

type productInfo = {
    title: string,
    price: number,
    rate: number,           // 评分,0~10
    description?: string,   // 描述
    cover?: string,         // 封面URL
    detail?: string,        // 详细说明
    specification?: Set<string>,    // 规格说明
}

type productInfoUpdate = {
    id: string,
    title: string,
    price: number,
    rate: number,           // 评分,0~10
    description?: string,   // 描述
    cover?: string,         // 封面URL
    detail?: string,        // 详细说明
    specification?: Set<string>,    // 规格说明
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

export const updateProductInfo = (productInfoUpdate: productInfoUpdate) => {
    return axios.put(`${PRODUCTS_MODULE}`, productInfoUpdate,
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