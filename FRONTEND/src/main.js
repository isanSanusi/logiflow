import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useMainStore } from '@/stores/main.js'
import { useDarkModeStore } from './stores/darkMode.js'
import api from "@/plugin/Axios.js";
import App from './App.vue'
import router from './router'
import './css/main.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

app.use(router)
app.config.globalProperties.$api = api;
app.mount('#app')

const darkModeStore = useDarkModeStore(pinia)
const mainStore = useMainStore(pinia)

mainStore.fetchSampleClients()
mainStore.fetchSampleHistory()


if (
  (!localStorage['darkMode'] && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
  localStorage['darkMode'] === '1'
) {
  darkModeStore.set(true)
}

const defaultDocumentTitle = 'Logiflow'

router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} - ${defaultDocumentTitle}`
    : defaultDocumentTitle
})
