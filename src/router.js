import Vue from "vue";
import store from "./store";
import VueRouter from "vue-router";
import Home from "./views/HomePage.vue";
import PersonnelDash from "./views/PersonnelDash.vue";
import MakeAppointment from "./views/MakeAppointment.vue";
import ContactForm from "./components/ContactForm.vue";
import LogIn from "./views/LogIn.vue";
import LogOut from "./views/LogOut.vue";
import MyAppointments from "./views/MyAppointments.vue";
import Info_AppointmentSystem_Deactivated from "./views/Info_AppointmentSystem_Deactivated.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/make-an-appointment",
    component: MakeAppointment,
    meta: {
      requiresAppointmentSystemEnabled: true,
    },
  },
  {
    path: "/my-appointments",
    component: MyAppointments,
  },
  {
    path: "/personnel-dash",
    component: PersonnelDash,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/contact",
    component: ContactForm,
  },
  {
    path: "/login",
    component: LogIn,
  },
  {
    path: "/logout",
    component: LogOut,
    metha: {
      requiresAuth: true,
    },
  },
  {
    path: "/info-appointment-system-deactivated",
    component: Info_AppointmentSystem_Deactivated,
  },
  {
    path: "*",
    component: Home,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  store.dispatch("refreshSiteDesignConfigData");
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.isUserLoggedIn) {
      next({
        path: "/login",
      });
    } else {
      next();
    }
  }
  if (
    to.matched.some((record) => record.meta.requiresAppointmentSystemEnabled)
  ) {
    if (!store.state.sdc.wants_appointmentScheduling) {
      next({
        path: "/info-appointment-system-deactivated",
      });
    } else {
      if (next.path == "/info-appointment-system-deactivated") {
        next({
          path: "/make-an-appointment",
        });
      } else {
        next();
      }
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
