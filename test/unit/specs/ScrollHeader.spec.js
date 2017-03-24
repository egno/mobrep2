import Vue from 'vue'
import ScrollHeader from '@/components/ScrollHeader'

describe('ScrollHeader.vue', () => {
  it('should render correct count of cells', () => {
    const vm = new Vue({
      template: `<div><scroll-header
      :data="cells"
      >
      </scroll-header></div>`,
      components: {
        ScrollHeader
      },
      data () {
        return {
          cells: ['cell1', 'cell2']
        }
      }
    }
    ).$mount()
    expect(vm.$el.querySelectorAll('.scrollarea .row .cell').length)
      .to.equal(2)
  })
})
