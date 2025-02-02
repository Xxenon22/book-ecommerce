import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../components/HomePage.vue';
import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';
import HomeAdmin from '../pages/admin/HomeAdmin.vue';
import MBooks from '../pages/admin/MBooks.vue';
import MCategory from '../pages/admin/MCategory.vue';
import MOrder from '../pages/admin/MOrder.vue';

const routes = [
    { path: '/', component: HomePage, meta: { layout: false, requireAuth: true, role: "user" } },
    { path: '/register', component: Register, meta: { layout: false } },
    { path: '/login', component: Login, meta: { layout: false } },
    { path: '/admin', component: HomeAdmin, meta: { layout: true, requireAuth: true, role: "admin" } },
    { path: '/mbooks', component: MBooks, meta: { layout: true, requireAuth: true, role: "admin" } },
    { path: '/mcategory', component: MCategory, meta: { layout: true, requireAuth: true, role: "admin" } },
    { path: '/morder', component: MOrder, meta: { layout: true, requireAuth: true, role: "admin" } },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})