<template>
  <div ref="row" class="row chart-row">
    <svg :height="barHeight">
      <rect v-if="hasBase" :width="barWidth[1]" fill="#ccc" :height="barHeight"></rect>
      <rect :width="barWidth[0]" :fill="color" :x="barStart" :height="barHeight"></rect>
      <line :x1="barStart" :x2="barStart" y1="0" y2="100%"></line>
    </svg>
    <div class="col-3 text-left small table-sm nowrap" @click="setOrder(0)">
      {{ row.caption }}
    </div>
    <div class="text-right table-sm" :class="'col-' + colIndex" v-for="(value, i) in row.values" @click="setOrder(i + 1)">
      {{ value | beautyNumber }}
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'row',
      'scalebase'
    ],
    computed: {
      barHeight () {
        return '1.3em'
      },
      barWidth () {
        return [
          this.formatPercent(this.row.values[0]),
          this.formatPercent(this.row.values[1])
        ]
      },
      barStart () {
        return this.formatPercent(Math.max(Math.min(this.row.values[0] || 0, 0) - this.minValue, 0))
      },
      colIndex () {
        if (this.row) {
          switch (this.row.values.length) {
            case 3:
              return 3
            case 2:
              return 4
            default:
              return 8
          }
        }
      },
      color () {
        return this.hslaColor(this.row.values.length - 1)
      },
      hasBase () {
        return (this.scalebase && this.scalebase.base)
      },
      maxValue () {
        return Math.max((!this.hasBase) ? this.scalebase.max[0] : Math.max(this.scalebase.max[0], this.scalebase.max[1]), 0)
      },
      minValue () {
        return Math.min((!this.hasBase) ? this.scalebase.min[0] : Math.min(this.scalebase.max[0], this.scalebase.min[1]), 0)
      }
    },
    methods: {
      formatPercent (value) {
        return ((Math.min((Math.abs(value) || 0) / (this.maxValue - this.minValue), 1) * 100) || 0) + '%'
      },
      hexColor (i) {
        const min = 220
        function percent2hex (x) {
          x = Math.max(Math.min(x, 1), 0)
          return ('0' + parseInt(min + (x * (255 - min))).toString(16)).slice(-2)
        }
        return '#' + percent2hex(1 - (this.row.values[1] / this.scalebase.min[1])) + percent2hex(this.row.values[1] / this.scalebase.max[1]) + 'ee'
      },
      isDefined (value) {
        return !(!value ||
          value === undefined ||
          value === Infinity ||
          value === null ||
          ((typeof (value) !== 'string') && isNaN(value)) ||
          value === '')
      },
      rgbColor (i) {
        const maxColor = 254
        let red = ((Math.max(-this.row.values[0], 0)) / this.maxValue * maxColor).toFixed(0)
        let green = ((Math.max(this.row.values[0], 0)) / this.maxValue * maxColor).toFixed(0)
        let blue = 0
        console.log(this.row.values[0], this.maxValue, red, green)
        return 'rgb(' + red + ',' + green + ',' + blue + ')'
      },
      hslaColor (i) {
        const min = 0
        const max = 1
        let h = (this.row.values[i] < 0) ? 0 : 90
        let s = ((Math.abs(this.row.values[i] || 0) / ((this.row.values[i] > 0) ? this.scalebase.max[i] : -this.scalebase.min[i]) || 0) * (max - min) + min) *
          80
        let l = 50
        let a = 1
        return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')'
      },
      setOrder (payload) {
        this.$emit('reorder', payload)
      }
    },
    filters: {
      beautyNumber: function (value) {
        const nullSign = '-'
        if (!value ||
          value === undefined ||
          value === Infinity ||
          value === null ||
          ((typeof (value) !== 'string') && isNaN(value)) ||
          value === '') {
          return nullSign
        } else {
          if (typeof (value) === 'string') {
            return value
          } else {
            return value.toFixed(1)
          }
        }
      }
    }
  }
</script>

<style scoped>
svg {
  position: absolute;
  x: 0;
  opacity: 1;
  width: 100%;
  border-style: dotted;
  border-width: 0 0 1px 0;
  border-color: lightgray;
}
svg rect {
  height: 100%;
  fill-opacity: 0.4;
  stroke-opacity: 0.2;
  stroke: gray;
}
svg line {
  fill-opacity: 0.8;
  stroke-opacity: 0.3;
  stroke: gray;
}
.chart-row {
  height: 1.3em;
}
</style>
