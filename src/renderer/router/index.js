import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/bus/manage',
      component: resolve => require(['@/components/bus/manage'], resolve)
    },
	  {
		  path: '/bus/new',
		  component: resolve => require(['@/components/bus/new'], resolve)
	  },
	  {
		  path: '/promptBox/:type/:data?',
		  component: resolve => require(['@/components/prompt-box/index'], resolve)
	  },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
