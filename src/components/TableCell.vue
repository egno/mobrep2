<template>
  <div class="cell">
    <svg>
      <text v-if="showBar" :x="x" y="17" >{{ value | beautyNumber }}</text>
      <text v-if="!showBar" :x="x" y="12" >{{ value | beautyNumber }}</text>
      <rect v-if="showBar" :width="bar.width + '%'" :fill="color" :x="bar.x" :height="'100%'"></rect>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    value: '',
    bar: {},
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
    showBar () {
      return (this.bar)
    },
    x () {
      return (this.align === 'center') ? '50%' : '5'
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
          if ((value ^ 0) === value) {
            return value
          } else {
            return value.toFixed(1)
          }
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
</style>
