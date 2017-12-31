import Vue from 'vue'
import Router from 'vue-router'
import Cli from '@/components/Cli'
import BigWilly from '@/components/BigWilly'

Vue.use(Router)

export default new Router({
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
