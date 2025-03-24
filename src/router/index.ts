import {createRouter, createWebHashHistory} from "vue-router"

const router = createRouter({
    history: createWebHashHistory(),
    routes :[{
        path: "/",
        redirect: "/login"
    }, {
        path: "/login",
        component: () => import("../views/login/index.vue"),
        meta: {title: "用户登录"}
    }, {
        path: "/register",
        component: () => import("../views/register/index.vue"),
        meta: {title: "用户注册"}
    }]
})

router.beforeEach((to, from, next) => {})

export {router}