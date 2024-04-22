import Vue from "vue";
import Router from "vue-router";
import state from "@/store/state";
import { HEADER_TYPE } from "@/views/components/fnc";

// import goTo from 'vuetify/lib/services/goto'
const { isNavigationFailure, NavigationFailureType } = Router;

// import { isUserLoggedIn } from "."
Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL,
  mode: "history",
  // scrollBehavior: (to, from, savedPosition) => {
  //   let scrollTo = 0
  //   if (to.hash) {
  //     scrollTo = to.hash
  //   } else if (savedPosition) {
  //     scrollTo = savedPosition.y
  //   }
  //   return goTo(scrollTo)
  // },
  // scrollBehavior() {
  //   return { x: 0, y: 0 }
  // },
  routes: [
    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: "/",
      component: () => import("@/layouts/full-page/FullPageWithOutFrame.vue"),
      children: [
        {
          path: "/",
          name: "intro",
          component: () => import("@/views/pages/PgIntro.vue"),
          meta: {
            rule: "editor",
            requiresAuth: false,
          },
        },
      ],
    },
    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: "/",
      component: () => import("@/layouts/full-page/FullPageWithFrame.vue"),
      children: [
        {
          path: "/",
          name: "main",
          component: () => import("@/views/pages/PgMain.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN", "USER", "MANAGER"],
            requiresAuth: true,
            key: HEADER_TYPE.MENU_HOME,
          },
        },
        {
          path: "/",
          name: "users",
          component: () => import("@/views/pages/PgUsers.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN"],
            requiresAuth: true,
            key: HEADER_TYPE.MENU_USER,
          },
        },
        {
          path: "/",
          name: "robots",
          component: () => import("@/views/pages/PgRobot.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN", "MANAGER"],
            requiresAuth: true,
            key: HEADER_TYPE.MENU_ROBOT,
          },
        },
        {
          path: "/",
          name: "facilities",
          component: () => import("@/views/pages/PgFacility.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN", "MANAGER"],
            requiresAuth: true,
            key: HEADER_TYPE.MENU_FACILITY,
          },
        },
        {
          path: "/",
          name: "stations",
          component: () => import("@/views/pages/PgStation.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN", "MANAGER"],
            requiresAuth: true,
            key: HEADER_TYPE.MENU_STATION,
          },
        },
        {
          path: "/",
          name: "plans",
          component: () => import("@/views/pages/PgPlan.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN", "MANAGER"],
            requiresAuth: true,
            key: HEADER_TYPE.MENU_PLAN,
          },
        },
        {
          path: "/",
          name: "sitemap",
          component: () => import("@/views/pages/PgSiteMap.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN", "MANAGER"],
            requiresAuth: true,
            key: HEADER_TYPE.MENU_SITEMAP,
          },
        },
        {
          path: "/",
          name: "designmap",
          component: () => import("@/views/pages/PgDesignMap.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN", "MANAGER"],
            requiresAuth: true,
            key: HEADER_TYPE.MENU_DESIGN,
          },
        },
        {
          path: "/",
          name: "flowdiagram",
          component: () => import("@/views/pages/PgFlowDiagram.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN", "MANAGER"],
            requiresAuth: true,
            key: HEADER_TYPE.MENU_FLOW,
          },
        },
        {
          path: "/",
          name: "regions",
          component: () => import("@/views/pages/PgRegion.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN","MANAGER"],
            requiresAuth: true,
            key: HEADER_TYPE.MENU_REGIONS,
          },
        },
        {
          path: "/",
          name: "orders",
          component: () => import("@/views/pages/PgOrder.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN", "USER", "MANAGER"],
            requiresAuth: true,
            key: HEADER_TYPE.MENU_ORDERS,
          },
        },
        {
          path: "/",
          name: "locations",
          component: () => import("@/views/pages/PgLocation.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN", "MANAGER"],
            requiresAuth: true,
            key: HEADER_TYPE.MENU_LOCATION,
          },
        },
        {
          path: "/",
          name: "dashboard",
          component: () => import("@/views/pages/PgDashboard.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN", "USER", "MANAGER"],
            requiresAuth: true,
            key: HEADER_TYPE.MENU_DASHBOARD,
          },
        },
        {
          path: "/not-authorized",
          name: "not-authorized",
          component: () => import("@/views/pages/PgNotAuthorized.vue"),
          meta: {
            rule: "editor",
            role: ["ADMIN", "USER", "MANAGER"],
            requiresAuth: true,
            key: "",
            src: "",
          },
        },
      ],
    },
    {
      path: "*",
      redirect: "/error-404",
    },
    // Redirect to 404 page, if no match found
  ],
});

// router.afterEach(() => {
//   // Remove initial loading
//   const appLoading = document.getElementById('loading-bg')
//   if (appLoading) {
//     appLoading.style.display = 'none'
//   }
// })

router.beforeEach((to, from, next) => {
  const _user = state.AppActiveUser;
  if (to.meta.requiresAuth) {
    if (!_user.token) {
      if (to.path !== "/") {
        router.push({ path: "/" }).catch((failure) => {
          if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
            //ignore;
            console.log("ERROR-ROUTER:Unexpected Router Error", failure);
          }
        });
      } else {
        return next();
      }
    } else {
      if(to.meta.role.length > 0) {
        if (_user.roles.some((item) => to.meta.role.includes(item) > 0)) {
          return next();
        } else {
          router.push({path: "/not-authorized"}).catch((failure) => {
            if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
              //ignore;
              console.log("ERROR-ROUTER:Unexpected Router Error", failure);
            }
          });
        }
      }
    }
  } else {
    if (_user.token) {
      if (to.name !== "main") {
        router.push({ name: "main" }).catch((failure) => {
          if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
            //ignore;
            console.log("ERROR-ROUTER:Unexpected Router Error", failure);
          }
        });
      } else {
        return next();
      }
    } else {
      return next();
    }
  }
});

export default router;
