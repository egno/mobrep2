<template>
  <div class="row bg-faded">
      <div class="col-3 text-left small table-sm">
        {{ headers.caption }}
      </div>
      <div class="text-right small table-sm" :class="'col-' + colIndex" v-for="(column, i) in headers.columns">
        {{ column }}
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
  }
}
</script>

<style scoped>
.small {
}
</style>
