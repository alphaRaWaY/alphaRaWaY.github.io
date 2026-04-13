import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CnblogKitView from '../views/CnblogKitView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/cnblog-kit',
      name: 'cnblog-kit',
      component: CnblogKitView,
    },
  ],
})

export default router
