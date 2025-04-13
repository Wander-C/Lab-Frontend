import {API_MODULE} from "./_prefix.ts";
import {axios} from "../utils/request.ts";

export const uploadImage = (payload: any) => {
    return axios.post(`${API_MODULE}/images`, payload,
        {headers: {'Content-Type': 'multipart/form-data'}})
        .then(res => {
            return res
        })
}