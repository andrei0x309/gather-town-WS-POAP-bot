import { createApp } from 'vue'
import App from '@/app.vue'
import { routes, router } from "@/router";
import 'virtual:windi.css'
import { createHead } from "@vueuse/head";
import {
    Dropdown,
    Button,
    Sidebar,
    Tabs,
    Table,
    Modal,
    Skeleton
} from "@oruga-ui/oruga-next";
import "@oruga-ui/oruga-next/dist/oruga.min.css";
import { createPinia } from 'pinia'

const ENDPOINTBASE = "http://localhost:4552";

createApp(App)
    .use(router)
    .use(Dropdown)
    .use(Button)
    .use(Sidebar)
    .use(Tabs)
    .use(Modal)
    .use(Skeleton)
    .use(Table)
    .use(createPinia())
    .provide("endPointBase", ENDPOINTBASE)
    .provide('routes', routes)
    .use(createHead())
    .mount('#app')
