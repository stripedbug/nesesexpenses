import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import Home from '../views/Home.vue'
import Tags from '../views/Tags.vue'
import Reports from '../views/Reports.vue'
import ExpenditureItems from '../views/ExpenditureItems.vue'
import ExpenseCollections from '../views/ExpenseCollections.vue'
import Error404 from '../views/Error404.vue'
import Expenses from '../views/Expenses.vue'
import Login from '../views/Login.vue'
import App from '../views/App.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'App',
    component: App,
    children:[
      {
        path: '/',
        name: 'Home',
        component: Home
      },
      {
        path: '/tags',
        name: 'Tags',
        component: Tags
      },
      {
        path: '/reports',
        name: 'Reports',
        component: Reports
      },
      {
        path: '/expenditureitems',
        name: 'ExpenditureItems',
        component: ExpenditureItems
      },
      {
        path: '/expensecollections',
        name: 'ExpenseCollections',
        component: ExpenseCollections
      },
      {
        path: '/expenses',
        name: 'Expenses',
        component: Expenses
      },
      {                                                                                                                                                                                   
        path: '/:pathMatch(.*)*',                                                                                                                                                         
        name: 'error404',                                                                                                                                                                                      
        component: Error404                                                                                                                                                               
      },

    ]
  },
  ,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
