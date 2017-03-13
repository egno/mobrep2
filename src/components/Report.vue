<template>
  <div>
    <div ref="main" class="row">
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
    <div ref="navigation">
      <chart-control
        :graphs="{list: graph_list, selected: current_graph}"
        :months="{list: month_list, selected: current_month}"
        :small="true"
        @isChanged="graphIsChanged"
        >
      </chart-control>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ls } from '@/services/localStore'
import ChartControl from '@/components/ChartControl'
import ChartSwiper from '@/components/ChartSwiper'

export default {
  components: {
    ChartControl,
    ChartSwiper
  },
  data () {
    return {
      uri: 'gdlivescreen2',
      data: {},
      graphs: [
        { caption: '! Факт',
          columns: [
            { name: 'Факт,млн.р', caption: 'Факт', total: 'sum' },
            { name: 'План,млн.р', type: 'base', total: 'sum' }
          ]
        },
        {
          columns: [
            { name: 'Выполн.%', total: 'avg' },
            { name: 'Выпол. Год, %', type: 'base', total: 'avg' }
          ]
        },
        {
          columns: [
            { name: '%РН', total: 'avg' },
            { name: 'РН.млн.р', type: 'saturation', total: 'sum' }
          ]
        },
        {
          columns: [
            { name: 'РН.млн.р', total: 'sum' },
            { name: 'РН на душу нас.', total: 'avg' } ]
        },
        {
          columns: [
            { name: 'ДЗ,млн.р', total: 'sum' },
            { name: 'ДЗ,%проср', total: 'avg' } ]
        },
        {
          columns: [
            { name: 'Оборот ДЗ', total: 'sum' },
            { name: 'ДЗ,%проср', total: 'avg' } ]
        },
        {
          columns: [ { name: '%ЭСП', total: 'avg' } ]
        },
        {
          columns: [ { name: 'Скл.наимен.', total: 'avg' }, { name: 'На скл,млн.р', total: 'sum' } ]
        },
        {
          columns: [ { name: 'В пути,мл.р', total: 'sum' }, { name: 'В пути,дн' } ]
        },
        {
          columns: [ { name: 'Резерв,дн' }, { name: 'В пути,дн', total: 'avg' } ]
        },
        {
          columns: [ { name: 'На скл,млн.р', total: 'sum' }, { name: 'На скл,дн', total: 'avg' } ]
        },
        {
          columns: [ { name: 'Фин.цикл,дн', total: 'avg' } ]
        },
        {
          columns: [ { name: 'Прибыль,млн.р', total: 'sum' }, { name: 'ТС,млн.р' } ]
        },
        {
          columns: [ { name: 'УП(1000ч.)' }, { name: 'Доля филиала' } ]
        }
      ],
      caption: 'Филиал',
      totlalCaption: 'ИТОГО',
      current_graph: 0,
      current_month: 0,
      chart_height: 0,
      currentOrder: 3
    }
  },
  computed: {
    ...mapGetters([
      'checkLogIn',
      'tokenName'
    ]),
    base () {
      return (this.graphs[this.current_graph].columns[1] && this.graphs[this.current_graph].columns[1].type === 'base')
    },
    chartData () {
      if (this.data[this.current_month]) {
        return this.graphs.map(x => {
          return { caption: (x.caption)
            ? x.caption
            : (x.columns[0].caption)
              ? x.columns[0].caption
              : x.columns[0].name,
            data: this.data[this.current_month].data.map(row => {
              let values = x.columns.map(col => row[col.name])
              if (x.columns.reduce((r, xx) => r || xx.type === 'base', false)) {
                values.push((row[x.columns[0].name] / row[x.columns[1].name] * 100))
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
          ? (((a.values[this.currentOrder - 1]) ? a.values[this.currentOrder - 1] : 0) - ((b.values[this.currentOrder - 1]) ? b.values[this.currentOrder - 1] : 0))
          : (a.caption > b.caption) ? 1 : -1)
          return x
        }
        )
      }
    },
    graph_list () {
      return this.graphs.map(x =>
        (x.caption)
        ? x.caption
        : (x.columns[0].caption)
          ? x.columns[0].caption
          : x.columns[0].name)
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
      this.$refs.main.style.height = (document.documentElement.clientHeight - this.$refs.navigation.offsetHeight) + 'px'
    },
    checkOrder (currentDataLength) {
      this.currentOrder = (this.currentOrder < currentDataLength) ? this.currentOrder : 0
      return this.currentOrder
    },
    fetchData () {
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
    },
    getWindowHeight (event) {
      this.calcHeight()
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
    this.fetchData()
  },
  mounted () {
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
