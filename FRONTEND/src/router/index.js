import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/LoginView.vue'
import Welcome from '@/views/Welcome.vue'
import Home from '@/views/HomeView.vue'
import NotFound from '@/views/NotFound/pages.vue'

import {useCompanyStore} from '@/stores/companyStore.js'
import {useAuthStore} from '@/stores/authStore.js'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'SignIn' },
  },
  {
    path: '/',
    name: 'welcome',
    component: Welcome,
    meta: { title: 'Welcome', requiresAuth: true},

  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Home,
    meta: { title: 'Dashboard' ,requiresAuth: true, roles : ['developer', 'SUPER_ADMIN','ADMIN', 'USER'] },
  },
  {
    path: '/companies',
    name: 'companies',
    meta: { title: 'Lists', requiresAuth: true, roles : ['developer'] },
    component: () => import('@/views/CompanyList.vue'),
  },
  {
    path: '/users',
    name: 'users',
    meta: { title: 'Lists' , requiresAuth: true, roles : ['SUPER_ADMIN','ADMIN'] },
    component: () => import('@/views/UsersList.vue'),
  },
  {
    path: '/inbox',
    name: 'order',
    meta: { title: 'Order', requiresAuth: true, roles : ['SUPER_ADMIN','ADMIN'] },
    component: () => import('@/views/Inbox.vue'),
  },
  {
    path: '/inbox',
    name: 'Detail page',
    meta: { title: 'Lists', requiresAuth: true, roles : ['SUPER_ADMIN','ADMIN'] },
    component: () => import('@/components/Tables/Transactions.vue'),
  },
  {
    path: '/review',
    name: 'Review page',
    meta: { title: 'Review', requiresAuth: true, roles : ['USER'] },
    component: () => import('@/views/Preview.vue'),
  },
  {
    path: '/sent',
    name: 'Sent History',
    meta: { title: 'Review', requiresAuth: true, roles : ['USER'] },
    component: () => import('@/views/SentData.vue'),
  },
  {
    path: '/input',
    name: 'input',
    meta: { title: 'Input', requiresAuth: true, roles : ['USER'] },
    component: () => import('@/views/Input.vue'),
  },
  {
    path: '/forms',
    name: 'forms',
    meta: { title: 'Forms' , requiresAuth: true, roles : ['developer', 'SUPER_ADMIN','ADMIN', 'USER'] }, 
    component: () => import('@/views/DropdownViews/FormsView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    meta: { title: 'Profile' ,requiresAuth: true, roles : ['developer', 'SUPER_ADMIN','ADMIN', 'USER'] },
    component: () => import('@/views/DropdownViews/ProfileView.vue'),
  },
  {
    path: '/ui',
    name: 'ui',
    meta: { title: 'Ui' ,requiresAuth: true, roles : ['developer', 'SUPER_ADMIN','ADMIN', 'USER'] },
    component: () => import('@/views/DropdownViews/UiView.vue'),
  },
  { path: "/:catchAll(.*)", name: "NotFound", component: NotFound },
  { path: "/NotFound", name: "NotFound", component: NotFound },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const companyStore = useCompanyStore()
  const authStore = useAuthStore();

  // pastikan authStore terinisialisasi
  if (!authStore.isAuthenticated) {
    await authStore.initializeAuth(); // pastikan ini async selesai
  }

  const userRole = authStore.role;

  // redirect ke login jika butuh auth
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next("/login");
  } else if (to.path === "/login" && authStore.isAuthenticated) {
    return next("/");
  }

  // cek roles setelah auth siap
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    return next({ name: "NotFound" });
  }

  // cek companyId jika ada params.id
  if (to.params.id) {
    const companyId = Number(to.params.id);
    if (companyStore.companies.length === 0) {
      try {
        await companyStore.fetchCompanies();
      } catch (err) {
        console.error("Gagal fetch company:", err);
        alert("Gagal memuat data perusahaan.");
        return next("/");
      }
    }
    const exists = companyStore.companies.some((c) => c.id === companyId);
    if (!exists) {
      alert("Company tidak ditemukan!");
      return next("/login");
    }
  }

  next();
});

export default router
