<template>
  <div class="row navbar navbar-inverse bg-faded">
    <div class="btn-toolbar-sm ">
      <div class="btn-group btn-group-sm">
        <button class="btn btn-secondary btn-sm " @click="graphInc(-1)"> < </button>
        <button class="btn btn-secondary btn-sm" @click="graphInc(1)"> > </button>
      </div>
      <select class="custom-select custom-select-sm form-control-sm" v-model="selected.graph">
        <option v-for="(graph, i) in graphs.list" v-bind:value="i">{{ graph }}</option>
      </select>
      <select class="custom-select custom-select-sm form-control-sm" v-model="selected.month">
        <option v-for="(month, i) in months.list" v-bind:value="i">{{ month }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'graphs',
    'months'
  ],
  data () {
    return {
      selected: {
        graph: 0,
        month: 0
      }
    }
  },
  watch: {
    'selected.graph': 'isChanged',
    'selected.month': 'isChanged'
  },
  methods: {
    graphInc (payload) {
      this.selected.graph = (this.selected.graph + this.graphs.list.length + payload) % this.graphs.list.length
    },
    isChanged () {
      this.$emit('isChanged', this.selected)
    }
  },
  created () {
    this.selected.graph = this.graphs.selected
    this.selected.month = this.months.selected
  }
}
</script>

<style scoped>
.navbar {
  overflow-y: auto;
}
</style>
