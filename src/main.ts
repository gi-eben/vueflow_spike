import { createApp } from 'vue'
import { DraggablePlugin } from '@braks/revue-draggable'
import App from './App.vue'
import './css/tailwind.css'

// vue-flow
import '@vue-flow/core/dist/style.css'
// import '@vue-flow/core/dist/theme-default.css'

const app = createApp(App)

app.use(DraggablePlugin)

app.mount('#app')
