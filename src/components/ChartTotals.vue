<template>
  <div class="row bg-faded">
      <div class="col-3 text-left small table-sm">
        {{ totals.caption }}
      </div>
      <div class="text-right small table-sm nowrap" :class="'col-' + colIndex" v-for="(column, i) in totals.columns">
        {{ column }}
      </div>
  </div>
</template>

<script>
export default {
  props: [
    'totals'
  ],
  computed: {
    colIndex () {
      if (this.totals) {
        switch (this.totals.columns.length) {
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
</style>
