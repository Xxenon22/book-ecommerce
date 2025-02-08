import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../components/HomePage.vue';
import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';

const routes = [
    { path: '/', component: HomePage, meta: { layout: false, } },
    { path: '/register', component: Register, meta: { layout: false } },
    { path: '/login', component: Login, meta: { layout: false } },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})