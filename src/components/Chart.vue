<template>
  <div class="row">
    <div ref="chart" class="col scrolled">
      <div class="row" v-for="row in data">
        <div class="col-3 text-left small table-sm nowrap">
          {{ row.caption }}
        </div>
        <div class="text-right table-sm" :class="'col-' + colIndex" v-for="value in row.values">
          {{ value | beautyNumber }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'captions',
      'data',
      'height'
    ],
    computed: {
      curr_data () {
        return this.data
      },
      colIndex () {
        if (this.data) {
          switch (this.data[0].values.length) {
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
    watch: {
      'height': 'setHeight'
    },
    filters: {
      beautyNumber: function (value) {
        const nullSign = '-'
        if (!value ||
          value === undefined ||
          value === null ||
          isNaN(value) ||
          value === '') {
          return nullSign
        } else {
          return value
        }
      }
    },
    methods: {
      setHeight () {
        this.$refs.chart.style.height = this.height + 'px'
      }
    },
    mounted () {
      this.setHeight()
    }
  }
</script>

<style scoped>
.scrolled {
  overflow: auto;
}
.small {
  font-size: 65%;
}
</style>
