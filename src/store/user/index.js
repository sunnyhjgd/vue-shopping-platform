//该文件是user模块，作为Vuex的一个模块导出
//引入API模块
import { reqSendCode, reqRegister, reqLogin } from '@/api/index'

//准备actions，用于响应组件中的动作
const actions = {
  async sendCode({ commit }, phone) {
    let result = await reqSendCode(phone)
    if (result.code === 200) {
      commit('SENDCODE', result.data)
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  },
  //注册接口
  async register({ commit }, params) {
    let result = await reqRegister(params)
    if (result.code === 200) {
      commit('REGISTER', result.data)
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  },
  //登录接口
  async login({ commit }, params) {
    let result = await reqLogin(params)
    if (result.code === 200) {
      commit('LOGIN', result.data.token)
      commit('USERINFO', result.data.userInfo)
      // 登录成功后，将token存储到localStorage，实现持久化登录
      localStorage.setItem('UUIDTOKEN', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.userInfo))
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }
}
//准备mutations，用于操作数据(state)
const mutations = {
  SENDCODE(state, data) {
    state.data = data
  },
  //注册接口
  REGISTER(state, data) {
    state.userInfo = data
  },
  //登录接口
  LOGIN(state, token) {
    state.token = token
  },
  //用户信息接口
  USERINFO(state, userInfo) {
    state.userInfo = userInfo
  }
}
//准备state，用于存储数据
const state = {
  data: {},
  // 从localStorage初始化userInfo，实现页面刷新后数据不丢失
  userInfo: JSON.parse(localStorage.getItem('user') || '{}'),
  // 从localStorage初始化token，实现页面刷新后数据不丢失
  token: localStorage.getItem('UUIDTOKEN') || ''
}

//准备getters，用于简化state数据的获取
const getters = {
}

//作为模块导出，不需要创建新的store实例
export default {
  namespaced: true, //开启命名空间，避免action、mutation等命名冲突
  state,
  mutations,
  actions,
  getters
}