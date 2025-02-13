import { createWebHistory, createRouter } from 'vue-router'
import HomePage from '../components/HomePage.vue';
import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';
import AddBook from '../pages/admin/CRUD/AddBook.vue';
import BestSeller from '../pages/BestSeller.vue';
import Cart from '../pages/Like.vue';

const routes = [
    { path: '/', component: HomePage, meta: { layout: true, } },
    { path: '/buku-terlaris', component: BestSeller, meta: { layout: true, } },
    { path: '/suka', component: Cart, meta: { layout: false } },
    { path: '/register', component: Register, meta: { layout: false } },
    { path: '/login', component: Login, meta: { layout: false } },
    { path: '/tambah-buku', component: AddBook, meta: { layout: false } },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})