//该文件是trade模块，作为Vuex的一个模块导出
//引入API模块
import { reqUserAddress, reqSubmitOrder } from '@/api/index'


//准备actions，用于响应组件中的动作
const actions = {
  async reqUserAddress({ commit }) {
    try {
      //发送请求获取数据
      const res = await reqUserAddress()
      if (res.code === 200) {
        // 提交成功mutation，更新state中的数据
        commit('setUserAddress', res.data)
      }
    } catch (error) {
      console.error('获取用户地址失败:', error)
      // 可以在这里提交错误mutation或其他错误处理
    }
  },
  
  // 提交订单
  async reqSubmitOrder({ commit }, orderInfo) {
    try {
      // 发送请求提交订单
      const res = await reqSubmitOrder(orderInfo)
      console.log('订单提交响应:', res);
      if (res.code === 200) {
        // 可以在这里提交mutation保存订单信息
        // 返回整个响应对象，而不仅仅是data部分
        return res
      }
      return Promise.reject(new Error(res.message || '提交订单失败'))
    } catch (error) {
      console.error('提交订单失败:', error)
      return Promise.reject(error)
    }
  }

}
//准备mutations，用于操作数据(state)
const mutations = {
  setUserAddress(state, addressList) {
    state.userAddressList = addressList
  }

}
//准备state，用于存储数据
const state = {
  userAddressList: []
}

//准备getters，用于简化state数据的获取
const getters = {
  userAddressList(state) {
    return state.userAddressList
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