import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import LoginPage from "../views/LoginPage";

import { Role } from '@/_helpers';
import {authService} from "../_services";
import ContainerDashboard from "../views/ContainerDashboard";

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { authorize: [] }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/trip',
      name: 'container-dashboard',
      component: ContainerDashboard,
      meta: { authorize: [] },
      props: (route) => ({
        trip_id: route.query.trip_id
      })
    }
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const { authorize } = to.meta;
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const currentUser = authService.currentUserValue;

  // If the user is logged in and wants to go to login, send him to home
  if (!authRequired && currentUser) {
    return next('/');
  }
  
  // If authorize is undefined, it means anyone can see the page, then go to next()
  if (authorize) {
    // If the user is not logged in and the page is not login, go to login
    if (authRequired && !currentUser) {
      return next('/login');
    }

    // If his role doesn't allow him to go to that page, go to home
    if (authorize.length && !authorize.includes(currentUser.role)) {
      return next('/');
    }
  }

  next();
});

export default router;