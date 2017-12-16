import Vue from 'vue'
import Router from 'vue-router'
import Cli from '@/components/Cli'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Cli',
      component: Cli
    }
  ]
})
