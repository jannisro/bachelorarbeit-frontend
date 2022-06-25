import { createWebHistory, createRouter } from "vue-router";
import StartView from "@/views/StartView.vue";
//import HelpView from "@/views/HelpView.vue";
import NationalDataView from "@/views/NationalDataView.vue";
import InternationalDataView from "@/views/InternationalDataView.vue";
import SearchView from "@/views/SearchView.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: StartView,
    },
    /*{
        path: "/help",
        name: "Help",
        component: HelpView
    },*/
    {
        path: "/data/national/:countryCode/:timePeriodName/:date",
        name: "National Data View",
        component: NationalDataView,
    },
    {
        path: "/data/international/:startCountryCode/:endCountryCode/:timePeriodName/:date",
        name: "International Data View",
        component: InternationalDataView,
    },
    {
        path: "/search",
        name: "Search",
        component: SearchView,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;