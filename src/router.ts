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
        }
    ]
})

export default router