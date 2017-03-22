<template>
  <div
    ref="main"
    class="scrollarea"
    v-if="(data)"
    >
    <div v-for="(row, i) in data"
    :key="i"
    class="row">
      <table-cell
      v-for="(value, ii) of row"
      :key="ii"
      class="col fixed-width"
      :value="value"
      ></table-cell>
    </div>
  </div>
</template>

<script>
import TableCell from '@/components/TableCell'

export default {
  props: {
    data: {},
    width: 0
  },
  components: {
    TableCell
  },
  watch: {
    'width': 'setWidth',
    'data': 'setWidth'
  },
  methods: {
    setWidth () {
      if (this.data && this.width) {
        this.$refs.main.style.width = (this.width * Object.keys(this.data[0]).length) + 'px'
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
  height: 1000px;
}
</style>
