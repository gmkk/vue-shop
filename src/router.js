import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/Users/Users.vue'
import Rights from './components/Power/Rights.vue'
import Roles from './components/Power/Roles.vue'
import Cate from './components/goods/Cate.vue'
import Good from './components/goods/Good.vue'
import Param from './components/goods/Param.vue'
import Add from './components/goods/Add.vue'
import Order from './components/order/Order.vue'
import Report from './components/report/Report.vue'


Vue.use(Router)

const router = new Router({

  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Param },
        { path: '/goods', component: Good },
        { path: '/goods/addgoods', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }

      ]
    }



  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login')
  next()

})

export default router
