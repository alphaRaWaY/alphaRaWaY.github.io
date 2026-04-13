import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/cnblog-kit',
      name: 'cnblog-kit',
      component: () => import('../views/CnblogKitView.vue'),
    },
  ],
})

export default router
