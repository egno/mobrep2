<template>
  <div class="row max" ref="main">
    <div v-if="(data)" class="col max">
      <div class="row header" :style="{height: minRowHeight + 'px'}">
        <div class="fixed-column">
           <table-cell
           :value="fixedColumn"
           :i="0"
           :rowHeight="minRowHeight"
           @click="reorder"
           ></table-cell>
        </div>
        <div
          id="header"
          ref="header"
          class="col header"
          :height="minRowHeight"
          v-scroll="onScroll">
          <scroll-header
          :data="headers"
          :width="columnWidth"
          :rowHeight="minRowHeight"
          @reorder="reorder"
          >
        </scroll-header>
        </div>
      </div>
      <div
        ref="mainrow"
        class="row mainrow"
        :style="{height: rowHeight + 'px'}">
        <div
          id="colheader"
          ref="colheader"
          class="max header colheader fixed-column"
          v-scroll="onScroll">
          <scroll-colheader
          :data="rowHeaders"
          :rowHeight="rowHeight">
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
           :rowHeight="rowHeight"
           :totals="totalsData"
           :width="columnWidth"
           :rowInfo="rowInfoDiasplayed"
           @percentSwitch="percentSwitch"
           >
           </scroll-main>
        </div>
      </div>
      <div class="row header">
        <div class="fixed-column">
           <table-cell
           :rowHeight="minRowHeight"
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
          :rowHeight="minRowHeight"
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
      showInPercent: [],
      minRowHeight: 24,
      rowHeight: 36
    }
  },
  props: {
    data: {},
    defDecimals: {},
    fixedColumn: '',
    fixedTotals: {
      default: true
    },
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
    rowHeaders () {
      if (this.rowInfo) {
        return this.rowInfo.filter(x => x.show).map(x => x.caption)
      }
    },
    colPercent () {
      return this.showInPercent.map(x => x.percent)
    },
    decimals () {
      const def = 0
      if (this.headers) {
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
        .map((x, i) => (this.defDecimals[i] !== undefined) ? this.defDecimals[i] : x)
      } else {
        return {}
      }
    },
    mainData () {
      if (this.data && this.rowInfo) {
        return this.data.filter((x, i) => (x.caption && this.rowInfo[i].show))
          .map((x) => x.values.map((xx, ii) =>
            (this.showInPercent && this.showInPercent[ii] && this.showInPercent[ii].percent)
            ? (
              ((Array.isArray(xx) ? xx[0] : xx) || 0) * 100.0 /
              (
                (Array.isArray(this.totals[ii]))
                ? this.totals[ii][0]
                : this.totals[ii]
              )
            ).toFixed(1) + '%'
            : xx
          )
        )
      }
    },
    rowCount () {
      return this.rowInfo.filter(x => x.show).length || 1
    },
    rowInfo () {
      if (this.data) {
        return this.data.map((x, i) => {
          return {
            caption: x.caption,
            showBar: x.caption && x.caption.indexOf('-опт') === -1,
            show: x.values.reduce((rr, xx) => rr || (!!((Array.isArray(xx) ? xx[0] : xx) || 0) && !!(x.caption)), false)
          }
        })
      }
    },
    rowInfoDiasplayed () {
      if (this.rowInfo) {
        return this.rowInfo.filter(x => x.show)
      }
    },
    totalsData () {
      if (this.totals && this.totals[0]) {
        return this.totals.map((x, i) => (this.showInPercent && this.showInPercent[i] && this.showInPercent[i].percent) ? '100%' : x)
      }
    }
  },
  watch: {
    'headers': 'fillPercentColumns',
    'data': 'setHeight'
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
      if ((!e || e.target.id === 'mainarea') && this.$refs.colheader) {
        this.$refs.colheader.scrollTop = position.scrollTop
        this.$refs.header.scrollLeft = position.scrollLeft
        this.$refs.foother.scrollLeft = position.scrollLeft
      }
    },
    reorder (event) {
      this.$emit('reorder', event)
    },
    percentSwitch (event) {
      this.$emit('percentSwitch', event)
    },
    // percentSwitch (event) {
    //   const newVal = (
    //       this.totals &&
    //       this.totals[event] &&
    //       !isNaN(+(Array.isArray(this.totals[event]) ? this.totals[event][0] : this.totals[event]))
    //     ) &&
    //     (this.headers[event].search('%') === -1) &&
    //     !(this.showInPercent[event] && this.showInPercent[event].percent)
    //   this.showInPercent[event].percent = newVal
    // },
    setHeight () {
      if (this.$refs.mainrow && this.mainData) {
        const calcRowsHeight = this.rowHeight * this.rowCount + 17
        this.$refs.mainrow.style.height = Math.min(calcRowsHeight, this.$el.offsetHeight - this.$refs.header.offsetHeight - this.$refs.foother.offsetHeight) + 'px'
        this.$refs.mainarea.style.width = (this.$el.offsetWidth - this.$refs.colheader.offsetWidth) + 'px'
        this.$refs.header.style.width = (this.$el.offsetWidth - this.$refs.colheader.offsetWidth) + 'px'
        this.$refs.foother.style.width = (this.$el.offsetWidth - this.$refs.colheader.offsetWidth) + 'px'
        // const calcRowHeight = (this.$refs.mainarea.offsetHeight - 17) / (this.data.length)
        // this.rowHeight = (calcRowHeight > this.minRowHeight) ? calcRowHeight : this.minRowHeight
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
  overflow-x: auto;
}
.header {
  background-color: #e4e4e4;
  font-weight: bold;
  overflow: hidden;
}
.colheader {
  background-color: #f4f4f4;
}
.foother {
  font-size: 1.3em;
}
.cell {
  overflow: hidden;
}
.header .cell {
  font-size: 0.7em;
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
