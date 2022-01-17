import "@mdi/font/css/materialdesignicons.css";
import {Options} from "@nuxtjs/vuetify/dist/options";

const config: Options = {
    // treeShake: true,
    icons: {
        iconfont: "mdi",
    },
    defaultAssets: {
        icons: false,
    },
    theme: {
        dark: true,
        light: false,
        themes: {
            light: {
                primary: "#0AB379",
                secondary: "#B40A86",
            },
            dark: {
                primary: "#0AB379",
                secondary: "#B40A86",
            },
        },
    },
};

export default config;
