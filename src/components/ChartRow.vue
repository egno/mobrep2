<template>
  <div ref="row" class="row chart-row">
    <svg ref="bar2" class="basebar" width="0" height="0"></svg>
    <svg ref="bar" width="0" height="0"></svg>
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
      }
    },
    methods: {
      setBar () {
        const min = 220
        function percent2hex (x) {
          x = Math.max(Math.min(x, 1), 0)
          return ('0' + parseInt(min + (x * (255 - min))).toString(16)).slice(-2)
        }
        let maxValue = this.scalebase.max[0]
        if (this.scalebase.base && this.row) {
          maxValue = Math.max(maxValue, this.scalebase.max[1])
          if (maxValue) {
            this.$refs.bar2.setAttribute('width', Math.min((this.row.values[1] || 0) / maxValue, 1) * 100 + '%')
          }
        } else {
          if (maxValue) {
            this.$refs.bar2.setAttribute('width', '0')
          }
        }
        if (maxValue) {
          this.$refs.bar.setAttribute('width', Math.min((this.row.values[0] || 0) / maxValue, 1) * 100 + '%')
          if (this.row.values[2]) {
            this.$refs.bar.setAttribute('style', 'background-color: #' + percent2hex(1 - (this.row.values[2] / this.scalebase.max[2])) + percent2hex(this.row.values[2] / this.scalebase.max[2]) + 'ee')
          }
          if (this.row.values.length === 2 && this.row.values[1]) {
            this.$refs.bar.setAttribute('style', 'background-color: #' + percent2hex(1 - (this.row.values[1] / this.scalebase.max[1])) + percent2hex(this.row.values[1] / this.scalebase.max[1]) + 'ee')
          }
        }
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
          value === null ||
          ((typeof (value) !== 'string') && isNaN(value)) ||
          value === '') {
          return nullSign
        } else {
          if (typeof (value) === 'string') {
            return value
          } else {
            return value.toFixed(0)
          }
        }
      }
    },
    mounted () {
      this.setBar()
    },
    updated () {
      this.setBar()
    }
  }
</script>

<style scoped>
svg {
  position: absolute;
  border: 0;
  background-color: #eee;
  height: 1.2em;
  x: 0;
  opacity: 0.7;
}
.basebar {
  background-color: #d5d5d5;
  opacity: 1;
}
.chart-row {
  height: 1.3em;
  border-style: dotted;
  border-width: 0 0 1px 0;
  border-color: lightgray;
}
</style>
