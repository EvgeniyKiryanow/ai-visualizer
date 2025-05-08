import { createRouter, createWebHistory } from 'vue-router'
import Home from '../src/views/Home.vue'
import About from '../src/views/About.vue'
import Dashboard from '../src/views/Dashboard.vue'
import Tree from '../src/views/Tree.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/dashboard', component: Dashboard },
  { path: '/tree', component: Tree } 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
