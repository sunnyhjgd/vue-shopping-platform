//该文件是detail模块，作为Vuex的一个模块导出
//引入API模块
import { reqDetailList, reqAddOrUpdateCart } from '@/api/index'

//准备actions，用于响应组件中的动作
const actions = {
  //通过action，提交mutation，变更数据
  async reqDetailList({ commit }, id) {
    try {
      //发送请求获取数据
      const res = await reqDetailList(id)
      if (res.code === 200) {
        //提交mutation变更数据
        commit('DETAILLIST', res.data)
      }
    } catch (error) {
      console.error('获取商品详情失败:', error)
      // 可以在这里提交错误mutation或其他错误处理
    }
  },
  //加入购物车接口
  async reqAddOrUpdateCart({ commit }, { skuId, num }) {
    try {
      //发送请求获取数据
      const res = await reqAddOrUpdateCart(skuId, num)
      console.log('加入购物车成功:', res)
      return res // 返回响应给调用者
    } catch (error) {
      console.error('加入购物车失败:', error)
      // 可以在这里提交错误mutation或其他错误处理
      throw error // 抛出错误给调用者
    }
  },
}
//准备mutations，用于操作数据(state)
const mutations = {
  DETAILLIST(state, detailList) {
    state.detailList = detailList
  }
}
//准备state，用于存储数据
const state = {
  detailList: {},
  // 直接从localStorage获取UUIDTOKEN，不再使用getUUID函数
  uuid_token: localStorage.getItem('UUIDTOKEN') || ''
}

//准备getters，用于简化state数据的获取
const getters = {
  categoryView(state) {
    return state.detailList.categoryView || {}
  },
  skuInfo(state) {
    return state.detailList.skuInfo || {}
  },
  spuSaleAttrList(state) {
    return state.detailList.spuSaleAttrList || []
  },
}

//作为模块导出，不需要创建新的store实例
export default {
  namespaced: true, //开启命名空间，避免action、mutation等命名冲突
  state,
  mutations,
  actions,
  getters
}