import {API_MODULE} from "./_prefix.ts";
import {axios} from "../untils/request.ts";

export const uploadImage = (payload: any) => {
    return axios.post(`${API_MODULE}/images`, payload,
        {headers: {'Content-Type': 'multipart/form-data'}})
        .then(res => {
            return res
        })
}