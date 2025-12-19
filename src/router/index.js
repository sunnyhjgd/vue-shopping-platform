// 路由配置
import Vue from 'vue'
import VueRouter from 'vue-router'

// 安装路由插件
Vue.use(VueRouter)

//路由懒加载：使用动态import语法实现按需加载组件
//webpackChunkName注释用于指定打包后的文件名前缀



// 创建路由实例
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/home' },//默认路由，跳转到首页
    {
      path: '/home',
      component: () => import(/* webpackChunkName: "home" */ '../pages/Home/index.vue'),
      name: 'home',
      meta: {
        showFooter: true
      },
      //路由组件可以传props参数，参数可以是对象也可以是函数
      //props：true，设置为布尔值，若为true，则会将params参数作为props传递给MyDetail组件
      //对象：props:{a:1,b:2}
      //函数：props(route){return {a:route.query.a,b:route.params.b}}
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../pages/Login/index.vue'),
      meta: {
        showFooter: false
      }
    },
    {
      path: '/register',
      component: () => import(/* webpackChunkName: "register" */ '../pages/Register/index.vue'),
      meta: {
        showFooter: false
      }
    },
    {
      path: '/search/:keyword?', // 添加可选的keyword参数，?表示可选
      component: () => import(/* webpackChunkName: "search" */ '../pages/Search/index.vue'),
      name: 'search',
      meta: {
        showFooter: true
      }
    },
    {
      path: '/detail/:id?',
      component: () => import(/* webpackChunkName: "detail" */ '../pages/Detail/index.vue'),
      name: 'detail',
      meta: {
        showFooter: true
      }
    },
    {
      path: '/cart',
      component: () => import(/* webpackChunkName: "addCartSuccess" */ '../pages/AddCartSuccess/index.vue'),
      name: 'cart',
      meta: {
        showFooter: true
      }
    },
    {
      path: '/shopcart',
      component: () => import(/* webpackChunkName: "shopCart" */ '../pages/ShopCart/index.vue'),
      name: 'shopcart',
      meta: {
        showFooter: false
      }
    },
    {
      path: '/trade',
      component: () => import(/* webpackChunkName: "trade" */ '../pages/Trade/index.vue'),
      name: 'trade',
      meta: {
        showFooter: true
      }
    },
    {
      path: '/pay',
      component: () => import(/* webpackChunkName: "pay" */ '../pages/Pay/index.vue'),
      name: 'pay',
      meta: {
        showFooter: true
      }
    },
    {
      path: '/paysuccess',
      component: () => import(/* webpackChunkName: "paySuccess" */ '../pages/PaySuccess/index.vue'),
      name: 'paysuccess',
      meta: {
        showFooter: true
      }
    },
    {
      path: '/center',
      component: () => import(/* webpackChunkName: "center" */ '../pages/Center/index.vue'),
      meta: {
        showFooter: true
      },
      // 子路由
      children: [
        {
          path: 'myorder',
          component: () => import(/* webpackChunkName: "myOrder" */ '../pages/Center/MyOrder/index.vue'),
          name: 'center',
          meta: {
            showFooter: true
          }
        },
        {
          path: 'grouporder',
          component: () => import(/* webpackChunkName: "groupOrder" */ '../pages/Center/GroupOrder/index.vue'),
          meta: {
            showFooter: true
          }
        }
      ]
    }
  ],
  // 路由滚动行为
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { y: 0 }
  }
})



// 路由守卫：实现访问控制和严格的页面跳转顺序
router.beforeEach((to, from, next) => {
  // 正确判断用户登录状态：获取user对象并检查是否有token或userId
  const userData = localStorage.getItem('user');
  let isLoggedIn = false;

  try {
    const user = userData ? JSON.parse(userData) : null;
    // 判断是否登录：有token或者有userId都视为已登录
    isLoggedIn = user && (user.token || user.userId);
  } catch (e) {
    console.error('解析用户数据失败:', e);
  }

  // 已登录状态（有用户token）
  if (isLoggedIn) {
    // 已登录状态下，禁止访问登录和注册页面
    if (to.path === '/login' || to.path === '/register') {
      // 重定向到首页
      next('/home')
    } else {
      // 实现交易流程的严格路径控制，但重定向回原来的页面
      // 1. 只有从购物车页面(/shopcart)才能跳转到交易页面(/trade)
      if (to.path === '/trade' && from.path !== '/shopcart') {
        alert('必须从购物车页面进入交易页面');
        // 重定向回原来的页面，如果有来源页面且不是当前页面
        next(from.path && from.path !== to.path ? from.path : '/shopcart');
        return;
      }

      // 2. 只有从交易页面(/trade)才能跳转到支付页面(/pay)
      if (to.path === '/pay' && from.path !== '/trade') {
        alert('必须从交易页面进入支付页面');
        // 重定向回原来的页面，如果有来源页面且不是当前页面
        next(from.path && from.path !== to.path ? from.path : '/trade');
        return;
      }

      // 3. 只有从支付页面(/pay)才能跳转到支付成功页面(/paysuccess)
      if (to.path === '/paysuccess' && from.path !== '/pay') {
        alert('必须从支付页面进入支付成功页面');
        // 重定向回原来的页面，如果有来源页面且不是当前页面
        next(from.path && from.path !== to.path ? from.path : '/pay');
        return;
      }

      // 其他页面正常访问
      next()
    }
  } else {
    // 未登录状态（无用户token）
    // 禁止访问交易相关、支付相关和个人中心页面
    const noAuthPaths = ['/trade', '/pay', '/paysuccess', '/center', '/center/myorder', '/center/grouporder']

    if (noAuthPaths.includes(to.path)) {
      // 重定向到登录页，并携带目标路径作为参数，登录后可以跳回来
      next('/login?redirect=' + to.path)
    } else {
      // 其他页面正常访问
      next()
    }
  }
})

// 导出路由实例
export default router
