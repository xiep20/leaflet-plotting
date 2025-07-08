import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "",
    component: () => import("@/views/HomeView.vue"),
    children: [
      {
        path: "mapMou",
        name: "地图",
        component: () => import("@/views/mapModule/index.vue"),
      },
      {
        path: "plotting",
        name: "标绘",
        component: () => import("@/views/plotting/index.vue"),
      }
    ],
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
