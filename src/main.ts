import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import 'katex/dist/katex.min.css'
import './styles/global.css'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
