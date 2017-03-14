<template>
  <div ref="chart">
    <div v-if="data" class="max">
      <div class="row max">
        <div ref="scrolled" class="col scrolled max" @touchstart="_onTouchStart">
          <section v-for="row in curr_data" >
            <chart-row
            :row="row"
            :scalebase="baseValues"
            @reorder="reorder">
            </chart-row>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ChartRow from '@/components/ChartRow'

  export default {
    data () {
      return {
        startPos: 0,
        delta: 0,
        scrollPos: 0
      }
    },
    props: [
      'data',
      'order'
    ],
    computed: {
      baseValues () {
        if (this.curr_data) {
          return {
            max: this.curr_data.reduce((r, x) => x.values.map((xx, i) => Math.max(r[i] || 0, xx)), []),
            min: this.curr_data.reduce((r, x) => x.values.map((xx, i) => Math.min(r[i] || 0, xx)), []),
            base: this.data.base
          }
        }
      },
      captions () {
        return this.data.map(x => x.caption)
      },
      curr_data () {
        return this.data.data
      },
      colIndex () {
        if (this.curr_data) {
          switch (this.curr_data[0].values.length) {
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
    components: {
      ChartRow
    },
    watch: {
      'height': 'setHeight'
    },
    methods: {
      _onTouchStart (e) {
        this.startPos = this._getTouchPos(e)
        this.scrollPos = this.$refs.scrolled.scrollTop
        this.delta = 0

        document.addEventListener('touchmove', this._onTouchMove, false)
        document.addEventListener('touchend', this._onTouchEnd, false)
      },
      _onTouchMove (e) {
        this.delta = this._getTouchPos(e) - this.startPos
        this.$refs.scrolled.scrollTop = this.scrollPos - this.delta
      },
      _onTouchEnd (e) {
        // this.$refs.scrolled.scrollTop -= this.delta

        document.removeEventListener('touchmove', this._onTouchMove)
        document.removeEventListener('touchend', this._onTouchEnd)
      },
      _getTouchPos (e) {
        var key = 'pageY'
        return e.changedTouches ? e.changedTouches[0][key] : e[key]
      },
      calcBars () {
        return 0
      },
      reorder (event) {
        this.$emit('reorder', event)
      }
    },
    mounted () {
      this._onTouchMove = this._onTouchMove.bind(this)
      this._onTouchEnd = this._onTouchEnd.bind(this)
    },
    updated () {
      this.calcBars()
    }
  }
</script>

<style scoped>
.row {
  margin-left: -0.8em;
  margin-right: -0.8em;
}
</style>
