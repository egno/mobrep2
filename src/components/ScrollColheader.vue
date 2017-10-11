<template>
  <div class="scrollarea" v-if="(data)">
    <table-cell
    v-for="value in headers"
    :key="value"
    :rowHeight="rowHeight"
    :value="value"
    ></table-cell>
    <table-cell
    :rowHeight="17">
    </table-cell>
  </div>
</template>

<script>
import TableCell from '@/components/TableCell'

export default {
  props: {
    data: {},
    rowHeight: {
      default: 24
    },
    width: ''
  },
  components: {
    TableCell
  },
  computed: {
    headers () {
      if (this.data && this.data.length > 0) {
        return this.data
      }
    }
  }
}
</script>

<style scoped>
.scrollarea {
  height: auto;
  min-height: 100%;
  width: 100%;
}
</style>
