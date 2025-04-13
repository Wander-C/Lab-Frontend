// 用户模块
import{ACCOUNTS_MODULE} from "./_prefix";
import {axios} from "../utils/request";

type RegisterInfo = {
    username: string,    // 用户名, 必须唯一
    password: string,    // 密码，仅可写入，无法获取
    name: string,        // 真实姓名
    avatar?: string,     // 头像URL
    role: string,        // 用户身份区分，分管理员和普通用户
    telephone?: string,  // 手机号， 格式必须为 1xxxxxxxxx
    email?: string,      // 邮箱，必须符号邮箱格式
    location?: string,   // 位置
}

type LoginInfo = {
    username: string,    // 用户名
    password: string,    // 密码
}

type UpdateInfo = {
    username: string,    // 用户名
    password?: string,   // 密码，
    name?: string,       // 真实姓名
    avatar?: string,     // 头像URL
    telephone?: string,  // 手机号， 格式必须为 1xxxxxxxxx
    email?: string,      // 邮箱，必须符号邮箱格式
    location?: string,   // 位置
}

export const accountsRegister = (registerInfo: RegisterInfo) => {
    return axios.post(`${ACCOUNTS_MODULE}`, registerInfo,
    {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}
export const accountsLogin = (loginInfo: LoginInfo) => {
    return axios.post(`${ACCOUNTS_MODULE}/login`, loginInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

export const accountsUpdate = (updateInfo: UpdateInfo) => {
    return axios.put(`${ACCOUNTS_MODULE}`, updateInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}

export const accountsGet = (username: string) => {
    return axios.get(`${ACCOUNTS_MODULE}/${username}`)
        .then(res => {
            return res
        })
}