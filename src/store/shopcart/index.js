//该文件是shopcart模块，作为Vuex的一个模块导出
//引入API模块
import { reqCartList, reqDeleteCart } from '@/api/index'

//准备actions，用于响应组件中的动作
const actions = {
  //通过action，提交mutation，变更数据
  async reqCartList({ commit }) {
    try {
      //发送请求获取数据
      const res = await reqCartList()
      if (res.code === 200) {
        //提交mutation变更数据
        commit('CARTLIST', res.data)
      }
    } catch (error) {
      console.error('获取购物车列表失败:', error)
      // 可以在这里提交错误mutation或其他错误处理
    }
  },
  //删除购物车商品
  async reqDeleteCart({ commit }, skuId) {
    try {
      //发送请求删除商品
      const res = await reqDeleteCart(skuId)
      if (res.code === 200) {
        //提交mutation删除商品
        commit('DELETE_CART', skuId)
      }
    } catch (error) {
      console.error('删除购物车商品失败:', error)
      // 可以在这里提交错误mutation或其他错误处理
    }
  },
}
//准备mutations，用于操作数据(state)
const mutations = {
  CARTLIST(state, cartList) {
    state.cartList = cartList
    // 将购物车数据保存到localStorage，实现持久化存储
    // 使用与mockServer.js一致的键名，避免数据冲突
    localStorage.setItem('cartList', JSON.stringify(cartList))
  },
  //删除购物车商品
  DELETE_CART(state, skuId) {
    // 过滤出不等于当前删除商品的其他商品
    state.cartList = state.cartList.filter(item => item.skuId !== skuId)
    // 更新localStorage
    localStorage.setItem('cartList', JSON.stringify(state.cartList))
  }
}
//准备state，用于存储数据
const state = {
  // 初始化时从localStorage读取数据，如果存在则使用，否则为空数组
  cartList: JSON.parse(localStorage.getItem('cartList')) || []
}

//准备getters，用于简化state数据的获取
const getters = {
  cartList(state) {
    return state.cartList || []
  }
}

//作为模块导出，不需要创建新的store实例
export default {
  namespaced: true, //开启命名空间，避免action、mutation等命名冲突
  state,
  mutations,
  actions,
  getters
}