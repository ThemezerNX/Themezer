import hash from "object-hash";
import {Plugin} from "@nuxt/types";

const plugin: Plugin = (context, inject) => {
    const $objectHash = (s: any) => {
        return hash(s);
    };

    inject("objectHash", $objectHash);
};

export default plugin;

declare module "vue/types/vue" {
    interface Vue {
        $objectHash: (s: any) => string;
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        $objectHash: (s: any) => string;
    }

    interface Context {
        $objectHash: (s: any) => string;
    }
}
