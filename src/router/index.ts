import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const views = {
  MainLayout: () => import('@/layouts/MainLayout.vue'),
  HomePage: () => import('@/views/HomePage.vue'),
}
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'MainLayout',
    component: views.MainLayout,
    children: [{ path: '', name: 'HomePage', component: views.HomePage }],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
