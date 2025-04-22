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
        redirect: '/allProduct',
        component: () => import('../views/Home.vue'),
        children: [{
            path: '/dashboard',
            component: () => import('../views/users/Dashboard.vue'),
        }, {
            path: '/allProduct',
            component: () => import('../views/products/AllProduct.vue'),
        }, {
            path: '/createProduct',
            component: () => import('../views/products/CreateProduct.vue'),
        }, {
            path: '/productDetail/:productId',
            component: () => import('../views/products/ProductDetail.vue'),
        },{
            path: '/cart',
            component: () => import('../views/users/Cart.vue'),
        }, {
            path: '/CreateAdvertisement',
            component: () => import('../views/advertisement/CreateAdvertisement.vue'),
        }, {
            path: '/orderDetail',
            component: () => import('../views/orders/OrderDetail.vue'),
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
