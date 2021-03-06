<template>
  <div class="">
    <div ref="main" class="" v-if="name">
      <scroll-table
      :fixedColumn="caption"
      fixedTotals="false"
      :headers="headers"
      :data="currentData"
      :defDecimals="colDefDecimals"
      :totals="totals"
      :percentColumns="showInPercent"
      @reorder="reorder"
      @percentSwitch="percentSwitch"
      >
      </scroll-table>
    </div>
    <div ref="navigation" v-if="name">
      <chart-control
      :months="month_list"
      :small="false"
      :cache="cacheAgo"
      :enableDB="checkDB"
      :report="report.name"
      :modDate="modDate"
      :showHistory="currentShowHistory"
      @isChanged="isChanged"
      @reload="reload"
      @switchHistory="switchHistory"
      ></chart-control>
    </div>
    <div v-if="!(name)" class="container">
      <div class="row">
        <h2>Отчёт не найден</h2>
      </div>
      <div class="row">
        {{ message }}
      </div>
      <div class="row">Если ошибка повторяется,
        <a :href="'mailto:help@katren.ru?subject=datazen. Ошибка доступа к данным &body=' + encodeURIComponent(`

  --------------------
  Информация:
    ` + JSON.stringify(error, null, '  ') )
    ">сообщить в техподдержку</a>
      </div>
      <div class="row">
        <button type="submit" class="btn btn-primary" @click="goHome">К списку отчётов</button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint no-eval: 0 */

import { mapState, mapGetters, mapActions } from 'vuex'
import { ls } from '@/services/localStore'
import ChartControl from '@/components/ChartControl'
import ScrollTable from '@/components/ScrollTable'
import { BrowserDetect } from '@/services/os'

export default {
  props: [
    'name',
    'company'
  ],
  components: {
    ChartControl,
    ScrollTable
  },
  data () {
    return {
      data: {},
      reports: {},
      report: {},
      totlalCaption: 'ИТОГО',
      current_graph: 0,
      current_month: 0,
      currentGroupItems: [],
      currentShowHistory: false,
      chart_height: 0,
      currentOrder: 0,
      mainHeight: 0,
      defaultRegBodyType: 'Филиал',
      message: '',
      error: ''
    }
  },
  watch: {
    'name': 'fetchData, updateTitle',
    'dataCache': 'fetchData',
    'report': 'updateTitle',
    showHistory: {
      handler: function () { this.getShowHistory() },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState([
    ]),
    ...mapGetters([
      'appTitle',
      'checkLogIn',
      'dataCache',
      'showInPercent',
      'showHistory',
      'tokenName'
    ]),
    base () {
      return (this.graphs[this.current_graph].columns[1] && this.graphs[this.current_graph].columns[1].type)
    },
    cacheAgo () {
      const period = 60 * 60 * 1000
      const currentdate = new Date()
      const cache = this.dataCache[this.report.name]
      if ((cache) && (cache.ts)) {
        return Math.round(Math.abs((currentdate.getTime() - cache.ts.getTime()) / (period)))
      }
    },
    caption () {
      if (this.data && this.data[0]) {
        return this.data[0].regbodytype || this.defaultRegbodyType
      }
    },
    colDefDecimals () {
      if (this.columns) {
        return this.columns.filter(x => x.show).map(x => x.decimals)
      }
    },
    companyId () {
      return ((this.company || 'main') === 'main') ? '' : this.company
    },
    checkDB () {
      return true
    },
    currentData () {
      function order (a, b, desc = false) {
        a = (Array.isArray(a)) ? a[0] : a
        b = (Array.isArray(b)) ? b[0] : b
        if (typeof (a) !== 'string') {
          return ((a || 0) - (b || 0)) * ((desc) ? -1 : 1)
        } else {
          return ((a < b) ? -1 : 1) * ((desc) ? -1 : 1)
        }
      }
      if (this.data && (Object.keys(this.data).length > 0) && this.data[this.current_month]) {
        const prevData = this.data[this.current_month + 1]
        return this.data[this.current_month].regbodys.map((x, i) => {
          return {
            caption: x.name,
            values: this.columns.filter(x => x.show)
              .map((h, hi) => {
                if (prevData && prevData.regbodys && this.currentShowHistory) {
                  let result = []
                  result[0] = x.indicators[h.name] || this.calcDataValue(this.columns[hi].formula, x.indicators)
                  result[1] = prevData.regbodys.filter(px => px.name === x.name)[0].indicators[h.name]
                  result[2] = this.calcContValue(result, h.cont)
                  return result
                } else {
                  return x.indicators[h.name] || this.calcDataValue(this.columns[hi].formula, x.indicators)
                }
              })
          }
        })
        .sort((a, b) =>
          (this.currentOrder && a.values.length >= Math.abs(this.currentOrder))
          ? order(a.values[Math.abs(this.currentOrder) - 1], b.values[Math.abs(this.currentOrder) - 1], this.currentOrder < 0)
          : order(a.caption, b.caption))
      }
    },
    currentMonthPart () {
      const date = new Date(this.modDate)
      date.setDate(32)
      return this.modDate.getDate() / (32 - date.getDate())
    },
    graphs () {
      if (this.report) {
        return this.report.screens
      }
    },
    headers () {
      if (this.columns) {
        return this.columns.filter(x => x.show)
      }
    },
    columns () {
      if (this.report && this.report.indicators && this.data[0]) {
        const currency = this.data[0].currency || 'р'
        return this.report.indicators.map((x, i) => {
          x.caption = x.caption.replace('$', currency)
          x.show = !!(x.order)
          x.group = {
            'code': x.order.match(/^([^.]*)+[.]?(.*)$/)[1],
            'item': x.order.match(/^([^.]*)+[.]?(.*)$/)[2]
          }
          return x
        })
          .sort((a, b) => (a.order < b.order) ? -1 : 1)
          .map((x, i, a) => {
            const columns = a.filter(xx => xx.group.code === x.group.code)
            const currentColumn = columns.filter(xx => (this.currentGroupItems.indexOf(xx) + 1))[0]
            x.show = !!(x.order) && (x === currentColumn || (!(currentColumn) && columns.indexOf(x) === 0))
            x.group.length = columns.length
            x.group.seq = columns.indexOf(x)
            return x
          })
      }
    },
    modDate () {
      if (this.data[this.current_month]) {
        const dt = new Date(this.data[this.current_month].modificationdate)
        return dt
      }
    },
    month_list () {
      var options = {year: 'numeric', month: 'long'}
      return {
        list: (this.data && this.data.length > 0) ? this.data.map(x => new Date(x.period).toLocaleDateString('ru', options)) : {},
        selected: this.current_month
      }
    },
    needToRead () {
      return !(this.dataCache[this.report.name] && this.dataCache[this.report.name].ts && this.dataCache[this.report.name].data) || (this.cacheAgo > 0)
    },
    totals () {
      function calcTotal (func, data) {
        const sum = data.reduce((r, x) => (r || 0) + (+x || 0), 0)
        switch (func) {
          case 'sum': return sum
          case 'avg': return sum / data.length
          default: return ''
        }
      }

      if (this.data && (Object.keys(this.data).length > 0) && this.data[this.current_month] && this.columns) {
        const totalsRow = this.data[this.current_month].regbodys.filter(x => !(x.name))[0].indicators || {}
        let prevTotalsRow = null
        if (this.data[this.current_month + 1]) {
          prevTotalsRow = this.data[this.current_month + 1].regbodys.filter(x => !(x.name))[0].indicators
        }
        let totals = []

        for (let key of this.report.indicators.map(x => x.name)) {
          let column = this.columns.filter(h => h.name === key)
          if (column.length) {
            totals[key] = {}
            totals[key]['curr'] = totalsRow[key] ||
              calcTotal(
                this.columns.filter(h => h.name === key)[0].totals,
                this.data[this.current_month].regbodys.filter(x => x.name && x.name.indexOf('-опт') === -1).map(x => x.indicators[key])
              )
            if (prevTotalsRow) {
              totals[key]['prev'] = prevTotalsRow[key] ||
                calcTotal(
                  this.columns.filter(h => h.name === key)[0].totals,
                  this.data[this.current_month + 1].regbodys.filter(x => x.name && x.name.indexOf('-опт') === -1).map(x => x.indicators[key])
                )
            }
          }
        }

        return this.columns.filter(x => x.show)
          .map((h, hi) => {
            if (prevTotalsRow && this.currentShowHistory) {
              let result = []
              result[0] = ((totals[h.name]) ? totals[h.name]['curr'] : null) || this.calcDataValue(this.columns[hi].formula, totals.map(hx => hx['curr']))
              result[1] = ((totals[h.name]) ? totals[h.name]['prev'] : null) || this.calcDataValue(this.columns[hi].formula, totals.map(hx => hx['prev']))
              result[2] = this.calcContValue(result, h.cont)
              return result
            } else {
              return ((totals[h.name]) ? totals[h.name]['curr'] : null) || this.calcDataValue(this.columns[hi].formula, totals.map(hx => hx['curr']))
            }
          })
      }
    },
    uri () {
      if (this.report) {
        return this.report.uri
      }
    }
  },
  methods: {
    ...mapActions([
      'logOut',
      'setDataCache',
      'setShowHistory'
    ]),
    calcDataValue (formula, row) {
      if (formula && row) {
        let period = new Date(this.data[this.current_month].period)
        let lastDayInPeriod = new Date(period.getFullYear(), period.getMonth(), 32)
        let days = (
          (period.getFullYear() === this.modDate.getFullYear()) &&
          (period.getMonth() === this.modDate.getMonth())
        ) ? this.modDate.getDate() : lastDayInPeriod.getDate()
        row['_days'] = days
        let val = eval(formula.replace(/{([^}]*)}/g, 'row["$1"]'))
        return val
      }
    },
    calcContValue (values, cont = false) {
      if (values[0]) {
        if (cont && (this.current_month === 0)) {
          return values[0] / this.currentMonthPart
        } else {
          return values[0]
        }
      }
    },
    calcHeight () {
      if (this.report && this.$refs && this.$refs.main) {
        this.mainHeight = (document.documentElement.clientHeight - this.$refs.navigation.offsetHeight)
        this.$refs.main.style.height = (document.documentElement.clientHeight - this.$refs.navigation.offsetHeight) + 'px'
      }
    },
    checkOrder (currentDataLength) {
      this.currentOrder = (this.currentOrder < currentDataLength) ? this.currentOrder : 0
      return this.currentOrder
    },
    fetchData (force) {
      if (this.error) {
        return
      }
      this.report = this.reports.filter(x => x.code === this.name)[0]
      if (this.report) {
        const options = {
          headers: {}
        }
        this.data = (this.dataCache[this.report.name] && this.dataCache[this.report.name].ts) ? this.dataCache[this.report.name].data : {}
        if (force || this.needToRead) {
          if ((this.checkLogIn) && ls.get(this.tokenName) !== null) {
            options.headers.Authorization = 'Bearer ' + ls.get(this.tokenName)
          }
          this.$http.get('gdlivedata?regbodytype=eq.' + (this.report.regbodytype || this.defaultRegBodyType) +
          '&companyname=' + ((!this.companyId) ? 'is.null' : 'eq.' + this.company), options)
            .then(
              (response) => {
                return response.json()
              },
              (response) => {
                console.log(response)
                if (response.status === 500) {
                  this.name = ''
                  this.message = 'Ошибка доступа к данным. Попробуйте обновить страницу.'
                  this.error = response
                }
                // this.logOut()
              }
            )
            .then((data) => {
              const currentdate = new Date()
              const newDataCache = {}
              newDataCache[this.report.name] = {
                ts: currentdate,
                data: data
              }
              if (data.length === 0) {
                this.name = ''
                this.message = 'Данные для отчёта не получены. Попробуйте обновить страницу.'
                this.error = {'data': data}
              }
              this.data = data
              // this.setDataCache(newDataCache)
            }
          )
        }
      }
    },
    fetchReports () {
      const options = {
        headers: {}
      }
      if ((this.checkLogIn) && ls.get(this.tokenName) !== null) {
        options.headers.Authorization = 'Bearer ' + ls.get(this.tokenName)
        this.$http.get('reports', options)
        .then(
          (response) => {
            return response.json()
          },
          (response) => {
            console.log(response)
            if (response.status === 500) {
              this.name = ''
              this.message = 'Ошибка доступа к данным. Попробуйте обновить страницу.'
              this.error = response
            }
            // this.logOut()
          }
        )
        .then(
          (data) => {
            this.reports = data
            this.fetchData(true)
            this.loaded = true
          }
        )
      }
    },
    getShowHistory () {
      this.currentShowHistory = (this.showHistory && this.showHistory[this.name])
            ? this.showHistory[this.name] || false
            : false
    },
    getWindowHeight (event) {
      this.calcHeight()
    },
    goHome () {
      this.$router.push('/')
    },
    getInfo () {
      this.info = BrowserDetect.info()
    },
    isChanged (event) {
      this.current_graph = (typeof (event.graph) !== 'undefined') ? event.graph : this.current_graph
      this.current_month = (typeof (event.month) !== 'undefined') ? event.month : this.current_month
      this.calcHeight()
    },
    percentSwitch (event) {
      const currentColumn = this.columns.filter(x => x.show)[event]
      const columns = this.columns.filter(x => x.group.code === currentColumn.group.code)
      const currentIndex = columns.indexOf(currentColumn)
      const newIndex = (columns.length + (currentIndex) + 1) % columns.length
      if (currentIndex !== newIndex) {
        this.$set(this.currentGroupItems, event, columns[newIndex])
      }
    },
    reload (event) {
      window.removeEventListener('resize', this.getWindowHeight)
      this.data = {}
      window.document.title = this.appTitle
      this.fetchReports()
      this.$nextTick(function () {
        this.calcHeight()
        window.addEventListener('resize', this.getWindowHeight)
        this.getWindowHeight()
      })
    },
    reorder (event) {
      this.currentOrder = (Math.abs(this.currentOrder) === event) ? -this.currentOrder : event
    },
    switchHistory (event) {
      let payload = {}
      this.currentShowHistory = !(this.currentShowHistory || false)
      payload.key = this.name
      payload.value = this.currentShowHistory
      this.setShowHistory(payload)
      // this.currentShowHistory = !this.currentShowHistory
    },
    updateTitle () {
      if (this.error) {
        return
      }
      if (this.name && this.report) {
        window.document.title = this.report.caption
      }
    }
  },
  mounted () {
    this.reload()
  },
  updated () {
    this.calcHeight()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowHeight)
  }
}
</script>

<style>
</style>
