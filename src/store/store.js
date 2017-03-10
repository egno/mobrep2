import Vue from 'vue'
import Vuex from 'vuex'
import { ls } from './../services/localStore'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    tokenName: 'jwt-token',
    loggedIn: true,
    backRoute: false
  },
  getters: {
    checkLogIn: (state) => {
      state.loggedIn = (ls.get(state.tokenName))
      return (state.loggedIn)
    },
    backRoute: (state) => {
      return state.backRoute
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
    }
  }
})
