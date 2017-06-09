<template>
  <div class="row max">
    <div v-if="(data)" class="col max">
      <div class="row header">
        <div class="fixed-column">
           <table-cell
           :value="fixedColumn"
           :i="0"
           @click="reorder"
           ></table-cell>
        </div>
        <div
          id="header"
          ref="header"
          class="col header"
          v-scroll="onScroll">
          <scroll-header
          :data="headers"
          :width="columnWidth"
          @reorder="reorder"
          >
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
           :decimals="decimals"
           :percentColumn="colPercent"
           :totals="totalsData"
           :width="columnWidth"
           @percentSwitch="percentSwitch"
           >
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
          class="col header foother"
          v-scroll="onScroll">
          <scroll-header
          :data="totalsData"
          :decimals="decimals"
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
      columnWidth: 100,
      showInPercent: []
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
    colPercent () {
      return this.showInPercent.map(x => x.percent)
    },
    decimals () {
      const def = 3
      return this.headers.map((h, i) =>
        this.data.map(x => x.values[i])
        .reduce((r, xx) => {
          return {
            max: Math.max(r.max || 0, (Array.isArray(xx)) ? xx[0] : xx),
            min: Math.min(r.min || 0, (Array.isArray(xx)) ? xx[0] : xx)
          }
        }, [])
      )
      .map((x, i) => (this.showInPercent[i] && this.showInPercent[i].percent) ? 1 : this.calcDecimal(x.min, x.max, def))
    },
    mainData () {
      if (this.data) {
        return this.data.map((x) => x.values.map((xx, ii) => (this.showInPercent && this.showInPercent[ii] && this.showInPercent[ii].percent) ? ((Array.isArray(xx) ? xx[0] : xx) * 100.0 / ((Array.isArray(this.totals[ii])) ? this.totals[ii][0] : this.totals[ii])).toFixed(1) + '%' : xx))
      }
    },
    totalsData () {
      if (this.totals && this.totals[0]) {
        return this.totals.map((x, i) => (this.showInPercent && this.showInPercent[i] && this.showInPercent[i].percent) ? '100%' : x)
      }
    }
  },
  watch: {
    'headers': 'fillPercentColumns'
  },
  methods: {
    calcDecimal (min, max, def) {
      let natlen = Math.max(Math.abs(min), Math.abs(max)).toFixed(0).length
      let decfirst = String(Math.max(Math.abs(min), Math.abs(max))).search(/[^0\\.]/) - 2
      return (Math.max(Math.abs(min), Math.abs(max)).toFixed(0) !== '0') ? Math.max(0, def - natlen) : (decfirst + def)
    },
    fillPercentColumns () {
      if (this.headers) {
        this.showInPercent = this.headers.map((h, i) => {
          return {percent: false}
        })
      }
    },
    getWindowHeight (event) {
      // console.log(event)
      let self = this
      setTimeout(function () {
        self.setHeight()
      }, 10)
    },
    onScroll (e, position) {
      if (!e) {
        position = this.$refs.mainarea
      }
      if (!e || e.target.id === 'mainarea') {
        this.$refs.colheader.scrollTop = position.scrollTop
        this.$refs.header.scrollLeft = position.scrollLeft
        this.$refs.foother.scrollLeft = position.scrollLeft
      }
    },
    reorder (event) {
      this.$emit('reorder', event)
    },
    percentSwitch (event) {
      const newVal = (this.totals && this.totals[0]) && (this.headers[event].search('%') === -1) && !(this.showInPercent[event] && this.showInPercent[event].percent)
      this.showInPercent[event].percent = newVal
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
    this.fillPercentColumns()
  },
  updated () {
    this.setHeight()
    this.onScroll()
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
.foother {
  font-size: 1.3em;
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
  width: 132px;
}
</style>
