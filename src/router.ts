import { createRouter, createWebHistory} from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: "root",
            path: "/",
            component: () => import("./pages/index.vue")
        },
        {
            name: "login",
            path: "/login",
            component: () => import("./pages/login.vue")
        }
    ]
})

export default router