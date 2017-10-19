<template>
  <div
    ref="main"
    class="align-items-start scrollarea"
    v-if="(data)"
    >
    <div v-for="(row, i) in currentData"
    :key="i"
    :style="{height: (100 / currentData.length) +'%'}"
    class="row row-1">
      <table-cell
      v-for="(cell, ii) of row"
      :key="ii"
      :i="ii"
      class="col right fixed-width"
      align="right"
      :value="cell.value"
      :bar="cell.bar"
      :decimal="cell.decimal"
      :rowHeight="rowHeight"
      @click="percentSwitch"
      ></table-cell>
    </div>
  </div>
</template>

<script>
import TableCell from '@/components/TableCell'

export default {
  props: {
    data: {},
    decimals: {},
    percentColumn: {},
    rowHeight: {
      default: 24
    },
    rowInfo: {},
    totals: {},
    width: 0
  },
  components: {
    TableCell
  },
  watch: {
    'width': 'setSize',
    'data': 'setSize'
  },
  computed: {
    currentData () {
      return this.data
      .map((x, i) => {
        x = x.map((xx, ii) => {
          return {
            value: xx,
            decimal: this.decimals[ii],
            bar: (!Array.isArray(xx)) ? {
              width: (this.rowInfo[i].showBar) ? this.barWidth(xx, this.currentTotals[ii].min, this.currentTotals[ii].max) || 0 : 0,
              x: this.barStart(xx, this.currentTotals[ii].min, this.currentTotals[ii].max) || 0
            } : {
              width: (this.rowInfo[i].showBar) ? this.barWidth(xx[0], this.currentTotals[ii].min, this.currentTotals[ii].max) || 0 : 0,
              x: this.barStart(xx[0], this.currentTotals[ii].min, this.currentTotals[ii].max) || 0
            }
          }
        })
        return x
      })
    },
    currentTotals () {
      return this.data.filter((x, i) => this.rowInfo[i].showBar).reduce((r, x, i) => {
        return x.map((xx, ii) => {
          r[ii] = r[ii] || {min: 0, max: 0}
          return {
            max: Math.max(r[ii].max || 0, ((Array.isArray(xx)) ? xx[0] : xx) || 0),
            min: Math.min(r[ii].min || 0, ((Array.isArray(xx)) ? xx[0] : xx) || 0)
          }
        })
      }, [])
    }
  },
  methods: {
    barWidth (value, min, max) {
      return 100 * (
        (value > 0)
        ? value / (max - Math.min(min, 0))
        : value / (min - Math.max(max, 0))
      )
    },
    barStart (value, min, max) {
      const start = -Math.min(min, 0)
      const width = Math.max(max, 0) + start
      return 100 * (
        (value > 0)
        ? start / width
        : (start + value) / width
      )
    },
    percentSwitch (event) {
      this.$emit('percentSwitch', event)
    },
    setSize () {
      if (this.data && this.width && this.data[0]) {
        this.$refs.main.style.width = (this.width * Object.keys(this.data[0]).length) + 'px'
        this.$refs.main.style.height = (this.height * this.data.length) + 'px'
      }
    }
  },
  mounted () {
    this.setSize()
  }

}
</script>

<style scoped>
</style>
