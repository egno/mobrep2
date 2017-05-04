import Vue from 'vue'
import Vuex from 'vuex'
import { ls } from './../services/localStore'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    tokenName: 'jwt-token',
    dataName: 'data',
    loggedIn: true,
    backRoute: false,
    dataCache: {}
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
      // state.dataCache = JSON.parse(ls.get(state.dataName)) || {}
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
      state.dataCache = Object.assign(state.dataCache, payload)
      // ls.set(state.dataName, JSON.stringify(state.dataCache))
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
    }
  }
})
