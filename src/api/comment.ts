//评论模块
import {COMMENTS_MODULE} from "./_prefix";
import {axios} from "../utils/request";


type addcomment = {
    userName: string,
    productId: number,
    score: number,
    content: string,
}

export const createComment = (commentInfo: addcomment) => {
    return axios.post(`${COMMENTS_MODULE}`, commentInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}


export const getCommentsByProductId=(productId: number) => {
    return axios.get(`${COMMENTS_MODULE}/${productId}`)
        .then(res => {
            return res
        })
}