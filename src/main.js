import { createApp } from "vue";
import "./assets/css/style.css";
import router from "./router";
import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount("#app");
