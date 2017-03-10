<template>
  <div class="row bg-faded">
      <div class="col-3 text-left small table-sm" :class="(headers.caption.ordered) ? 'mark' : ''" @click="setOrder(0)">
        {{ headers.caption.name }}
      </div>
      <div class="text-right small table-sm nowrap" :class="['col-' + colIndex, (column.ordered) ? 'mark' : '']" v-for="(column, i) in headers.columns" @click="setOrder(i + 1)">
        {{ column.name }}
      </div>
  </div>
</template>

<script>
export default {
  props: [
    'headers'
  ],
  computed: {
    colIndex () {
      if (this.headers) {
        switch (this.headers.columns.length) {
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
    setOrder (payload) {
      this.$emit('reorder', payload)
    }
  }
}
</script>

<style scoped>
.mark {
  font-weight: bold;
  background-color: inherit;
}
</style>
