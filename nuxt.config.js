require("dotenv").config();
const ImageminPlugin = require("imagemin-webpack-plugin").default;
import path from "path";
import fs from "fs";

const locales = fs.readdirSync(path.resolve(__dirname, "langs")).map((file) => {
    // isos: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
    const code = path.basename(file, ".json");
    return {
        code,
        iso: code,
        file,
        name: JSON.parse(fs.readFileSync(path.resolve(__dirname, "langs", file))).lang,
    };
});

export default {
    env: {
        APP_TITLE: "Themezer",
        ENDPOINT: process.env.ENDPOINT,
        API_ENDPOINT: process.env.API_ENDPOINT,
    },

    server: {
        port: process.env.PORT,
        host: process.env.HOST,
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
        "@/plugins/linkify",
        "@/plugins/snackbar",
        "@/plugins/hashString",
        {
            src: "@/plugins/pagination",
            mode: "client",
        },
        {
            src: "@/plugins/downloadFile",
            mode: "client",
        },
        {
            src: "@/plugins/cookieBanner",
            mode: "client",
        },
    ],

    buildModules: ["@nuxt/typescript-build", "@nuxtjs/vuetify", "@nuxtjs/gtm"],

    modules: [
        "@nuxtjs/axios",
        "@nuxtjs/apollo",
        "@nuxtjs/pwa",
        "@nuxtjs/dotenv",
        "@nuxtjs/redirect-module",
        ["cookie-universal-nuxt", {parseJSON: false}],
        "@nuxtjs/auth-next",
        "nuxt-i18n",
    ],

    i18n: {
        locales,
        lazy: true,
        langDir: "langs/",
        seo: false, // instead declare head hooks in layouts
        defaultLocale: "en",
        defaultDirection: "auto",
        strategy: "no_prefix",
        vueI18n: {
            fallbackLocale: "en",
            dateTimeFormats: {
                en: {
                    short: {
                        year: 'numeric', month: 'short', day: 'numeric'
                    },
                    long: {
                        year: 'numeric', month: 'short', day: 'numeric',
                        weekday: 'short', hour: 'numeric', minute: 'numeric',
                        hour12: false
                    }
                },
            },
        },
    },

    redirect: [
        {
            from: "(?!^/$|^/[?].*$)(.*/[?](.*)$|.*/$)",
            to: (_from, req) => {
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
            default: "~/plugins/apolloClient",
        },
        errorHandler: "~/plugins/apolloErrorHandler",
    },

    pwa: {
        manifest: {
            name: "Themezer",
            short_name: "Themezer",
            description: process.env.npm_package_description || "",
            lang: "en",
            theme_color: "#0ab379",
            background_color: "#121212",
        },
        icon: {
            source: "~/static/icon-pwa.png",
        },
    },

    vuetify: {
        optionsPath: "./vuetify.options.ts",
    },

    auth: {
        cookie: {
            prefix: "auth.",
            options: {
                maxAge: 604800,
            },
        },
        redirect: {
            callback: "/logged-in",
        },
        rewriteRedirects: false,
        watchLoggedIn: false,
        strategies: {
            social: {
                scheme: "@/schemes/customScheme",
                clientId: "722724539028734003",
                useForms: true,
                endpoints: {
                    authorization: "https://discord.com/api/oauth2/authorize",
                    token: "https://discord.com/api/oauth2/token",
                    userInfo: "https://discord.com/api/users/@me",
                },
                scope: ["identify"],
                token: {
                    type: "Bearer",
                    name: "Authorization",
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                },
                refreshToken: {
                    property: "refresh_token",
                    maxAge: 60 * 60 * 24 * 30,
                },
            },
        },
    },

    components: false,

    router: {
        trailingSlash: false,
    },

    build: {
        transpile: ["@nuxtjs/auth-next", "vuetify/lib"],
        extractCSS: process.env.NODE_ENV === "production",
        parallel: process.env.NODE_ENV !== "production",
        optimization: {
            splitChunks: {
                chunks: "all",
            },
        },
        plugins: [
            new ImageminPlugin({
                disable: process.env.NODE_ENV !== "production",
                pngquant: {
                    quality: "80-100",
                },
            }),
        ],
        extend(config, {isDev, isClient, loaders: {vue}}) {
            if (isDev) {
                config.mode = "development";
            } else if (isClient) {
                vue.transformAssetUrls["v-img"] = "src";
                config.optimization.splitChunks.maxSize = 200000;
                config.optimization.splitChunks.cacheGroups = {
                    styles: {
                        name: "styles",
                        test: /\.(css|vue)$/,
                        chunks: "all",
                        enforce: true,
                    },
                };
            }
        },
    },
};
