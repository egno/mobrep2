export const idb = {
  check () {
    let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    if (!indexedDB) {
      window.alert('Ваш браузер не поддерживат стабильную версию IndexedDB. Такие-то функции будут недоступны')
      return false
    }
    return true
  }
}
