<template>
  <div ref="chart">
    <div v-if="data" class="max">
      <div class="row max">
        <div class="col scrolled max">
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
  import math from 'mathjs'

  export default {
    props: [
      'data',
      'order'
    ],
    computed: {
      baseValues () {
        if (this.curr_data) {
          let arr = this.curr_data.reduce((r, x) =>
            x.values.map((xx, i) => {
              if (!r[i]) {
                r[i] = []
              }
              r[i].push(xx)
              return r[i]
            })
            , [])
          return {
            max: this.curr_data.reduce((r, x) => x.values.map((xx, i) => Math.max(r[i] || 0, xx)), []),
            min: this.curr_data.reduce((r, x) => x.values.map((xx, i) => Math.min(r[i] || 0, xx)), []),
            std: arr.map(x => math.std(x)),
            mean: arr.map(x => math.mean(x)),
            base: this.data.base
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
</style>
