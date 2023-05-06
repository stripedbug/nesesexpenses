import { createStore } from 'vuex'

export default createStore({
  state: {
    user:null,
    appinitiated:false,
    expensecollections:[],
  },
  getters: {
  },
  mutations: {
    SET_USER(state,data)
    {
      state.user = data
    },
    SET_APP_INITIATED(state,data)
    {
      state.appinitiated = data
    },
    SET_EXPENSE_COLLECTIONS(state,data)
    {
      state.expensecollections = data
    }
  },
  actions: {
    setUser({commit},data)  {
      commit("SET_USER",data)
    },
    SetAppInitiated({commit},data)  {
      console.log("SetAppInitiated")
      console.log(data)
      commit("SET_APP_INITIATED",data)
    },
    setExpenseCollections({commit},data)  {
      commit("SET_EXPENSE_COLLECTIONS",data)
    },
  },
  modules: {
  }
})
