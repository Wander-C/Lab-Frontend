import {ORDER_MODULE} from "./_prefix.ts";
import {axios} from "../utils/request.ts";

// 支付订单
export const payOrder = (orderId: number) => {
    return axios.post(`${ORDER_MODULE}/${orderId}/pay`)
        .then(res => {
            return res
        })
}