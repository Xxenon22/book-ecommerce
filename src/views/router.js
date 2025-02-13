import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../components/HomePage.vue';
import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';
import AddBook from '../pages/admin/CRUD/AddBook.vue';
import NewBook from '../pages/NewBook.vue';

const routes = [
    { path: '/', component: HomePage, meta: { layout: true, } },
    { path: '/buku-baru', component: NewBook, meta: { layout: true, } },
    { path: '/register', component: Register, meta: { layout: false } },
    { path: '/login', component: Login, meta: { layout: false } },
    { path: '/tambah-buku', component: AddBook, meta: { layout: false } },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})