import {ADVERTISEMENTS_MODULE} from "./_prefix.ts";
import {axios} from "../utils/request.ts";

type updateAdInfo = {
    id: string,
    title?: string,
    content?: string,
    imgUrl?: string,
    productIds: number[],
}

type createAdInfo = {
    title: string,
    content: string,
    imgUrl: string,
    productIds: number[],
}

// 获取所有广告信息
export const getAllAdvertisements = () => {
    return axios.get(`${ADVERTISEMENTS_MODULE}`)
        .then(res => {
            return res
        })
}

// 更新广告信息
export const updateAdvertisementInfo = (adInfo: updateAdInfo) => {
    return axios.put(`${ADVERTISEMENTS_MODULE}`, adInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

// 创建广告信息
export const createAdvertisement = (adInfo: createAdInfo) => {
    return axios.post(`${ADVERTISEMENTS_MODULE}`, adInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

// 删除广告
export const deleteAdvertisementById = (id: number) => {
    return axios.delete(`${ADVERTISEMENTS_MODULE}/${id}`)
        .then(res => {
            return res
        })
}

// 获取指定广告信息
export const getAdvertisementById = (id: number) => {
    return axios.get(`${ADVERTISEMENTS_MODULE}/${id}`)
        .then(res => {
            return res
        })
}