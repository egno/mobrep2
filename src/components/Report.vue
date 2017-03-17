<template>
  <div>
    <div ref="main" class="row" v-if="name">
      <chart-swiper
        :activePage="current_graph"
        :fixedHeaderCaption="caption"
        :pages="graphs"
        :data="chartData"
        :order="currentOrder"
        @isChanged="graphIsChanged"
        @reorder="reorder"
        >
      </chart-swiper>
    </div>
    <div ref="navigation" v-if="name">
      <chart-control
        :graphs="{list: graph_list, selected: current_graph}"
        :months="{list: month_list, selected: current_month}"
        :small="true"
        @isChanged="graphIsChanged"
        >
      </chart-control>
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
import ChartControl from '@/components/ChartControl'
import ChartSwiper from '@/components/ChartSwiper'
import { reports } from '@/reports'

export default {
  props: [
    'name'
  ],
  components: {
    ChartControl,
    ChartSwiper
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
    graphs () {
      if (this.report) {
        return this.report.screens
      }
    },
    uri () {
      if (this.report) {
        return this.report.uri
      }
    },
    caption () {
      if (this.report) {
        return this.report.fixedColumn
      }
    },
    base () {
      return (this.graphs[this.current_graph].columns[1] && this.graphs[this.current_graph].columns[1].type)
    },
    chartData () {
      function order (a, b) {
        if (typeof (a) !== 'string') {
          return (a || 0) - (b || 0)
        } else {
          return (a > b) ? 1 : -1
        }
      }
      if (this.data[this.current_month]) {
        return this.graphs.map(x => {
          return { caption: (x.caption)
            ? x.caption
            : (x.columns[0].caption)
              ? x.columns[0].caption
              : x.columns[0].name,
            data: this.data[this.current_month].data.map(row => {
              let values = x.columns.map(col => row[col.name])
              if (x.columns[1]) {
                switch (x.columns[1].type) {
                  case 'percent':
                    values.push((row[x.columns[0].name] / row[x.columns[1].name] * 100))
                    break
                  case 'part':
                    values.push((row[x.columns[0].name] / row[x.columns[1].name]))
                }
              }
              return {
                caption: row[this.caption],
                values: values
              }
            })
          }
        })
        .map(x => {
          x.data = x.data.sort((a, b) =>
          (this.currentOrder && a.values.length >= this.currentOrder)
          ? order(a.values[this.currentOrder - 1], b.values[this.currentOrder - 1])
          : order(a.caption, b.caption))
          return x
        }
        )
      }
    },
    graph_list () {
      if (this.graphs) {
        return this.graphs.map(x =>
          (x.caption)
          ? x.caption
          : (x.columns[0].caption)
            ? x.columns[0].caption
            : x.columns[0].name)
      }
    },
    month_list () {
      return (this.data.length > 0) ? this.data.map(x => x.data[0].tdate) : {}
    },
    saturation_caption () {
      return (this.graphs[this.current_graph].saturation)
        ? this.graphs[this.current_graph].saturation
        : (this.graphs[this.current_graph].columns.length > 1)
          ? '(%)'
          : undefined
    },
    totals () {
      if (this.curr_data) {
        return this.curr_data
          .reduce((r, x) => x.values.map((xx, i) => (r[i] || 0) + (+xx || 0)),
          [])
          .map((x, i) => {
            switch ((this.graphs[this.current_graph].columns[i]) ? this.graphs[this.current_graph].columns[i].total : 'avg') {
              case 'sum':
                return x.toFixed(1)
              case 'avg':
                return (x / this.curr_data.length).toFixed(1)
              default:
                return null
            }
          })
      }
    }
  },
  methods: {
    ...mapActions([
      'logOut'
    ]),
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
    graphIsChanged (event) {
      this.current_graph = (typeof (event.graph) !== 'undefined') ? event.graph : this.current_graph
      this.current_month = (typeof (event.month) !== 'undefined') ? event.month : this.current_month
      this.calcHeight()
    },
    reorder (event) {
      this.currentOrder = event
    }
  },
  created () {
  },
  mounted () {
    this.fetchData()
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowHeight)
      this.getWindowHeight()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowHeight)
  }
}
</script>
