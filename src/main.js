import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { router } from './views/router';
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia';
import Aura from '@primevue/themes/aura';
import { definePreset } from "@primevue/themes";

import '@fontsource/ubuntu';
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';
import ConfirmationService from "primevue/confirmationservice";


const app = createApp(App);
const pinia = createPinia();
app.use(pinia);


const MyPreset = definePreset(Aura);

app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            prefix: "p",
            darkModeSelector: ".my-app-dark",
            cssLayer: true,
        },
    },
});

app.use(ConfirmationService);
app.use(router);
app.mount('#app');
app.use(ToastService);