import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import { i18n } from './i18n'
import 'vant/lib/index.css'
import { 
  Button,
  Search,
  NavBar,
  Cell,
  CellGroup,
  Loading,
  NumberKeyboard
} from 'vant'

// 创建 Pinia 实例并配置
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 创建应用实例
const app = createApp(App)
app.config.productionTip = false  // 关闭生产环境提示

// 先安装 Pinia
app.use(pinia)

// 再安装其他插件
app.use(i18n)
app.use(Button)
app.use(Search)
app.use(NavBar)
app.use(Cell)
app.use(CellGroup)
app.use(Loading)
app.use(NumberKeyboard)
app.mount('#app') 
