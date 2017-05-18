import Vue from 'vue'
import Vuex from 'vuex'
import { ls } from './../services/localStore'
import { lf } from './../services/localForage'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    backRoute: false,
    dataBaseIsAvaiable: false,
    dataBaseRequestInProcess: false,
    dataCache: {},
    dataName: 'data',
    loggedIn: true,
    offlineMode: false,
    tokenName: 'jwt-token'
  },
  getters: {
    backRoute: (state) => {
      return state.backRoute
    },
    checkLogIn: (state) => {
      // state.loggedIn = (ls.get(state.tokenName))
      return (state.loggedIn)
    },
    dataBaseIsAvaiable: (state) => {
      return state.dataBaseIsAvaiable
    },
    dataBaseRequestInProcess: (state) => {
      return state.dataBaseRequestInProcess
    },
    dataCache: (state) => {
      return state.dataCache
    },
    dataName: (state) => {
      return state.dataName
    },
    loggedIn: (state) => {
      return state.loggedIn
    },
    offlineMode: (state) => {
      return state.offlineMode
    },
    tokenName: (state) => {
      return state.tokenName
    }
  },
  mutations: {
    logIn: (state, payload) => {
      state.loggedIn = true
    },
    logOut: (state) => {
      state.loggedIn = false
    },
    setBackRoute: (state, payload) => {
      if (payload !== '/login') {
        state.backRoute = payload
      }
    },
    setDataBaseRequestInProcess: (state, payload) => {
      console.log('progress:', payload)
      state.dataBaseRequestInProcess = payload
    },
    setDataCache: (state, payload) => {
      console.log('set', payload)
      state.dataCache = Object.assign(state.dataCache, payload)
    }
  },
  actions: {
    logIn: ({commit}, payload) => {
      ls.set(this.tokenName, payload)
      commit('logIn', payload)
    },
    logOut: ({commit}) => {
      ls.remove(this.tokenName)
      commit('logOut')
    },
    setBackRoute: ({commit}, payload) => {
      commit('setBackRoute', payload)
    },
    setDataCache: ({commit}, payload) => {
      commit('setDataCache', payload)
    },
    loadDataCache: ({commit}) => {
      if (!this.dataBaseRequestInProcess) {
        console.log('progress..')
        commit('setDataBaseRequestInProcess', true)
        lf.getAll(this.dataCache, function (val) {
          commit('setDataCache', val)
          commit('setDataBaseRequestInProcess', false)
        })
      }
    }
  }
})
