import Vue from 'vue'
import Vuex from 'vuex'
import { ls } from './../services/localStore'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    appTitle: 'Живой экран',
    tokenName: 'jwt-token',
    historyName: 'showHistory',
    dataName: 'data',
    loggedIn: true,
    backRoute: false,
    dataCache: {},
    showInPercent: {},
    showHistory: null
  },
  getters: {
    appTitle: (state) => {
      return state.appTitle
    },
    backRoute: (state) => {
      return state.backRoute
    },
    checkLogIn: (state) => {
      state.loggedIn = (ls.get(state.tokenName))
      return (state.loggedIn)
    },
    dataCache: (state) => {
      // state.dataCache = JSON.parse(ls.get(state.dataName)) || {}
      return state.dataCache
    },
    dataName: (state) => state.dataName,
    showInPercent: (state) => state.showInPercent,
    showHistory: (state) => {
      if (!state.showHistory) {
        state.showHistory = JSON.parse(ls.get(state.historyName, JSON.stringify({})))
      }
      return state.showHistory
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
      state.dataCache = Object.assign(state.dataCache, payload)
      // ls.set(state.dataName, JSON.stringify(state.dataCache))
    },
    setShowHistory: (state, payload) => {
      state.showHistory = state.showHistory || {}
      Vue.set(state.showHistory, payload.key, payload.value || false)
      ls.set(state.historyName, JSON.stringify(state.showHistory))
      // state.showHistory = Object.assign(state.showHistory, payload)
    },
    setShowInPercent: (state, payload) => {
      state.showInPercent[payload] = !state.showInPercent[payload]
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
    setShowHistory: ({commit}, payload) => {
      commit('setShowHistory', payload)
    },
    setShowInPercent: ({commit}, payload) => {
      commit('setShowInPercent', payload)
    }
  }
})
