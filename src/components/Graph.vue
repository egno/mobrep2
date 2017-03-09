<template>
  <div>
    <div ref="headers">
      <chart-header
        :headers="{caption: {name: caption, ordered: (currentOrder === 0)},
          columns: headers}"
        @reorder="reorder"
        >
      </chart-header>
    </div>
    <chart
      :base="base"
      :captions="captions"
      :data="curr_data"
      :height="chart_height"
      @reorder="reorder">
    </chart>
    <div ref="footers">
      <chart-totals
        :totals="{caption: totlalCaption,
          columns: totals}"
        >
      </chart-totals>
      <chart-control
        :graphs="{list: graph_list, selected: current_graph}"
        :months="{list: month_list, selected: current_month}"
        @isChanged="graphIsChanged"
        >
      </chart-control>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ls } from './../services/localStore'
import Chart from '@/components/Chart'
import ChartControl from '@/components/ChartControl'
import ChartHeader from '@/components/ChartHeader'
import ChartTotals from '@/components/ChartTotals'

export default {
  data () {
    return {
      uri: 'gdlivescreen',
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
      currentOrder: 0
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
    // captions () {
    //   if (this.data[this.current_month]) {
    //     return this.data[this.current_month].data
    //       .map(x => x[this.caption])
    //   }
    captions () {
      if (this.current_data) {
        return this.current_data.map(x => x.caption)
      }
    },
    curr_data () {
      let order = function (a, b, currentOrder) {
        if (currentOrder > 0) {
          return a.values[currentOrder - 1] - b.values[currentOrder - 1]
        } else {
          return (a.caption > b.caption) ? 1 : -1
        }
      }
      if (this.data[this.current_month] && this.graphs[this.current_graph].columns) {
        let result = this.data[this.current_month].data
          .map(x => {
            let values = []
            values = this.graphs[this.current_graph].columns
              .map(c => x[c.name])
            if (this.graphs[this.current_graph].columns
              .reduce((r, x) => r || x.type === 'base', false)
            ) {
              values.push((x[this.graphs[this.current_graph].columns[0].name] / x[this.graphs[this.current_graph].columns[1].name] * 100).toFixed(1))
            }
            return {
              caption: x[this.caption],
              values: values
            }
          })
        this.checkOrder(result[0].values.length + 1)
        return result.sort((a, b) => order(a, b, this.currentOrder))
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
    headers () {
      const percentCaption = '(%)'
      let result = this.graphs[this.current_graph].columns
        .filter(x => !x.hidden)
        .map((x, i) => {
          return {
            name: (x.caption) ? x.caption : x.name,
            ordered: (i === this.currentOrder - 1)
          }
        }
        )
      if (this.graphs[this.current_graph].columns
        .reduce((r, x) => r || x.type === 'base', false)
      ) {
        result.push({name: percentCaption, ordered: (result.length === this.currentOrder - 1)})
      }
      return result
    },
    month_list () {
      return (this.data.length > 0) ? this.data.map(x => x.month) : {}
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
  components: {
    Chart,
    ChartControl,
    ChartHeader,
    ChartTotals
  },
  methods: {
    ...mapActions([
      'logOut'
    ]),
    calcHeight () {
      this.chart_height = document.documentElement.clientHeight - this.$refs.headers.offsetHeight - this.$refs.footers.offsetHeight
    },
    checkOrder (currentDataLength) {
      this.currentOrder = (this.currentOrder < currentDataLength) ? this.currentOrder : 0
      return this.currentOrder
    },
    fetchData () {
      const options = {
        headers: {}
      }
      if (this.checkLogIn & ls.get(this.tokenName) !== null) {
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
      this.current_graph = event.graph
      this.current_month = event.month
      this.calcHeight()
    },
    reorder (event) {
      this.currentOrder = event
    },
    test () {
      console.log('swipe')
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

<style>
.table-sm {
  padding: 0 5px 0 5px
}
.bottom-align-text {
  position: absolute;
  bottom: 0;
  right: 0;
}
.nowrap {
  white-space: nowrap;
}
</style>
