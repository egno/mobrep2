export const idb = {
  check () {
    let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    if (!indexedDB) {
      console.log('Ваш браузер не поддерживат стабильную версию IndexedDB. Такие-то функции будут недоступны')
      return false
    }
    return true
  },
  get (key, defaultVal = null) {
  },
  set (key, val) {
    const DB_NAME = 'mdn-demo-indexeddb-epublications'
    const DB_VERSION = 1
    const DB_STORE_NAME = 'publications'

    function openDb () {
      console.log('openDb ...')
      var req = indexedDB.open(DB_NAME, DB_VERSION)
      req.onsuccess = function (evt) {
        let db = this.result
        console.log('openDb DONE')
        return db
      }
      req.onerror = function (evt) {
        console.error('openDb:', evt.target.errorCode)
      }

      req.onupgradeneeded = function (evt) {
        console.log('openDb.onupgradeneeded')
        var store = evt.currentTarget.result.createObjectStore(
          DB_STORE_NAME, { keyPath: 'key', autoIncrement: false })
        return store
      }
    }

    return openDb()
  }
}
