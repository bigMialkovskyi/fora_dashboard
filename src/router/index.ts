import { createRouter, createWebHistory } from "vue-router";
// import HomeView from '../views/HomeView.vue'
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import PostPercent from "@/views/PostPercentView.vue";
import DefaultPage from "@/views/DefaultPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MainLayout,
      children: [
        // { path: "test", name: "test", component: HomeView },
        // { path: "about", name: "about", component: AboutView },

        { path: "dashboard", name: "dashboard", component: DefaultPage },

        { path: "graphs", name: "graphs", component: DefaultPage },
        { path: "sl", name: "sl", component: DefaultPage },

        { path: "panel-lists", name: "panel-lists", component: DefaultPage },
        { path: "sales", name: "sales", component: DefaultPage },
        { path: "post-percent", name: "post-percent", component: PostPercent },

        { path: "fines", name: "fines", component: DefaultPage },
        { path: "agreements", name: "agreements", component: DefaultPage },
        { path: "requirements", name: "requirements", component: DefaultPage },

        { path: "dirty-assortment", name: "dirty-assortment", component: DefaultPage },
        { path: "pilot", name: "pilot", component: DefaultPage },
        { path: "report", name: "report", component: DefaultPage },
      ],
    },
    // {
    //   path: "/test",
    //   name: "test",
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import("../views/HomeView.vue"),
    // },
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import("../views/AboutView.vue"),
    // },
  ],
});

export default router;

// import { createRouter, createWebHistory } from 'vue-router'
// import MainLayout from '@/layouts/MainLayout.vue'

// const routes = [
//   {
//     path: '/',
//     component: MainLayout,
//     children: [
//       { path: '', component: Home },
//       { path: 'about', component: About }
//     ]
//   }
// ]

// export const router = createRouter({
//   history: createWebHistory(),
//   routes
// })
