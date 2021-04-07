import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入图标
import './assets/fonts/iconfont.css'
// 导入element组件
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Element)

// 导入全局样式表
import './assets/css/global.css'

//配置请求的根路径
import axios from 'axios'
axios.defaults.baseURL = "http://127.0.0.1:8080/api/private/v1/"
Vue.prototype.$http = axios

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem("token")
  //必须要return
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
