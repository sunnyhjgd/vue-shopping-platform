//该文件是home模块，作为Vuex的一个模块导出
//引入API模块
import { reqCategoryList, reqBannerList, reqFloorList } from '@/api'

//准备actions，用于响应组件中的动作
const actions = {
  //通过action，提交mutation，变更数据
  async categoryList({ commit }) {
    try {
      //发送请求获取数据
      const res = await reqCategoryList()
      if (res.code === 200) {
        //提交mutation变更数据
        commit('CATEGORYLIST', res.data)
      }
    } catch (error) {
      console.error('获取分类列表失败:', error)
      // 可以在这里提交错误mutation或其他错误处理
    }
  },
  //获取banner列表
  async bannerList({ commit }) {
    try {
      //发送请求获取数据
      const res = await reqBannerList()
      if (res.code === 200) {
        //提交mutation变更数据
        commit('BANNERLIST', res.data)
      }
    } catch (error) {
      console.error('获取banner列表失败:', error)
      // 可以在这里提交错误mutation或其他错误处理
    }
  },
  //获取floor列表
  async floorList({ commit }) {
    try {
      //发送请求获取数据
      const res = await reqFloorList()
      if (res.code === 200) {
        //提交mutation变更数据
        commit('FLOORLIST', res.data)
      }
    } catch (error) {
      console.error('获取floor列表失败:', error)
      // 可以在这里提交错误mutation或其他错误处理
    }
  },
}
//准备mutations，用于操作数据(state)
const mutations = {
  CATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList
  },
  //获取banner列表
  BANNERLIST(state, bannerList) {
    state.bannerList = bannerList
  },
  //获取floor列表
  FLOORLIST(state, floorList) {
    state.floorList = floorList
  }
}
//准备state，用于存储数据
const state = {
  categoryList: [],
  bannerList: [],
  floorList: []
}

//准备getters，用于简化state数据的获取
const getters = {
  //获取分类列表
  categoryList: state => state.categoryList,
  //获取banner列表
  bannerList: state => state.bannerList,
  //获取floor列表
  floorList: state => state.floorList
}

//作为模块导出，不需要创建新的store实例
export default {
  namespaced: true, //开启命名空间，避免action、mutation等命名冲突
  state,
  mutations,
  actions,
  getters
}