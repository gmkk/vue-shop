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

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 注册为全局组件
Vue.use(VueQuillEditor)

//tree-table
import treeTable from 'vue-table-with-tree-grid'
 
Vue.component('tree-table', treeTable )

Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  
})

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
