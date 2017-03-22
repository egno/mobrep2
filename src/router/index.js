import Vue from 'vue'
import Router from 'vue-router'
import ReportsList from '@/components/ReportsList'
import Report from '@/components/Report'
import Table from '@/components/Table'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: ReportsList
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/report/:name',
      name: 'report',
      component: Report,
      props: true
    },
    {
      path: '/table/:name',
      name: 'table',
      component: Table,
      props: true
    }
  ]
})
