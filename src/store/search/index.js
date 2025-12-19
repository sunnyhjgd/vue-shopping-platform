//该文件是search模块，作为Vuex的一个模块导出
import { reqSearchList } from '@/api'
//准备actions，用于响应组件中的动作
const actions = {
  //获取搜索模块数据
  async getSearchList({ commit }, params = {}) {
    const res = await reqSearchList(params)
    if (res.code === 200) {
      commit('GETSEARCHLIST', res.data)
    }
  }
}
//准备mutations，用于操作数据(state)
const mutations = {
  GETSEARCHLIST(state, data) {
    state.searchList = data
  }
}
//准备state，用于存储数据
const state = {
  searchList: {}
}
//准备getters，用于简化state数据的获取
const getters = {
  //当前state是search模块的state
  //返回searchList中的goodsList数组
  goodsList: state => state.searchList.goodsList || [],
  trademarkList: state => state.searchList.trademarkList || [],
  attrsList: state => state.searchList.attrsList || [],
  // 分页相关getters
  total: state => state.searchList.total || 0,
  pageSize: state => state.searchList.pageSize || 10,
  totalPages: state => state.searchList.totalPages || 1,
  pageNum: state => state.searchList.pageNum || 1
}

//作为模块导出，不需要创建新的store实例
export default {
  namespaced: true, //开启命名空间，避免action、mutation等命名冲突
  state,
  mutations,
  actions,
  getters
}