<template>
  <div
    ref="main"
    class="align-items-start scrollarea"
    v-if="(data)"
    >
    <div v-for="(row, i) in currentData"
    :key="i"
    class="row">
      <table-cell
      v-for="(cell, ii) of row"
      :key="ii"
      class="col center fixed-width"
      align="center"
      :value="cell.value"
      :bar="cell.bar"
      ></table-cell>
    </div>
  </div>
</template>

<script>
import TableCell from '@/components/TableCell'

export default {
  props: {
    data: {},
    totals: {},
    width: 0,
    height: 24
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
      return this.data.map((x) => {
        x = x.map((xx, ii) => {
          return {
            value: xx,
            bar: (!Array.isArray(xx)) ? {
              width: this.barWidth(xx, this.currentTotals[ii].min, this.currentTotals[ii].max) || 0,
              x: this.barStart(xx, this.currentTotals[ii].min, this.currentTotals[ii].max) || 0
            } : ''
          }
        })
        return x
      })
    },
    currentTotals () {
      return this.data.reduce((r, x, i) => {
        return x.map((xx, ii) => {
          r[ii] = r[ii] || {min: 0, max: 0}
          return {
            max: Math.max(r[ii].max || 0, xx),
            min: Math.min(r[ii].min || 0, xx)
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
    setSize () {
      if (this.data && this.width) {
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
