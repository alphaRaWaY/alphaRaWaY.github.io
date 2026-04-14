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
    {
      path: '/posts',
      name: 'posts',
      component: () => import('../views/PostListView.vue'),
    },
    {
      path: '/posts/:slug',
      name: 'post-detail',
      component: () => import('../views/PostDetailView.vue'),
    },
  ],
})

export default router
