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
            },
            {
                name:'system',
                path:'/system',
                meta: {
                    title:'系统管理'
                },
                component:()=> import('../views/index.vue'),
                children: [
                    {
                        name:'user',
                        path:'/system/user',
                        meta: {
                            title:'用户管理'
                        },
                        component:()=> import('../views/User.vue')
                    },
                    {
                        name:'menu',
                        path:'/system/menu',
                        meta: {
                            title:'菜单管理'
                        },
                        component:()=> import('../views/Menu.vue')
                    },
                    {
                        name:'role',
                        path:'/system/role',
                        meta: {
                            title:'角色管理'
                        },
                        component:()=> import('../views/Role.vue')
                    }
                ]
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