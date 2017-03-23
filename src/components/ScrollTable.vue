<template>
  <div class="row max">
    <div v-if="(data)" class="col max">
      <div class="row header">
        <div class="fixed-column">
           <table-cell
           :value="fixedColumn"
           ></table-cell>
        </div>
        <div
          id="header"
          ref="header"
          class="col header"
          v-scroll="onScroll">
          <scroll-header
          :data="headers"
          :width="columnWidth">
        </scroll-header>
        </div>
      </div>
      <div
        ref="mainrow"
        class="row mainrow">
        <div
          id="colheader"
          ref="colheader"
          class="max header colheader fixed-column"
          v-scroll="onScroll">
          <scroll-colheader
          :data="colHeaders">
          </scroll-colheader>
        </div>
        <div
          id="mainarea"
          ref="mainarea"
          class="max col scrollbox"
          v-scroll="onScroll">
           <scroll-main
           :data="mainData"
           :totals="totalsData"
           :width="columnWidth">
           </scroll-main>
        </div>
      </div>
      <div class="row header">
        <div class="fixed-column">
           <table-cell
           :value="'ИТОГО'"
           ></table-cell>
        </div>
        <div
          id="foother"
          ref="foother"
          class="col header"
          v-scroll="onScroll">
          <scroll-header
          :data="totalsData"
          :width="columnWidth">
        </scroll-header>
        </div>
      </div>
    </div>
    <div v-if="!(data)" class="max col align-middle">
      <div class="col">
        <p>
           Подождите, данные загружаются...
        </p>
      </div>
      <div class="progress">
        <div class="progress-bar progress-bar-striped" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  </div>
</template>

<script>
import TableCell from '@/components/TableCell'
import ScrollHeader from '@/components/ScrollHeader'
import ScrollColheader from '@/components/ScrollColheader'
import ScrollMain from '@/components/ScrollMain'

export default {
  data () {
    return {
      columnWidth: 100
    }
  },
  props: {
    data: {},
    fixedColumn: '',
    headers: {
      type: Array
    },
    totals: {}
  },
  components: {
    ScrollColheader,
    ScrollHeader,
    ScrollMain,
    TableCell
  },
  computed: {
    colHeaders () {
      if (this.data) {
        return this.data.map((x) => x.caption)
      }
    },
    mainData () {
      if (this.data) {
        return this.data.map((x) => x.values)
      }
    },
    totalsData () {
      if (this.totals) {
        return this.totals
      }
    }
  },
  methods: {
    getWindowHeight (event) {
      // console.log(event)
      let self = this
      setTimeout(function () {
        self.setHeight()
      }, 10)
    },
    onScroll (e, position) {
      switch (e.target.id) {
        case 'mainarea':
          this.$refs.colheader.scrollTop = position.scrollTop
          this.$refs.header.scrollLeft = position.scrollLeft
          this.$refs.foother.scrollLeft = position.scrollLeft
          break
      }
    },
    setHeight () {
      if (this.$refs.mainrow) {
        this.$refs.mainrow.style.height = (this.$el.offsetHeight - this.$refs.header.offsetHeight - this.$refs.foother.offsetHeight) + 'px'
        this.$refs.mainarea.style.width = (this.$el.offsetWidth - this.$refs.colheader.offsetWidth) + 'px'
        this.$refs.header.style.width = (this.$el.offsetWidth - this.$refs.colheader.offsetWidth) + 'px'
        this.$refs.foother.style.width = (this.$el.offsetWidth - this.$refs.colheader.offsetWidth) + 'px'
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowHeight)
      this.getWindowHeight()
    })
  },
  updated () {
    this.setHeight()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getWindowHeight)
  }
}
</script>

<style>
.max {
  height: 100%
}
.scrollbox {
  overflow: auto;
}
.header {
  background-color: #eee;
  overflow: hidden;
}
.cell {
  height: 24px;
  overflow: hidden;
}
.header .cell {
  font-size: 0.7em;
  font-weight: bold;
  padding-top: 0.2em;
}
.fixed-width {
  width: 100px;
  text-align: right;
}
.fixed-column {
  width: 150px;
}
</style>
