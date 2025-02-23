import { createWebHistory, createRouter } from 'vue-router'
import { supabase } from '../supabase/index';
import HomePage from '../components/HomePage.vue';
import Register from '../pages/Register.vue';
import Login from '../pages/Login.vue';
import AddBook from '../pages/admin/CRUD/AddBook.vue';
import Cart from '../pages/Like.vue';
import BookDetail from '../pages/BookDetail.vue';
import Checkout from '../pages/Checkout.vue';
import Berhasil from '../pages/berhasil.vue';
import Cancel from '../pages/cancel.vue';


const routes = [
    { path: '/', name: 'Home', component: HomePage, meta: { requiresAuth: true, } },
    { path: '/suka', name: 'Suka', component: Cart, meta: { requiresAuth: true, } },
    { path: '/register', name: 'register', component: Register, meta: { requiresAuth: false, } },
    { path: '/login', name: 'login', component: Login, meta: { requiresAuth: false, } },
    { path: '/tambah-buku', name: 'TambahBuku', component: AddBook, meta: { requiresAuth: true, requiresAdmin: true } },
    { path: '/detail/:id', name: 'DetailBuku', component: BookDetail, props: true, meta: { requiresAuth: true, } },
    { path: '/checkout/:id', name: 'Checkout', component: Checkout, props: true, meta: { requiresAuth: true, } },
    { path: '/berhasil', name: 'berhasil', component: Berhasil, props: true, meta: { requiresAuth: true, } },
    { path: '/cancel', name: 'cancel', component: Cancel, props: true, meta: { requiresAuth: true, } },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

// router.beforeEach(async (to, from, next) => {
//     const {
//         data: { session },
//     } = await supabase.auth.getSession();

//     const userRole = sessionStorage.getItem("userRole");

//     if (to.name === "login" && session) {
//         return next({ name: "Home" });
//     }
//     if (to.meta.requiresAuth && !session) {
//         return next({ name: "login" });
//     }

//     // Proteksi halaman admin
//     if (to.meta.requiresAdmin && userRole !== "admin") {
//         return next({ name: "Home" });
//     }

//     next();
// });
