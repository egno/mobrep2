<template>
  <div :class="['row', 'navbar', 'navbar-inverse', 'ok']">
    <div class="btn-toolbar">
      <div class="btn-group btn-group-sm">
        <button class="btn btn-secondary btn-sm " @click="goHome" title="На главный экран">
        <span class="fa fa-home fa-lg" aria-hidden="true"></span>
      </button>
      </div>
      <select v-if="haveGraphs" class="custom-select custom-select-sm sm " v-model="selected_graph">
        <option v-for="(graph, i) in graphs.list" v-bind:value="i">{{ graph }}</option>
      </select>
      <select v-if="haveMonths" class="custom-select custom-select-sm sm " v-model="selected_month">
        <option v-for="(month, i) in months.list" v-bind:value="i">{{ month }}</option>
      </select>
      <div  v-if="showArrows" class="btn-group">
        <button class="btn btn-secondary btn-sm" @click="monthInc(-1)" title="Следующий период">
          <span class="fa fa-caret-up fa-lg"></span>
        </button>
        <button class="btn btn-secondary btn-sm" @click="monthInc(1)" title="Предыдущий период">
          <span class="fa fa-caret-down fa-lg"></span>
        </button>
      </div>
      <div class="btn-group btn-group-sm">
        <button :class="['btn', 'btn-secondary', 'btn-sm', {active: showHistory}]" @click="switchHistory" title="Сравнение с предыдущим периодом">
          <span class="fa fa-history fa-lg" aria-hidden="true"></span>
        </button>
      </div>
      <div class="btn-group btn-group-sm">
        <button class="btn btn-secondary btn-sm " @click="reload" :title="date">
          <span class="fa fa-refresh fa-lg" aria-hidden="true"></span>
        </button>
      </div>
      <div class="btn-group btn-group-sm">
        <button class="btn btn-secondary btn-sm " @click="help" title="Написать в техподдержку">
          <span class="fa fa-exclamation-triangle fa-lg" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { BrowserDetect } from '@/services/os'

export default {
  props: [
    'cache',
    'enableDB',
    'graphs',
    'months',
    'small',
    'report',
    'modDate',
    'showHistory'
  ],
  data () {
    return {
      selected_graph: 0,
      selected_month: 0
    }
  },
  computed: {
    ...mapGetters([
      'dataCache'
    ]),
    date () {
      if (this.modDate) {
        return this.modDate.toLocaleString('ru')
      }
    },
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
      return !this.small
    }
  },
  watch: {
    'selected_graph': 'isChanged',
    'selected_month': 'isChanged'
  },
  methods: {
    ...mapActions([
      'setDataCache'
    ]),
    getData () {
      const newDataCache = {}
      newDataCache[this.report] = {}
      this.setDataCache(newDataCache)
    },
    goHome () {
      this.$router.push('/')
    },
    graphInc (payload) {
      if (this.haveGraphs) {
        this.selected_graph = (this.selected_graph + this.graphs.list.length + payload) % this.graphs.list.length
      }
    },
    monthInc (payload) {
      if (this.haveMonths) {
        this.selected_month = (this.selected_month + this.months.list.length + payload) % this.months.list.length
      }
    },
    switchHistory (payload) {
      this.$emit('switchHistory')
    },
    help () {
      location.href = 'mailto:help@katren.ru; shelemetyev@katren.ru?subject=datazen. ' + this.report + '&body=' + encodeURIComponent(`

     --------------------
     Браузер:
` + JSON.stringify(BrowserDetect.info(), null, '  ') + `
     Данные:
` + JSON.stringify(window.location.href, null, '  '))
    },
    isChanged () {
      let sendData = {graph: this.selected_graph, month: this.selected_month}
      this.$emit('isChanged', sendData)
    },
    reload () {
      this.$emit('reload')
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
.sm {
  height: 2.5em;
}
.navbar {
  overflow-y: auto;
  padding: 5px;
}
.custom-select {
  max-width: 20em;
}
.attention {
  background-color: red;
}
.ok {
  background-color: #222;
}
</style>
