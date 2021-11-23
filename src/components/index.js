
import defaultDialog from './default-dialog' // 默认弹框
import pages from './pages' // 默认弹框

// 组件list
const components = [defaultDialog,pages]
// 绑定到全局
const commonComponents = {
  install: function (Vue) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}
export default commonComponents
