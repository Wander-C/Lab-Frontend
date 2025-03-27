import {createRouter, createWebHashHistory} from "vue-router"

const router = createRouter({
    history: createWebHashHistory(),
    routes :[{
        path: '/',
        redirect: '/login'
    }, {
        path: '/login',
        component: () => import('../views/users/Login.vue'),
        meta: {title: "用户登录"}
    }, {
        path: '/register',
        component: () => import('../views/users/Register.vue'),
        meta: {title: "用户注册"}
    }, {
        path: '/home',
        redirect: '/dashboard',
        component: () => import('../views/Home.vue'),
        children: [{
            path: '/dashboard',
            component: () => import('../views/users/Dashboard.vue'),
        }]
    }]
})

router.beforeEach((to, _, next) => {
    const token: string | null = sessionStorage.getItem('token');
    const role: string | null = sessionStorage.getItem('role')

    if (to.meta.title) {
        document.title = to.meta.title
    }

    if (token) {
        if (to.meta.permission) {
            if (to.meta.permission.includes(role!)) {
                next()
            } else {
                next('/404')
            }
        } else {
            next()
        }
    } else {
        if (to.path === '/login') {
            next();
        } else if (to.path === '/register') {
            next()
        } else {
            next('/login')
        }
    }
})

export {router}