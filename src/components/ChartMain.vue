<template>
  <div ref="chart">
    <div v-if="data" class="max">
      <div class="row max">
        <div class="col scrolled">
          <section v-for="row in curr_data" >
            <chart-row
            :row="row"
            :scalebase="baseValues"
            @reorder="reorder">
            </chart-row>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ChartRow from '@/components/ChartRow'

  export default {
    props: [
      'data',
      'order'
    ],
    computed: {
      baseValues () {
        if (this.curr_data) {
          return {
            max: this.curr_data.reduce((r, x) => x.values.map((xx, i) => Math.max(r[i] || 0, xx)), []),
            min: this.curr_data.reduce((r, x) => x.values.map((xx, i) => Math.min(r[i] || 0, xx)), []),
            base: {}
          }
        }
      },
      captions () {
        return this.data.map(x => x.caption)
      },
      curr_data () {
        return this.data.data
      },
      colIndex () {
        if (this.curr_data) {
          switch (this.curr_data[0].values.length) {
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
      reorder (event) {
        this.$emit('reorder', event)
      }
    },
    mounted () {
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
