import { createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: "home",
            path: "/",
            component: () => import("./pages/index.vue")
        },
        {
            name: "login",
            path: "/login",
            component: () => import("./pages/login.vue")
        },
        {
            name: "admin-users",
            path: "/admin/users",
            component: () => import("./pages/admin/users/index.vue")
        },
        {
            name: "record-entries",
            path: "/record/entries",
            component: () => import("./pages/record/entries/index.vue")
        },
        {
            name: "record-entries-new",
            path: "/record/entries/new",
            component: () => import("./pages/record/entries/new.vue")
        },
        {
            name: "record-entry",
            path: "/record/entries/:id",
            component: () => import("./pages/record/entries/[id].vue")
        },
        {
            name: "record-students",
            path: "/record/students",
            component: () => import("./pages/record/students/index.vue")
        },
        {
            name: "record-student",
            path: "/record/students/:id",
            component: () => import("./pages/record/students/[id].vue")
        },
    ]
})

export default router