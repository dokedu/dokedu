import { createRouter, createWebHistory } from 'vue-router/auto'

const router = createRouter({
  history: createWebHistory(),
});

const allowedRoutes = [
  '/login',
  '/forgot-password',
  '/reset-password',
]

router.beforeEach(async (to) => {
  if (
    // make sure the user is authenticated
    !localStorage.getItem('authorization') &&
    // to.name !== 'login'
    !allowedRoutes.includes(to.name as string)
  ) {
    // redirect the user to the login page
    return { name: '/login' }
  }
})

export default router;
