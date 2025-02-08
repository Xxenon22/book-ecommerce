import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../components/HomePage.vue';
import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';
import HomeAdmin from '../pages/admin/homeAdmin.vue';
import AddBook from '../pages/admin/CRUD/AddBook.vue';

const routes = [
    { path: '/', component: HomePage, meta: { layout: false, } },
    { path: '/register', component: Register, meta: { layout: false } },
    { path: '/login', component: Login, meta: { layout: false } },
    { path: '/dashboard', component: HomeAdmin, meta: { layout: true } },
    { path: '/tambah-buku', component: AddBook, meta: { layout: true } },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})