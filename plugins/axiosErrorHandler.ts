import {NuxtError, Plugin} from "@nuxt/types";

const plugin: Plugin = (context) => {
    context.$axios.onError((error) => {
        const {route, redirect} = context;

        // if no need to show error page
        if (error.response?.status === 401) {
            redirect({name: "login", query: {from: route.fullPath}});

            return Promise.resolve(false);
        }

        const nuxtError: NuxtError = {
            message: error.message,
            statusCode: error.response?.status,
            path: error.stack,
        };

        context.error(nuxtError);
        return Promise.resolve(false);
    });
};

export default plugin;
