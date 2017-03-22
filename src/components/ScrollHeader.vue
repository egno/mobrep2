<template>
  <div
    ref="main"
    class="row scrollarea"
    v-if="(data)">
    <table-cell
    v-for="value in headers"
    :key="value"
    class="col fixed-width"
    :value="value"
    ></table-cell>
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
  computed: {
    headers () {
      if (this.data && this.data.length > 0) {
        return this.data
      }
    }
  },
  methods: {
    setWidth () {
      if (this.data && this.width) {
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
