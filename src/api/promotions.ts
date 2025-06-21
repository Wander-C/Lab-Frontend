import {Promotions_MODULE} from "./_prefix.ts";
import {axios} from "../utils/request.ts";
import {Coupon} from "./coupons.ts";

type promotionInfo = {
    title: string,
    description: string,
    imgUrl: string,
    startTime: string,
    endTime: string,
    discount?: number,
    coupon?: Coupon[],
    productIds: number[],
}

type promotionInfoUpdate = {
    id: number,
    title: string,
    description: string,
    imgUrl: string,
    startTime: string,
    endTime: string,
    discount?: number,
    coupon?: Coupon[],
    productIds: number[],
}

export const createPromotion = (promotionInfo: promotionInfo) => {
    return axios.post(`${Promotions_MODULE}`, promotionInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

export const getAllPromotions = () => {
    return axios.get(`${Promotions_MODULE}`)
        .then(res => {
            return res
        })
}

export const getProducts = () => {
    return axios.get(`${Promotions_MODULE}/products`)
        .then(res => {
            return res
        })
}

export const getPromotionById = (id: number) => {
    return axios.get(`${Promotions_MODULE}/${id}`)
        .then(res => {
            return res
        })
}

export const updatePromotionInfo = (promotionInfoUpdate: promotionInfoUpdate) => {
    return axios.put(`${Promotions_MODULE}`, promotionInfoUpdate,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

export const deletePromotionById = (id: number) => {
    return axios.delete(`${Promotions_MODULE}/${id}`)
        .then(res => {
            return res
        })
}