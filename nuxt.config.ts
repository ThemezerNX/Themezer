import {config} from "dotenv";
import {NuxtConfig} from "@nuxt/types";
import path from "path";
import fs from "fs";

config();

const langsPath = path.resolve(__dirname, "langs");

const locales = fs.readdirSync(langsPath).map((file) => {
    // isos: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
    const code = path.basename(file, ".json");
    return {
        code,
        iso: code,
        file,
        name: JSON.parse(fs.readFileSync(path.join(langsPath, file)).toString()).lang,
    };
});

const nuxtConfig: NuxtConfig = {
    env: {
        APP_TITLE: "Themezer",
        ENDPOINT: process.env.ENDPOINT || "http://localhost:4000",
        API_ENDPOINT: process.env.API_ENDPOINT || "http://localhost:4100",
    },

    server: {
        port: process.env.PORT || 4100,
        host: process.env.HOST || "localhost",
    },

    head: {
        titleTemplate: "%s | Themezer",
        title: "Themezer",
        meta: [
            {charset: "utf-8"},
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                name: "theme-color",
                content: "#0ab379",
            },
            {
                name: "msapplication-TileColor",
                content: "#0ab379",
            },
            {
                hid: "description",
                name: "description",
                content: process.env.npm_package_description || "",
            },
            {
                hid: "og:image",
                name: "og:image",
                property: "og:image",
                content: "/icon-128.png",
            },
        ],
        link: [
            {
                rel: "icon",
                type: "image/x-icon",
                href: "/icon-64.png",
            },
        ],
    },

    messages: {
        loading: "Loading...",
        error_404: "This page could not be found. Go back",
        server_error: "Item not found, URL malformed or server not responding",
        server_error_details:
            "An error occurred. Try going back using your browser's back button or go",
        client_error_details:
            "An error occurred while trying to render the page.",
    },

    loading: {color: "#b40a86"},

    plugins: [
        "~/plugins/linkify",
        "~/plugins/snackbar",
        "~/plugins/objectHash",
        "~/plugins/axiosErrorHandler",
        {
            src: "~/plugins/downloader",
            mode: "client",
        },
        {
            src: "~/plugins/cookieBanner",
            mode: "client",
        },
        "~/plugins/auth",
    ],

    buildModules: [
        "@nuxt/typescript-build",
        "@nuxtjs/vuetify",
        "@nuxtjs/gtm",
        "@nuxtjs/imagemin",
    ],

    modules: [
        "@nuxtjs/axios",
        "@nuxtjs/apollo",
        "@nuxtjs/pwa",
        "@nuxtjs/dotenv",
        "@nuxtjs/redirect-module",
        ["cookie-universal-nuxt", {parseJSON: false}],
        "@nuxtjs/i18n",
    ],

    i18n: {
        locales,
        lazy: true,
        langDir: langsPath,
        defaultLocale: "en",
        defaultDirection: "auto",
        strategy: "no_prefix",
        vueI18n: {
            fallbackLocale: "en",
            dateTimeFormats: {
                en: {
                    short: {
                        year: "numeric", month: "short", day: "numeric",
                    },
                    long: {
                        year: "numeric", month: "short", day: "numeric",
                        weekday: "short", hour: "numeric", minute: "numeric",
                        hour12: false,
                    },
                },
            },
        },
    },

    redirect: [
        {
            from: "(?!^/$|^/[?].*$)(.*/[?](.*)$|.*/$)",
            to: (_from: any, req: { _parsedUrl: { pathname: string, search?: string } }) => {
                const base = req._parsedUrl.pathname.replace(/\/$/, "");
                const search = req._parsedUrl.search;
                return base + (search != null ? search : "");
            },
            statusCode: 301,
        },
    ],

    gtm: {
        id: process.env.GTM_TAG,
    },

    apollo: {
        clientConfigs: {
            default: "~/apolloClient.config",
        },
    },

    pwa: {
        manifest: {
            name: "Themezer",
            short_name: "Themezer",
            description: process.env.npm_package_description || "",
            lang: "en-US",
            theme_color: "#0ab379",
            background_color: "#121212",
        },
        icon: {
            source: "~/static/icon-pwa.png",
        },
    },

    vuetify: {
        optionsPath: "./vuetify.options",
    },

    router: {
        trailingSlash: false,
    },

    build: {
        transpile: ["vuetify/lib"],
        extractCSS: process.env.NODE_ENV === "production",
        parallel: process.env.NODE_ENV !== "production",
        optimization: {
            splitChunks: {
                chunks: "all",
            },
        },
    },

};

export default nuxtConfig;
