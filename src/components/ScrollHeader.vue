<template>
  <div
    ref="main"
    class="scrollarea"
    >
    <div class="row ">
      <table-cell
      v-for="(value, i) in headers"
      :key="i"
      :class="['col', 'fixed-width', align]"
      :align="align"
      :value="value"
      :decimal="calcDecimals(i)"
      :i="i + 1"
      :rowHeight="rowHeight"
      @click="reorder"
      ></table-cell>
    </div>
  </div>
</template>

<script>
import TableCell from '@/components/TableCell'

export default {
  props: {
    align: {
      default: 'center'
    },
    data: {},
    decimals: {},
    rowHeight: {
      default: 24
    },
    width: 0
  },
  components: {
    TableCell
  },
  watch: {
    'width': 'setWidth',
    'data': 'setWidth'
  },
  computed: {
    headers () {
      if (this.data && this.data.length > 0) {
        return this.data
      }
    }
  },
  methods: {
    calcDecimals (i) {
      return (this.decimals) ? this.decimals[i] : 0
    },
    isSwitched (value) {
      if (value.group) {
        return value.group.length > 1
      }
    },
    reorder (event) {
      this.$emit('reorder', event)
    },
    setWidth () {
      if (this.data && this.width && this.data.length) {
        this.$refs.main.style.width = (this.width * this.data.length) + 'px'
      }
    }
  },
  mounted () {
    this.setWidth()
  }
}
</script>

<style scoped>
.scrollarea {
}
</style>
