<template>
  <div class="row navbar navbar-inverse bg-inverse">
    <div class="btn-toolbar">
      <div  v-if="!small" class="btn-group">
        <button class="btn btn-secondary " @click="graphInc(-1)"> < </button>
        <button class="btn btn-secondary " @click="graphInc(1)"> > </button>
      </div>
      <select class="custom-select custom-select-sm form-control" v-model="selected_graph">
        <option v-for="(graph, i) in graphs.list" v-bind:value="i">{{ graph }}</option>
      </select>
      <select class="custom-select custom-select-sm form-control" v-model="selected_month">
        <option v-for="(month, i) in months.list" v-bind:value="i">{{ month }}</option>
      </select>
      <div class="btn-group btn-group-sm">
        <button class="btn btn-secondary btn-sm " @click="goHome">≡</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'graphs',
    'months',
    'small'
  ],
  data () {
    return {
      selected_graph: 0,
      selected_month: 0
    }
  },
  watch: {
    'selected_graph': 'isChanged',
    'selected_month': 'isChanged'
  },
  methods: {
    goHome () {
      this.$router.push('/')
    },
    graphInc (payload) {
      this.selected_graph = (this.selected_graph + this.graphs.list.length + payload) % this.graphs.list.length
    },
    isChanged () {
      let sendData = {graph: this.selected_graph, month: this.selected_month}
      this.$emit('isChanged', sendData)
    }
  },
  mounted () {
    this.selected_graph = this.graphs.selected
    this.selected_month = this.months.selected
  },
  beforeUpdate () {
    this.selected_graph = this.graphs.selected
    this.selected_month = this.months.selected
  }
}
</script>

<style scoped>
.navbar {
  overflow-y: auto;
  padding: 5px;
}
.custom-select {
  max-width: 20em;
}
</style>
