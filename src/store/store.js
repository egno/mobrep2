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
    dataRESTRequestInProcess: false,
    dataCache: {reportsList: []},
    dataName: 'data',
    loggedIn: true,
    offlineMode: false,
    token: null,
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
    dataRESTRequestInProcess: (state) => {
      return state.dataRESTRequestInProcess
    },
    loggedIn: (state) => {
      return state.loggedIn
    },
    offlineMode: (state) => {
      return state.offlineMode
    },
    reportsList: (state) => {
      console.log('reportsList', state.dataCache.reportsList)
      return state.dataCache['reportsList']
    },
    tokenName: (state) => {
      return state.tokenName
    }
  },
  mutations: {
    logIn: (state, payload) => {
      state.token = ls.set(state.tokenName, payload)
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
      console.log('progress DB:', payload)
      state.dataBaseRequestInProcess = payload
    },
    setDataRESTRequestInProcess: (state, payload) => {
      console.log('progress REST:', payload)
      state.setDataRESTRequestInProcess = payload
    },
    setReportsList: (state, payload) => {
      state.dataCache.reportsList = Object.assign(state.dataCache.reportsList || payload, payload)
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
      Object.keys(payload).forEach(key => {
        lf.set(key, payload[key])
      })
      commit('setDataCache', payload)
    },
    setReportsList: ({commit}, payload) => {
      lf.set('reportsList', payload)
      commit('setReportsList', payload)
    },
    loadREST: ({commit}, payload) => {
      console.log('loadREST:', payload)
      if (!this.dataRESTRequestInProcess && payload.uri && payload.name) {
        console.log('Loading REST in progress...')
        commit('setDataRESTRequestInProcess', true)
        const options = {
          headers: {}
        }
        options.headers.Authorization = 'Bearer ' + ls.get(this.tokenName)
        Vue.http.get(payload.uri, options)
          .then(
            (response) => {
              return response.json()
            },
            (response) => {
              console.log(response)
            }
          )
          .then((data) => {
            const currentdate = new Date()
            const newDataCache = {}
            newDataCache[payload.name] = {
              ts: currentdate,
              data: data
            }
            commit('setDataCache', newDataCache)
          }
        )
        commit('setDataRESTRequestInProcess', false)
      }
    },
    loadDataCache: ({commit}) => {
      if (!this.dataBaseRequestInProcess) {
        console.log('Loading cache in progress...')
        commit('setDataBaseRequestInProcess', true)
        lf.getAll(this.dataCache, function (val) {
          commit('setDataCache', val)
          commit('setDataBaseRequestInProcess', false)
        })
      }
    }
  }
})
