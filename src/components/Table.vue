<template>
  <div class="">
    <div ref="main" class="" v-if="name">
      <scroll-table
      :fixedColumn="caption"
      fixedTotals="false"
      :headers="headers"
      :data="currentData"
      :totals="totals"
      :percentColumns="showInPercent"
      @reorder="reorder"
      >
      </scroll-table>
    </div>
    <div ref="navigation" v-if="name">
      <chart-control
      :months="month_list"
      :small="true"
      :cache="cacheAgo"
      :enableDB="checkDB"
      :report="report.name"
      @isChanged="isChanged"
      ></chart-control>
    </div>
    <div v-if="!name" class="container">
      <div class="row">
        <h2>Отчёт не найден</h2>
      </div>
      <div class="row">
        <button type="submit" class="btn btn-primary" @click="goHome">К списку отчётов</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { ls } from '@/services/localStore'
import { reports } from '@/reports'
import ChartControl from '@/components/ChartControl'
import ScrollTable from '@/components/ScrollTable'

export default {
  props: [
    'name'
  ],
  components: {
    ChartControl,
    ScrollTable
  },
  data () {
    return {
      data: {},
      report: {},
      totlalCaption: 'ИТОГО',
      current_graph: 0,
      current_month: 0,
      chart_height: 0,
      currentOrder: 0,
      mainHeight: 0
    }
  },
  watch: {
    'name': 'fetchData, updateTitle',
    'dataCache': 'fetchData',
    'report': 'updateTitle'
  },
  computed: {
    ...mapState([
    ]),
    ...mapGetters([
      'appTitle',
      'checkLogIn',
      'dataCache',
      'showInPercent',
      'tokenName'
    ]),
    localShowinPercent () {
      return this.showInPercent
    },
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
      if (this.report) {
        return this.report.fixedColumn
      }
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
          return ((a > b) ? 1 : -1) * ((desc) ? -1 : 1)
        }
      }
      if (this.data && (Object.keys(this.data).length > 0) && this.data[this.current_month]) {
        return this.data[this.current_month].data.map((x) => {
          return {
            caption: x[this.caption],
            values: this.headers.map((h) => x[h])
          }
        })
        .sort((a, b) =>
          (this.currentOrder && a.values.length >= Math.abs(this.currentOrder))
          ? order(a.values[Math.abs(this.currentOrder) - 1], b.values[Math.abs(this.currentOrder) - 1], this.currentOrder < 0)
          : order(a.caption, b.caption))
      }
    },
    graphs () {
      if (this.report) {
        return this.report.screens
      }
    },
    headers () {
      if (this.data && this.data[0]) {
        let result = Object.keys(this.data[0].data[0])
          .filter((x) => this.graphs.reduce((r, xx) => r || xx.columns.reduce((cr, cx) => cr || cx.name === x, false), false))
        if (this.data[0].fields) {
          result = result.sort((a, b) => parseInt(this.data[0].fields[a]) - parseInt(this.data[0].fields[b]))
        }
        return result
      }
    },
    month_list () {
      return {
        list: (this.data && this.data.length > 0) ? this.data.map(x => x.month.name) : {},
        selected: this.current_month
      }
    },
    needToRead () {
      return !(this.dataCache[this.report.name] && this.dataCache[this.report.name].ts && this.dataCache[this.report.name].data) || (this.cacheAgo > 0)
    },
    saturation_caption () {
      return (this.graphs[this.current_graph].saturation)
        ? this.graphs[this.current_graph].saturation
        : (this.graphs[this.current_graph].columns.length > 1)
          ? '(%)'
          : undefined
    },
    totals () {
      if (this.data && this.data[this.current_month]) {
        if (this.data[this.current_month].totals) {
          return this.headers.map((h) => this.data[this.current_month].totals[h])
        } else {
          if (this.report.screens) {
            const totalFunc = this.headers.map((h) => this.report.screens.reduce((r, x) => r || x.columns.filter((fx) => fx.name === h)[0], ''))
            return totalFunc.map((t, i) => {
              const sum = this.currentData.filter((x) => x.caption.indexOf('-опт') === -1).reduce((r, x) => (r || 0) + (+x.values[i] || 0), 0)
              switch (t.total) {
                case 'sum': return sum
                case 'avg': return sum / this.currentData.filter((x) => x.caption.indexOf('-опт') === -1).length
                default: return ''
              }
            })
          } else {
            return {}
          }
        }
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
      'setDataCache'
    ]),
    calcAutoColumn (a, b, type) {
      if (type) {
        switch (type) {
          case 'percent':
            return 100 * a / b
          case 'part':
            return a / b
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
      this.report = reports.filter(x => x.name === this.name)[0]
      if (this.report) {
        const options = {
          headers: {}
        }
        this.data = (this.dataCache[this.report.name] && this.dataCache[this.report.name].ts) ? this.dataCache[this.report.name].data : {}
        if (force || this.needToRead) {
          if ((this.checkLogIn) && ls.get(this.tokenName) !== null) {
            options.headers.Authorization = 'Bearer ' + ls.get(this.tokenName)
          }
          this.$http.get(this.uri, options)
            .then(
              (response) => {
                return response.json()
              },
              (response) => {
                this.logOut()
              }
            )
            .then((data) => {
              const currentdate = new Date()
              const newDataCache = {}
              newDataCache[this.report.name] = {
                ts: currentdate,
                data: data
              }
              this.setDataCache(newDataCache)
              this.data = data
            }
          )
        }
      }
    },
    getWindowHeight (event) {
      this.calcHeight()
    },
    goHome () {
      this.$router.push('/')
    },
    isChanged (event) {
      this.current_graph = (typeof (event.graph) !== 'undefined') ? event.graph : this.current_graph
      this.current_month = (typeof (event.month) !== 'undefined') ? event.month : this.current_month
      this.calcHeight()
    },
    reorder (event) {
      this.currentOrder = (Math.abs(this.currentOrder) === event) ? -this.currentOrder : event
    },
    updateTitle () {
      if (this.name && this.report) {
        window.document.title = this.report.caption
      }
    }
  },
  mounted () {
    window.document.title = this.appTitle
    this.fetchData()
    this.calcHeight()
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowHeight)
      this.getWindowHeight()
    })
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
