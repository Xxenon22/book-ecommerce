import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { router } from './views/router';
import PrimeVue from 'primevue/config';
import '@fontsource/ubuntu';
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';


const app = createApp(App);

app.use(PrimeVue, {
    theme: 'none'
});
app.use(router);
app.mount('#app');
app.use(ToastService);