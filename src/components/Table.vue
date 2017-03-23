<template>
  <div class="">
    <div ref="main" class="" v-if="name">
      <scroll-table
      :fixedColumn="caption"
      :headers="headers"
      :data="currentData"
      :totals="totals"
      >
      </scroll-table>
    </div>
    <div ref="navigation" v-if="name">
      <chart-control
      :months="month_list"
      :small="true"
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
import { mapGetters, mapActions } from 'vuex'
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
      currentOrder: 0
    }
  },
  watch: {
    'name': 'fetchData'
  },
  computed: {
    ...mapGetters([
      'checkLogIn',
      'tokenName'
    ]),
    base () {
      return (this.graphs[this.current_graph].columns[1] && this.graphs[this.current_graph].columns[1].type)
    },
    caption () {
      if (this.report) {
        return this.report.fixedColumn
      }
    },
    currentData () {
      if (this.data && this.data[this.current_month]) {
        return this.data[this.current_month].data.map((x) => {
          return {
            caption: x[this.caption],
            values: this.headers.map((h) => x[h])
          }
        })
      }
    },
    graphs () {
      if (this.report) {
        return this.report.screens
      }
    },
    headers () {
      if (this.data[0]) {
        return Object.keys(this.data[0].data[0])
          .filter((x) => this.graphs.reduce((r, xx) => r || xx.columns.reduce((cr, cx) => cr || cx.name === x, false), false))
      }
    },
    month_list () {
      return {
        list: (this.data && this.data.length > 0) ? this.data.map(x => x.month.name) : {},
        selected: this.current_month
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
      if (this.report) {
        this.$refs.main.style.height = (document.documentElement.clientHeight - this.$refs.navigation.offsetHeight) + 'px'
      }
    },
    checkOrder (currentDataLength) {
      this.currentOrder = (this.currentOrder < currentDataLength) ? this.currentOrder : 0
      return this.currentOrder
    },
    fetchData () {
      this.report = reports.filter(x => x.name === this.name)[0]
      if (this.report) {
        const options = {
          headers: {}
        }
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
            this.data = data
          }
        )
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
