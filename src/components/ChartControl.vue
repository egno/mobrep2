<template>
  <div class="row navbar navbar-inverse bg-inverse">
    <div class="btn-toolbar">
      <div class="btn-group btn-group-sm">
        <button class="btn btn-secondary btn-sm " @click="goHome">≡</button>
      </div>
      <div  v-if="showArrows" class="btn-group">
        <button class="btn btn-secondary " @click="graphInc(-1)"> < </button>
        <button class="btn btn-secondary " @click="graphInc(1)"> > </button>
      </div>
      <select v-if="haveGraphs" class="custom-select custom-select-sm form-control" v-model="selected_graph">
        <option v-for="(graph, i) in graphs.list" v-bind:value="i">{{ graph }}</option>
      </select>
      <select v-if="haveMonths" class="custom-select custom-select-sm form-control" v-model="selected_month">
        <option v-for="(month, i) in months.list" v-bind:value="i">{{ month }}</option>
      </select>
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
  computed: {
    haveGraphs () {
      return (this.graphs && this.graphs.list && this.graphs.list.length > 0 && this.graphs.list[0] && this.graphs.list[0] !== undefined)
    },
    haveMonths () {
      return (this.months && this.months.list && this.months.list.length > 0 && this.months.list[0] && this.months.list[0] !== undefined)
    },
    isTouchDevice () {
      return !!('ontouchstart' in window)
    },
    showArrows () {
      return !this.isTouchDevice && !this.small
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
      if (this.haveGraphs) {
        this.selected_graph = (this.selected_graph + this.graphs.list.length + payload) % this.graphs.list.length
      }
    },
    isChanged () {
      let sendData = {graph: this.selected_graph, month: this.selected_month}
      this.$emit('isChanged', sendData)
    },
    updateSelected () {
      if (this.graphs) {
        this.selected_graph = this.graphs.selected
      }
      if (this.months) {
        this.selected_month = this.months.selected
      }
    }
  },
  mounted () {
    this.updateSelected()
  },
  beforeUpdate () {
    this.updateSelected()
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
