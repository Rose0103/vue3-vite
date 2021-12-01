import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'

// 统一导入el-icon图标
import * as ElIconModules from '@element-plus/icons'
// 导入转换图标名称的函数
import { transElIconName } from './utils/utils.js'  


import router  from './router/router'
import 'element-plus/dist/index.css'
import config from './config/index'
import axios  from 'axios'
import request from './utils/request'
import storage from './utils/storage'
import api from './api'
import store from './store'

// console.log(config);
// console.log(config.mockApi)
// axios.get(config.mockApi + '/login').then((res) => {
//     console.log(res)
// })

const app = createApp(App)

app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api
// 统一注册el-icon图标
for(let iconName in ElIconModules){
    app.component(transElIconName(iconName),ElIconModules[iconName])
}

app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')
// console.log("环境变量", import.meta.env);
