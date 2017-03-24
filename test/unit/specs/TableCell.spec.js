import Vue from 'vue'
import TableCell from '@/components/TableCell'

describe('TableCell.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      template: `<div><table-cell
      value="test"
      ></table-cell></div>`,
      components: {
        TableCell
      }
    }
    ).$mount()
    expect(vm.$el.querySelector('.cell svg text').textContent)
      .to.equal('test')
  })
})
