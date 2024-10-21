import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import { useAuthStore } from '@/stores/Auth/useAuthStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true } 
    },
    
  ]
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Check if user is authenticated (i.e., if token exists in authStore or localStorage)
  const isAuthenticated = authStore.token || localStorage.getItem('token');

  // Redirect to login if trying to access a protected route and not authenticated
  if (to.meta.requiresAuth && !authStore.token) {
    next(`/login?next=${to.fullPath}`);
  }
  // Prevent access to login if already authenticated
  else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'home' });  // Redirect authenticated users to home
  } else {
    next();  // Allow the navigation if all conditions are met
  }
});
export default router
