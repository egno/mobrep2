<template>
  <div>
    <chart-control
      :graphs="{list: graph_list, selected: current_graph}"
      :months="{list: month_list, selected: current_month}"
      @isChanged="graphIsChanged"
      >
    </chart-control>
    <chart-header
      :headers="{caption: caption,
        columns: headers}"
      >
    </chart-header>
    <chart
      :captions="captions"
      :data="curr_data"
      :height="chart_height">
    </chart>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ls } from './../services/localStore'
import Chart from '@/components/Chart'
import ChartControl from '@/components/ChartControl'
import ChartHeader from '@/components/ChartHeader'

export default {
  data () {
    return {
      uri: 'gdlivescreen',
      data: {},
      graphs: [
        { caption: '! Факт',
          columns: [
            { name: 'Факт,млн.р', caption: 'Факт' },
            { name: 'План,млн.р', type: 'base' }
          ]
        },
        {
          columns: [
            { name: 'Выполн.%' },
            { name: 'Выпол. Год, %', type: 'base' }
          ]
        },
        {
          columns: [
            { name: '%РН' },
            { name: 'РН.млн.р', type: 'saturation' }
          ]
        },
        {
          columns: [ { name: 'РН.млн.р' }, { name: 'РН на душу нас.' } ]
        },
        {
          columns: [ { name: 'ДЗ,млн.р' }, { name: 'ДЗ,%проср' } ]
        },
        {
          columns: [ { name: 'Оборот ДЗ' }, { name: 'ДЗ,%проср' } ]
        },
        {
          columns: [ { name: '%ЭСП' } ]
        },
        {
          columns: [ { name: 'Скл.наимен.' }, { name: 'На скл,млн.р' } ]
        },
        {
          columns: [ { name: 'В пути,мл.р' }, { name: 'В пути,дн' } ]
        },
        {
          columns: [ { name: 'Резерв,дн' }, { name: 'В пути,дн' } ]
        },
        {
          columns: [ { name: 'На скл,млн.р' }, { name: 'На скл,дн' } ]
        },
        {
          columns: [ { name: 'Фин.цикл,дн' } ]
        },
        {
          columns: [ { name: 'Прибыль,млн.р' }, { name: 'ТС,млн.р' } ]
        },
        {
          columns: [ { name: 'УП(1000ч.)' }, { name: 'Доля филиала' } ]
        }
      ],
      caption: 'Филиал',
      current_graph: 0,
      current_month: 0,
      chart_height: 300,
      graph: {
        minheight: 0,
        transitiontime: 1000,
        intensity1: 30,
        intensity2: 20,
        colors: 360,
        colorshift: 60,
        chart: {},
        column: {},
        data: {},
        rowcaptions: [],
        ordercol: 0,
        asc: true
      }
    }
  },
  computed: {
    ...mapGetters([
      'checkLogIn',
      'tokenName'
    ]),
    captions () {
      if (this.data[this.current_month]) {
        return this.data[this.current_month].data
          .map(x => x[this.caption])
      }
    },
    curr_data () {
      if (this.data[this.current_month] && this.graphs[this.current_graph].columns) {
        return this.data[this.current_month].data
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
        .map(x =>
          (x.caption) ? x.caption : x.name
        )
      if (this.graphs[this.current_graph].columns
        .reduce((r, x) => r || x.type === 'base', false)
      ) {
        result.push(percentCaption)
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
    }
  },
  components: {
    Chart,
    ChartControl,
    ChartHeader
  },
  methods: {
    ...mapActions([
      'logOut'
    ]),
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
    graphIsChanged (event) {
      this.current_graph = event.graph
      this.current_month = event.month
    }
  },
  created () {
    this.fetchData()
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
</style>
