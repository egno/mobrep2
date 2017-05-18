import localforage from 'localforage'

export const lf = {
  get (key, defaultVal = null, callback) {
    localforage.getItem(key)
    .then((value) => {
      console.log('load:', JSON.parse(value))
      callback(value)
    })
  },
  getAll (defaultVal = null, callback) {
    let result = {}
    localforage.iterate((value, key, iterationNumber) => {
      let newObject = {}
      newObject[key] = JSON.parse(value)
      result = Object.assign(result, newObject)
    })
    .then(() => {
      console.log('load all', result)
      return result
    })
  },
  set (key, val) {
    console.log(key, val)
    localforage.setItem(key, JSON.stringify(val)).then((res) => {
      console.log('saved')
    })
  },
  remove (key) {
    return window.localStorage.removeItem(key)
  }
}
