// 引入路由对象
import { createRouter,createWebHashHistory } from "vue-router";
// 路由配置.vue不可省略
const routes = [
    {
        path:'/',
        name: 'home',
        meta:{
            title:'首页'
        },
        component:()=> import('../components/Home.vue'),
        redirect: '/welcome',
        children: [
            {
                name:'welcome',
                path:'/welcome',
                meta: {
                    title:'欢迎页'
                },
                component:()=> import('../views/Welcome.vue')
            }
        ]
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '登录页'
        },
        component:() => import('../views/Login.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router