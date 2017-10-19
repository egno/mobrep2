<template>
  <div class="cell"
  :style="{height: rowHeight + 'px'}""
  @click="onClick(i)">
    <svg
    >
      <text v-if="!isArray" :x="x" :y="rowHeight/2 + 4" >{{ value | beautyNumber(decimal) }}</text>
      <text class="curr" v-if="isArray && value.length > 0" :x="x" :y="rowHeight/2 + 3" >{{ value[0] | beautyNumber(decimal) }}</text>
      <text :class="['prev', {incr: isGrowing(value)}, {decr: isFalling(value)}]" v-if="isArray && value.length > 1" x="100" :y="10" >{{ percent(value) }}</text>
      <text :class="['prev']" v-if="isArray && value.length > 1" x="100" :y="rowHeight/2 + 14" >{{ value[1] | beautyNumber(decimal, nullSign = '') }}</text>
      <rect v-if="showBar" :width="bar.width + '%'" :fill="color" :x="bar.x" :height="rowHeight"></rect>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    value: '',
    i: 0,
    bar: {},
    decimal: 0,
    pos: {
      default: 0
    },
    rowHeight: {
      default: 24
    },
    align: ''
  },
  computed: {
    color () {
      let h = (((this.isArray) ? this.value[0] : this.value) < 0) ? 0 : 90
      let s = 40
      let l = 90
      let a = 1
      return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')'
    },
    isArray () {
      return Array.isArray(this.value)
    },
    showBar () {
      return (this.bar)
    },
    x () {
      return (this.align === 'center') ? '50%' : (this.align === 'right') ? '78' : '5'
    }
  },
  methods: {
    isFalling (value) {
      return (this.isArray && ((value[0] || 0) < (value[1] || 0)))
    },
    isGrowing (value) {
      return (this.isArray && ((value[0] || 0) > (value[1] || 0)))
    },
    onClick (payload) {
      if (payload === 0 || payload) {
        this.$emit('click', payload)
      }
    },
    percent (value) {
      if (this.isArray) {
        const percent = (value[0] / value[1] - 1) * 100
        if (percent && percent !== Infinity) {
          return percent.toFixed(0) + '%'
        }
      }
    }
  },
  filters: {
    beautyNumber: function (value, decimal = 0, nullSign = '-') {
      if (!value ||
        value === undefined ||
        value === Infinity ||
        value === null ||
        ((typeof (value) !== 'string') && isNaN(+value)) ||
        value === '') {
        return nullSign
      } else {
        if (typeof (value) === 'string' && isNaN(+value)) {
          return value
        } else {
          return (+value).toFixed(decimal).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
        }
      }
    }
  }
}
</script>

<style scoped>
svg {
  x: 0;
  opacity: 1;
  width: 100%;
  height: 100%;
  border-style: inset;
  border-width: 0 1px 1px 0;
  border-color: #f5f5f5;
}
svg rect {
  height: 100%;
  fill-opacity: 0.2;
  stroke-opacity: 0.2;
  stroke: #bbb;
}
svg line {
  fill-opacity: 0.8;
  stroke-opacity: 0.3;
  stroke: gray;
}
svg text {
}
.cell {
  padding: 0;
  min-height: 24px;
}
.center {
  text-anchor: middle;
}
.right {
  text-anchor: end;
}
.curr {
  text-anchor:end;
}
.prev {
  text-anchor:end;
  font-size: 0.7em;
  fill: #aaa;
}
.incr {
  fill: #8a8;
}
.decr {
  fill: #caa;
}
</style>
