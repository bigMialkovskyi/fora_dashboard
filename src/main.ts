import "./assets/main.css";

import PrimeVue from "primevue/config";
import "primevue/resources/themes/lara-light-blue/theme.css"; // Нова тема
import "primevue/resources/primevue.min.css"; // Стилі компонентів
import "primeicons/primeicons.css"; // Іконки
import "primeflex/primeflex.css"; // Utility-класи (якщо використовуєте)

import { createApp } from "vue";
import { createPinia } from "pinia";
import naive from "naive-ui";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(naive);
app.use(PrimeVue);

app.mount("#app");
