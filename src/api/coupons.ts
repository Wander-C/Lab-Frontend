import {COUPONS_MODULE} from "./_prefix.ts";
import {axios} from "../utils/request";

export type Coupon = {
    amount: number,
    quantity: number,
    startTime: string,
    endTime: string,
    status: string,
    accountId: number,
    minAmount: number,
}

type useCoupon = {
    couponId: number,
    orderAmount: number,
}
// 发放优惠券
export const issueCoupon = (couponInfo: Coupon) => {
    return axios.post(`${COUPONS_MODULE}/issue`, couponInfo,
        {headers: {"Content-Type": "application/json"}})
        .then(res => {
            return res
        })
}

// 领取优惠券
export const claimCoupon = (couponId: number) => {
    return axios.post(`${COUPONS_MODULE}/${couponId}/claim`)
        .then(res => {
        return res
    })
}

// 获取用户优惠券
export const getUserCoupons = () => {
    return axios.get(`${COUPONS_MODULE}/user`)
        .then(res => {
            return res
        })
}

// 使用优惠券
export const useCoupon = (useCoupon: useCoupon) => {
    return axios.put(`${COUPONS_MODULE}/use`, useCoupon,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

// 获取可用优惠券
export const getAvailableCoupons = () => {
    return axios.get(`${COUPONS_MODULE}/available`)
        .then(res => {
            return res
        })
}