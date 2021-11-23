import { createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import global from '@/utils/global'
import utils from '@/utils/utils1'
import components from '@/components'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'default-passive-events'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@/styles/common.scss'
// import './permission'
// mookjs拦截
// import './mock'

const app = createApp(App)
app.use(store).use(router).use(ElementPlus, {
    locale: zhCn,
  }).use(components).component('QuillEditor', QuillEditor).mount('#app')

app.config.globalProperties.global = global
app.config.globalProperties.utils = utils
// console.log(app.config, '')