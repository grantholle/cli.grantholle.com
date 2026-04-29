import { createRouter, createWebHistory } from 'vue-router'
import Cli from '@/components/Cli.vue'
import BigWilly from '@/components/BigWilly.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Cli',
      component: Cli
    },
    {
      path: '/the-fresh-prince',
      name: 'BigWilly',
      component: BigWilly
    }
  ]
})
