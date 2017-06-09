<template>
  <div class="cell"
  @click="onClick(i)">
    <svg>
      <text v-if="showBar" :x="x" y="17" >{{ value | beautyNumber(decimal) }}</text>
      <text v-if="!showBar && !isArray" :x="x" y="16" >{{ value | beautyNumber(decimal) }}</text>
      <text class="curr" v-if="isArray && value.length > 0" :x="x" y="16" >{{ value[0] | beautyNumber(decimal) }}</text>
      <text class="prev" v-if="isArray && value.length > 1" x="100" y="16" >{{ value[1] | beautyNumber(decimal) }}</text>
      <rect v-if="showBar" :width="bar.width + '%'" :fill="color" :x="bar.x" :height="'100%'"></rect>
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
    align: ''
  },
  computed: {
    color () {
      let h = (this.value < 0) ? 0 : 90
      let s = 80
      let l = 50
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
      if (this.isArray) {
        return '50%'
      } else {
        return (this.align === 'center') ? '50%' : (this.align === 'right') ? '75' : '5'
      }
    }
  },
  methods: {
    onClick (payload) {
      if (payload === 0 || payload) {
        this.$emit('click', payload)
      }
    }
  },
  filters: {
    beautyNumber: function (value, decimal) {
      const nullSign = '-'
      if (!value ||
        value === undefined ||
        value === Infinity ||
        value === null ||
        ((typeof (value) !== 'string') && isNaN(value)) ||
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
  border-style: dotted;
  border-width: 0 1px 1px 0;
  border-color: lightgray;
}
svg rect {
  height: 100%;
  fill-opacity: 0.2;
  stroke-opacity: 0.2;
  stroke: gray;
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
}
.center {
  text-anchor: middle;
}
.right {
  text-anchor: end;
}
.curr {
  text-anchor:end;
  font-size: 0.9em;
}
.prev {
  text-anchor:end;
  font-size: 0.7em;
  fill: #00a;
}
</style>
