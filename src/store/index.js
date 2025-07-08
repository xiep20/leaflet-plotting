import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: true,
  },
  mutations: {
    //更新登录状态
    setLoginStatus(state, data) {
      state.isLogin = data;
    },
  },
  actions: {
  },
  modules: {
  }
})
