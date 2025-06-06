import {CATEGORIES_MODULE} from "./_prefix.ts";
import {axios} from "../utils/request.ts";



export const createCategory = (name: string) => {
    return axios.post(`${CATEGORIES_MODULE}/create`, null,
        {params: {name: name}})
        .then(res => {
            return res
        })
}

export const getAllCategory = () => {
    return axios.get(`${CATEGORIES_MODULE}/allCategories`)
        .then(res => {
            return res
        })
}

export const getProducts = (categoryId:number) => {
    return axios.get(`${CATEGORIES_MODULE}/getProductsByCategory`,
        {params:{categoryId:categoryId}})
        .then(res => {
            return res
        })
}

export const getCategory = (productId:number) => {
    return axios.get(`${CATEGORIES_MODULE}/getCategoriesByProduct/`,
        {params:{productId:productId}})
}

export const addCategory = (categoryId:number,productId:number) => {
    return axios.post(`${CATEGORIES_MODULE}/addProduct2Category`,null,
        {params:{categoryId:categoryId,productId:productId}})

}

export const removeCategory = (categoryId:number,productId:number) => {
    return axios.post(`${CATEGORIES_MODULE}/removeProductFromCategory`,null,
        {params:{categoryId:categoryId,productId:productId}})
}

export const deleteCategory = (id:number) => {
    return axios.post(`${CATEGORIES_MODULE}/delete`,
        null,{params:{id:id}})
}