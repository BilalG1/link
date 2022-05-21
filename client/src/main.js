import { createApp } from 'vue'
import { createRouter, createWebHistory } from "vue-router";

import App from './App.vue'
import Forwarder from './components/Forwarder.vue'
import Home from './components/Home.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/:link', props: true, component: Forwarder },
]
  
const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
