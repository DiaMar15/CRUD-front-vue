import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import RestoreView from '@/views/RestoreView.vue'
import InventarioView from '@/views/inventarioView.vue'
import DashboardView from '@/views/HomeView.vue'
import ConfiguracionView from '@/views/ConfiguracionView.vue' 
import FacturacompraView from '@/views/FacturacompraView.vue'
import entradaSalidaProductosView from '@/views/entradaSalidaProducto.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { layout: 'AuthLayout' },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { layout: 'AuthLayout' },
    },
    {
      path: '/restore',
      name: 'restore',
      component: RestoreView,
      meta: { layout: 'AuthLayout' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { layout: 'WireframeLayout' }
    },
    {
      path: '/dashboard/inventario',
      name: 'inventario',
      component: InventarioView,
      meta: { layout: 'WireframeLayout' }
    },
    {
      path: '/dashboard/configuracion',
      name: 'configuracion',
      component: ConfiguracionView,
      meta: { layout: 'WireframeLayout' }
    },
    {
      path: '/dashboard/facturas-compra',
      name: 'facturas-compra',
      component: FacturacompraView,
      meta: { layout: 'WireframeLayout' }
    },
     {
      path: '/dashboard/zona-pesaje',
      name: 'zona-pesaje',
      component: entradaSalidaProductosView,
      meta: { layout: 'WireframeLayout' }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router