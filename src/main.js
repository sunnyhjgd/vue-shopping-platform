import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mockServer from './mock/mockServer'
// 导入Swiper及其CSS
import Swiper from 'swiper'
import 'swiper/css/swiper.css'
// 将Swiper挂载到Vue原型上，使其在所有组件中可用
Vue.prototype.$swiper = Swiper

// 在开发模式下自动启用 Devtools
Vue.config.devtools = process.env.NODE_ENV === 'development'
// Vuex插件已在store/index.js中初始化
//三级联动组件，注册为全局组件
import TypeNav from './components/TypeNav/index.vue'
// 注册为全局组件,第一个参数为组件的名称，第二个参数为组件的实例
Vue.component(TypeNav.name, TypeNav)
// 轮播图组件，注册为全局组件
import Carousel from './components/carsouel/index.vue'
Vue.component(Carousel.name, Carousel)
// 分页器组件，注册为全局组件
import Pagination from './components/Pagination/index.vue'
Vue.component(Pagination.name, Pagination)

// Element UI 按需引入
import { MessageBox } from 'element-ui';

// 挂载到原型上
Vue.prototype.$confirm = MessageBox.confirm;

// 图片懒加载配置
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  attempt: 1, // 尝试加载次数
  // 若需自定义加载图片，可将图片放入assets/images目录并配置
  // loading: require('./assets/images/loading.gif'),
  // error: require('./assets/images/error.gif')
})

Vue.config.productionTip = false
//引入校验插件
import './plugins/validate'
new Vue({
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this //安装全局事件总线,$bus就是当前应用的vm
  },
  router,
  store//组件身上会有$store属性
}).$mount('#app')