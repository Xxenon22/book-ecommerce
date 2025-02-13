import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { router } from './views/router';
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia';
import Aura from '@primevue/themes/aura';
import '@fontsource/ubuntu';
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';


const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(router);
app.mount('#app');
app.use(ToastService);