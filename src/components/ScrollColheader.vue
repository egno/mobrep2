<template>
  <div class="scrollarea" v-if="(data)">
    <table-cell
    v-for="value in headers"
    :key="value"
    :value="value"
    ></table-cell>
  </div>
</template>

<script>
import TableCell from '@/components/TableCell'

export default {
  props: {
    data: {},
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
  height: 1000px;
  width: 100%;
}
</style>
