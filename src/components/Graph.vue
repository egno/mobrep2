<template>
  <div calss="col">
    <chart-control
      :graphs="{list: graph_list, selected: current_graph}"
      :months="{list: month_list, selected: current_month}"
      @isChanged="graphIsChanged"
      >
      </chart-control>
    <chart :captions="captions" :data="curr_data"></chart>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ls } from './../services/localStore'
import Chart from '@/components/Chart'
import ChartControl from '@/components/ChartControl'

export default {
  data () {
    return {
      uri: 'gdlivescreen',
      data: {},
      graphs: [
        {
          columns: ['Факт,млн.р', 'План,млн.р']
        },
        {
          columns: ['Выполн.%', 'Выпол. Год, %']
        },
        {
          columns: ['%РН'],
          saturation: 'РН.млн.р'
        }
      ],
      caption: 'Филиал',
      current_graph: 0,
      current_month: 0,
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
            return {
              caption: x[this.caption],
              values: this.graphs[this.current_graph].columns
                .map(c => x[c]),
              saturation:
                (this.graphs[this.current_graph].saturation)
                  ? x[this.graphs[this.current_graph].saturation]
                  : (this.graphs[this.current_graph].columns.length > 1)
                    ? x[this.graphs[this.current_graph].columns[0]] / x[this.graphs[this.current_graph].columns[1]]
                    : 1
            }
          })
      }
    },
    graph_list () {
      return this.graphs.map(x => x.columns[0])
    },
    month_list () {
      return (this.data.length > 0) ? this.data.map(x => x.month) : {}
    }
  },
  components: {
    Chart,
    ChartControl
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
