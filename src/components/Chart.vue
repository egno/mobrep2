<template>
  <div class="col max">
    <div v-if="!data" class="max">
      <p>
         Подождите, данные загружаются...
      </p>
    </div>
    <div v-if="data" class="max">
      <chart-header ref="header"
      :headers="headers"
      :order="order"
      @reorder="reorder">
      </chart-header>
      <chart-main ref="chart"
      :data="data"
      :order="order"
      @reorder="reorder">
      </chart-main>
      <chart-totals ref="foother"
      :totals="{caption: totlalCaption,
        columns: totals}">
      </chart-totals>
    </div>
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
    'page',
    'order'
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
    headers () {
      let result = {caption: {name: this.fixedHeaderCaption, ordered: false},
        columns: this.page.columns.map(x => {
          return {name: x.name}
        })}
      if (this.page && this.page.columns
        .reduce((r, x) => r || x.type === 'base', false)
      ) {
        result.columns.push({name: this.percentCaption, ordered: false})
      }
      return result
    },
    totals () {
      if (this.page && this.page.columns && this.data && this.data.data) {
        return this.data.data
          .reduce((r, x) => x.values.map((xx, i) => (r[i] || 0) + (+xx || 0)), [])
          .map((x, i) => {
            switch ((this.page.columns[i]) ? this.page.columns[i].total : 'avg') {
              case 'sum':
                return '∑ ' + x.toFixed(1)
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
    getWindowHeight (event) {
      // console.log(event)
      let self = this
      setTimeout(function () {
        self.setHeight()
      }, 10)
    },
    reorder (event) {
      this.$emit('reorder', event)
    },
    setHeight () {
      if (this.$refs.chart) {
        this.$refs.chart.$el.style.height = (this.$refs.chart.$parent.$el.offsetHeight - this.$refs.header.$el.offsetHeight - this.$refs.foother.$el.offsetHeight) + 'px'
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowHeight)
      this.getWindowHeight()
    })
  },
  updated () {
    this.setHeight()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowHeight)
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
