import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/login.vue'

const routes = [
  {
    path: '/',
    alias: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/setup',
    name: 'SetupPage',
    component: () => import('@/pages/setup.vue')
  },
  {
    path: '/admin',
    name: 'AdminPage',
    component: () => import('@/pages/admin.vue')
  },
  {
    path: '/link/:code',
    name: 'LinkPage',
    component: () => import('@/pages/link.vue')
  },
  // {
  //   path: "/meeting-recording/:id",
  //   name: "SingleMeetingRecording",
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "singleMeetingRecording" */ "../views/SingleMeetingRecording.vue"
  //     ),
  // },
  // {
  //   type: 'yup',
  //   text: 'YUP APP',
  //   path: '/app',
  //   href: 'https://app.yup.io',
  //   redirect: 'https://app.yup.io'
  // },
  // {
  //   type: "yup",
  //   text: "YUP DOCS",
  //   path: "/docs",
  //   href: "https://docs.yup.io",
  //   redirect: 'https://docs.yup.io'
  // },
  // {
  //   type: "yup",
  //   text: "YUP Staking",
  //   path: "/finance",
  //   href: "https://yup.finance/",
  //   redirect: 'https://app.yup.io/staking'
  // },
  {
    name: "ErrorPage",
    path: "/:pathMatch(.*)*",
    alias: "/error/code/:code",
    component: () => import('@/pages/custom-error.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export { routes, router }
