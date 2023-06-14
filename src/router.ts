import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "home",
      path: "/",
      component: () => import("./pages/index.vue"),
    },
    {
      name: "login",
      path: "/login",
      component: () => import("./pages/login.vue"),
    },
    {
      name: "admin-users",
      path: "/admin/users",
      component: () => import("./pages/admin/users/index.vue"),
    },
    {
      name: "admin-students",
      path: "/admin/students",
      component: () => import("./pages/admin/students/index.vue"),
    },
    {
      name: "record-entries",
      path: "/record/entries",
      component: () => import("./pages/record/entries/index.vue"),
    },
    {
      name: "record-entries-new",
      path: "/record/entries/new",
      component: () => import("./pages/record/entries/new.vue"),
    },
    {
      name: "record-entries-entry",
      path: "/record/entries/:id",
      component: () => import("./pages/record/entries/[id].vue"),
    },
    {
      name: "record-students",
      path: "/record/students",
      component: () => import("./pages/record/students/index.vue"),
    },
    {
      name: "record-students-student",
      path: "/record/students/:id",
      component: () => import("./pages/record/students/[id].vue"),
    },
    {
      name: "record-reports",
      path: "/record/reports",
      component: () => import("./pages/record/reports/index.vue"),
    },
    {
      name: "record-projects",
      path: "/record/projects",
      component: () => import("./pages/record/projects/index.vue"),
      children: [
        {
          name: "record-projects-new",
          path: "new",
          component: () => import("./pages/record/projects/new.vue"),
        },
        {
          name: "record-projects-project",
          path: ":id",
          component: () => import("./pages/record/projects/[id].vue"),
        },
      ],
    },
    {
      name: "record-projects-export",
      path: "/record/projects/export",
      component: () => import("./pages/record/projects/export.vue"),
    },
    {
      name: "drive-my-drive",
      path: "/drive/my-drive",
      component: () => import("./pages/drive/my-drive.vue"),
    },
    {
      name: "drive-my-drive-folders-folder",
      path: "/drive/my-drive/folders/:id",
      component: () => import("./pages/drive/folders/[id].vue"),
    },
    {
      name: "record-tags",
      path: "/record/tags",
      component: () => import("./pages/record/tags/index.vue"),
    },
  ],
});

export default router;
