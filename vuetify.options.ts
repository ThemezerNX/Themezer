import colors from "vuetify/es5/util/colors";
import "@mdi/font/css/materialdesignicons.css";

export default {
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
                accent: colors.grey.darken3,
                secondary: "#B40A86",
                info: colors.teal.lighten1,
                warning: colors.amber.base,
                error: colors.deepOrange.accent4,
                success: colors.green.accent3,
            },
        },
    },
};
