<template>
  <div class="col max">
    <div v-if="!data" class="max align-middle">
      <div class="col">
        <p>
           Подождите, данные загружаются...
        </p>
      </div>
      <div class="progress">
        <div class="progress-bar progress-bar-striped" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
    <div v-if="data" class="max">
      <chart-header ref="header"
      :headers="headers"
      :order="order"
      @reorder="reorder">
      </chart-header>
      <chart-main ref="chart"
      :data="current_data"
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
    current_data () {
      let result = this.data
      result.base = this.page.columns[1] && this.page.columns[1].type
      return result
    },
    headers () {
      let result = {caption: {name: this.fixedHeaderCaption, ordered: false},
        columns: this.page.columns.map(x => {
          return {name: x.name}
        })}
      if (this.page && this.page.columns && this.page.columns[1]) {
        switch (this.page.columns[1].type) {
          case 'percent':
            result.columns.push({name: this.percentCaption, ordered: false})
            break
          case 'part':
            result.columns.push({name: this.partCaption, ordered: false})
        }
      }
      return result
    },
    partCaption () {
      return '(' + this.page.columns[0].name[0] + '/' + this.page.columns[1].name[0] + ')'
    },
    totals () {
      if (this.data.totals) {
        return this.data.totals.map(x => (x || 0).toFixed(1))
      } else {
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
.scrolled {
  overflow: auto;
}
.small {
  padding-top: 0.3em;
  font-size: 60%;
}
.max {
  height: 100%
}
.nowrap {
  white-space: nowrap
}
.col {
}
</style>
