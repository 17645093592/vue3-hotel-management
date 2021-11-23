import { createStore } from 'vuex'

// 导入主题颜色
import theme from './modules/theme'
import user from './modules/user'

export default createStore({
  //定义模块
  modules: {
    theme,user
  }
})
