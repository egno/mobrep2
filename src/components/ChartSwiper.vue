<template>
  <swiper id="swiper" ref="chartswiper" class="swiper"
    direction="horizontal"
    :mousewheelControl="false"
    :activePage="activePage + 1"
    @slide-change-start="setIndex">
    <div
    v-for="(page, i) in pages"
    >
      <chart
        :fixedHeaderCaption="fixedHeaderCaption"
        :order="order"
        :page="page"
        :data="chartData(i)"
        @reorder="reorder"
      >
      </chart>
    </div>
  </swiper>
</template>

<script>
import Swiper from '@/components/VueSwiper'
import Chart from '@/components/Chart'

export default {
  props: {
    data: {},
    fixedHeaderCaption: '',
    order: {
      type: Number,
      default: 0
    },
    pages: {},
    activePage: {
      type: Number,
      default: 0
    }
  },
  components: {
    Swiper,
    Chart
  },
  methods: {
    chartData (i) {
      if (this.data) {
        return this.data[i]
      }
    },
    reorder (event) {
      this.$emit('reorder', event)
    },
    setIndex (index) {
      if (index) {
        let sendData = {graph: index - 1}
        this.$emit('isChanged', sendData)
      }
    }
  }
}
</script>

<style>
.swiper {
  width: 100%;
  height: 100%;
}
</style>
