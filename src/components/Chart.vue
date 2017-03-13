<template>
  <div class="col max">
    <chart-header ref="header"
    :headers="headers">
    </chart-header>
    <chart-main ref="chart"
    :data="data"
    :height="chartHeight">
    </chart-main>
    <chart-totals ref="foother"
    :totals="{caption: totlalCaption,
      columns: totals}">
    </chart-totals>
  </div>
</template>

<script>
import ChartMain from '@/components/ChartMain'
import ChartHeader from '@/components/ChartHeader'
import ChartTotals from '@/components/ChartTotals'

export default {
  data () {
    return {
      totlalCaption: 'ИТОГО',
      percentCaption: '(%)'
    }
  },
  props: [
    'data',
    'fixedHeaderCaption',
    'page'
  ],
  components: {
    ChartMain,
    ChartHeader,
    ChartTotals
  },
  watch: {
    'height': 'setHeight'
  },
  computed: {
    chartHeight () {
    },
    headers () {
      let result = {caption: {name: this.fixedHeaderCaption, ordered: false},
        columns: this.page.columns.map(x => {
          return {name: x.name}
        })}
      if (this.page.columns
        .reduce((r, x) => r || x.type === 'base', false)
      ) {
        result.columns.push({name: this.percentCaption, ordered: false})
      }
      return result
    },
    totals () {
      if (this.data) {
        return this.data.data
          .reduce((r, x) => x.values.map((xx, i) => (r[i] || 0) + (+xx || 0)), [])
          .map((x, i) => {
            switch ((this.page.columns[i]) ? this.page.columns[i].total : 'avg') {
              case 'sum':
                return x.toFixed(1)
              case 'avg':
                return (x / this.data.data.length).toFixed(1)
              default:
                return null
            }
          })
      }
    }
  },
  methods: {
    headers () {
      const percentCaption = '(%)'
      let result = this.page.columns
        .filter(x => !x.hidden)
        .map((x, i) => {
          return {
            name: (x.caption) ? x.caption : x.name,
            ordered: (i === this.currentOrder - 1)
          }
        }
        )
      if (this.page.columns
        .reduce((r, x) => r || x.type === 'base', false)
      ) {
        result.push({name: percentCaption, ordered: (result.length === this.currentOrder - 1)})
      }
      return result
    },
    setHeight () {
      if (this.$refs.chart) {
        this.$refs.chart.$el.style.height = (this.$refs.chart.$parent.$el.offsetHeight - this.$refs.header.$el.offsetHeight - this.$refs.foother.$el.offsetHeight) + 'px'
      }
    }
  },
  mounted () {
    this.setHeight()
  },
  updated () {
    this.setHeight()
  }
}
</script>

<style>
.chart-row {
  border:  lightgray;
  border-width: 0 0 1px 0;
  height: 1.3em;
}
.chart-row .table-sm {
  margin-top: -0.1em;
}
.chart-row .small {
    margin-top: 0.2em;
}
.scrolled {
  overflow: auto;
}
.small {
  font-size: 65%;
}
.max {
  height: 100%
}
</style>
