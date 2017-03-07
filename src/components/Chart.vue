<template>
  <div ref="chart">
    <div v-if="data" class="max">
      <div class="row max">
        <div class="col scrolled">
          <section v-for="row in data" >
            <chart-row :row="row" :scalebase="baseValues">
            </chart-row>
          </section>
        </div>
      </div>
    </div>
    <div v-if="!data" class="max">
      <p>
         Подождите, данные загружаются...
      </p>
    </div>
  </div>
</template>

<script>
  import ChartRow from '@/components/ChartRow'

  export default {
    props: [
      'base',
      'captions',
      'data',
      'height'
    ],
    computed: {
      baseValues () {
        return {
          max: this.data.reduce((r, x) => x.values.map((xx, i) => Math.max(r[i] || 0, xx)), []),
          min: this.data.reduce((r, x) => x.values.map((xx, i) => Math.min(r[i] || 0, xx)), []),
          base: this.base
        }
      },
      curr_data () {
        return this.data
      },
      colIndex () {
        if (this.data) {
          switch (this.data[0].values.length) {
            case 3:
              return 3
            case 2:
              return 4
            default:
              return 8
          }
        }
      }
    },
    components: {
      ChartRow
    },
    watch: {
      'height': 'setHeight'
    },
    methods: {
      calcBars () {
        return 0
      },
      setHeight () {
        this.$refs.chart.style.height = this.height + 'px'
      }
    },
    mounted () {
      this.setHeight()
    },
    updated () {
      this.calcBars()
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
