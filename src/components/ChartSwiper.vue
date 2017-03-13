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
        :page="page"
        :data="data[i]"
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
  computed: {
    chartData () {
      return
    }
  },
  methods: {
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
