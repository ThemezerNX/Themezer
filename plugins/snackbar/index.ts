import Vue from "vue";
import Snackbar from "./Snackbar.vue";
import {Plugin} from "@nuxt/types";

const plugin: Plugin = (context, inject) => {
    const storeModule = {
        namespaced: true,
        state: () => ({
            message: null,
            error: null,
        }),
        mutations: {
            SET_MESSAGE(state: any, message: string) {
                state.message = message;
            },
            SET_ERROR(state: any, error: string) {
                state.error = error;
            },
        },
    };

    context.store.registerModule("snackbar", storeModule);

    let timer: any;
    const $snackbar: SnackbarPlugin = {
        message(message: string, timeout = 8100) {
            clearTimeout(timer);
            context.store.commit("snackbar/SET_MESSAGE", message);
            timer = setTimeout(() => {
                context.store.commit("snackbar/SET_MESSAGE", null);
            }, timeout);
        },
        error(error: Error, timeout = 8100) {
            console.error(error);

            let message = error.message.replace("GraphQL error: ", "") || "Unknown Error";
            if (message.includes("Failed to fetch")) {
                message = context.app.i18n.t("error.otherError") as string;
            }

            clearTimeout(timer);
            context.store.commit("snackbar/SET_ERROR", message);
            timer = setTimeout(() => {
                context.store.commit("snackbar/SET_ERROR", null);
            }, timeout);
        },
    };

    inject("snackbar", $snackbar);
    Vue.component("Snackbar", Snackbar);
};

export default plugin;

export type SnackbarPlugin = {
    message(message: string, timeout?: number): void;
    error(error: Error, timeout?: number): void;
};

declare module "vue/types/vue" {
    interface Vue {
        $snackbar: SnackbarPlugin;
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        $snackbar: SnackbarPlugin;
    }

    interface Context {
        $snackbar: SnackbarPlugin;
    }
}
