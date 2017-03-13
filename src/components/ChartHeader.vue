<template>
  <div class="row bg-faded" v-if="(headers) && (headers.caption) && (headers.columns)">
      <div class="col-3 text-left small table-sm" :class="(!order) ? 'mark' : ''" @click="setOrder(0)">
        {{ headers.caption.name }}
      </div>
      <div class="text-right small table-sm nowrap" :class="['col-' + colIndex, (order === i+1) ? 'mark' : '']" v-for="(column, i) in headers.columns" @click="setOrder(i + 1)">
        {{ column.name }}
      </div>
  </div>
</template>

<script>
export default {
  props: [
    'headers',
    'order'
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
