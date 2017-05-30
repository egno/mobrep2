<template>
  <div>
    <div ref="main" >
      <div v-if="!(data)" class="container">
        <div class="row">
          <h2>Отчёт не найден</h2>
        </div>
        <div class="row">
          <button type="submit" class="btn btn-primary" @click="goHome">К списку отчётов</button>
        </div>
      </div>
      <scroll-table v-if="(data) && (data.length > 0)"
      :fixedColumn="caption"
      :headers="headers"
      :data="currentData"
      :totals="totals"
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
      :note="note"
      :report="name"
      @isChanged="isChanged"
      @reload="fetchData"
      ></chart-control>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
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
      totlalCaption: 'ИТОГО',
      current_graph: 0,
      current_month: 0,
      chart_height: 0,
      currentOrder: 0
    }
  },
  watch: {
    'uri': 'fetchData'
  },
  computed: {
    ...mapGetters([
      'checkLogIn',
      'reportsList',
      'tokenName'
    ]),
    ...mapState([
      'dataCache',
      'offlineMode'
    ]),
    base () {
      return (this.graphs[this.current_graph].columns[1] && this.graphs[this.current_graph].columns[1].type)
    },
    cacheAgo () {
      const period = 60 * 60 * 1000
      const currentdate = new Date()
      if (this.dataCache && this.report && this.name && this.dataCache[this.name]) {
        const cache = this.dataCache[this.name]
        if ((cache) && (cache.ts)) {
          console.log(cache.ts)
          return Math.round(Math.abs((currentdate.getTime() - Date.parse(cache.ts)) / (period)))
        }
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
      function order (a, b) {
        if (typeof (a) !== 'string') {
          return (a || 0) - (b || 0)
        } else {
          return (a > b) ? 1 : -1
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
          (this.currentOrder && a.values.length >= this.currentOrder)
          ? order(a.values[this.currentOrder - 1], b.values[this.currentOrder - 1])
          : order(a.caption, b.caption))
      } else {
        return {}
      }
    },
    data () {
      if (this.dataCache && this.dataCache[this.name]) {
        return this.dataCache[this.name].data
      } else {
        return {}
      }
    },
    graphs () {
      if (this.report) {
        return this.report.screens
      }
    },
    headers () {
      if (this.data[0]) {
        let result = Object.keys(this.data[0].data[0])
          .filter((x) => this.graphs.reduce((r, xx) => r || xx.columns.reduce((cr, cx) => cr || cx.name === x, false), false))
        if (this.data[0].fields) {
          result = result.sort((a, b) => parseInt(this.data[0].fields[a]) - parseInt(this.data[0].fields[b]))
          console.log(this.data[0].fields, result)
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
      return !(this.report && this.name && this.dataCache[this.name] && this.dataCache[this.name].ts) || (this.cacheAgo > 0)
    },
    note () {
      if (this.dataCache && this.dataCache[this.name]) {
        const dt = new Date(this.dataCache[this.name].ts)
        return dt.toLocaleString('ru-RU')
      }
    },
    report () {
      console.log(this.dataCache)
      if (this.dataCache && this.dataCache.reportsList) {
        return this.dataCache.reportsList.filter(x => x.name === this.name)[0]
      } else {
        return {}
      }
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
          return {}
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
      'loadDataCache',
      'loadREST',
      'logOut'
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
      if (this.report && this.$refs.main) {
        this.$refs.main.style.height = (document.documentElement.clientHeight - this.$refs.navigation.offsetHeight) + 'px'
      }
    },
    checkOrder (currentDataLength) {
      this.currentOrder = (this.currentOrder < currentDataLength) ? this.currentOrder : 0
      return this.currentOrder
    },
    fetchData (force) {
      console.log('fetchData')
      if (this.report) {
        this.loadREST({name: this.name, uri: this.uri})
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
      this.currentOrder = event
    }
  },
  mounted () {
    // this.fetchData()
    this.loadDataCache()
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
.offline {
  background-color: #eef;
}
</style>
