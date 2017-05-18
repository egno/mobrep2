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
    tokenName: 'jwt-token',
    offlineMode: false
  },
  getters: {
    backRoute: (state) => {
      return state.backRoute
    },
    checkLogIn: (state) => {
      state.loggedIn = (ls.get(state.tokenName))
      return (state.loggedIn)
    },
    dataCache: (state) => {
      return state.dataCache
    },
    dataName: (state) => {
      return state.dataName
    },
    tokenName: (state) => {
      return state.tokenName
    }
  },
  mutations: {
    logIn: (state, payload) => {
      ls.set(state.tokenName, payload)
      state.loggedIn = true
    },
    logOut: (state) => {
      ls.remove(state.tokenName)
      state.loggedIn = false
    },
    setBackRoute: (state, payload) => {
      if (payload !== '/login') {
        state.backRoute = payload
      }
    },
    setDataCache: (state, payload) => {
      Object.keys(payload).map((key) => {
        lf.get(key, JSON.stringify(state.dataCache[key]), function (val) {
          state.dataCache[key] = Object.assign(state.dataCache[key], val ? JSON.parse(val) : {}, payload[key])
        })
        lf.set(key, payload[key])
      })
    },
    loadDataCache: (state) => {
      console.log('load all')
      console.log(state.dataCache, state.dataCache.length === undefined)
      if (state.dataCache.length === undefined) {
        lf.getAll(state.dataCache, function (val) {
          state.dataCache = Object.assign(state.dataCache, val ? JSON.parse(val) : {})
        })
      }
    }
  },
  actions: {
    logIn: ({commit}, payload) => {
      commit('logIn', payload)
    },
    logOut: ({commit}) => {
      commit('logOut')
    },
    setBackRoute: ({commit}, payload) => {
      commit('setBackRoute', payload)
    },
    setDataCache: ({commit}, payload) => {
      commit('setDataCache', payload)
    },
    loadDataCache: ({commit}) => {
      commit('loadDataCache')
    }
  }
})
