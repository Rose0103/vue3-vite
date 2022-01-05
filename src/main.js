import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
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

app.directive('has',{
    beforeMount:(el,binding) => {
        // console.log(el,binding);
        // 获取按钮权限
        let actionList = storage.getItem('actionList');
        let value = binding.value;
        // 判断列表中是否有对应按钮权限标识
        let hasPermission = actionList.includes(value);
        if(!hasPermission){
            el.style = 'display:none';
            setTimeout(() => {
                el.parentNode.removeChild(el)
            },0)
        }
    },
})


app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api

app.use(ElementPlus, {size: 'small'})
app.use(router)
app.use(store)
app.mount('#app')
// console.log("环境变量", import.meta.env);
