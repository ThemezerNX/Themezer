import {Plugin} from "@nuxt/types";
import {NuxtAxiosInstance} from "@nuxtjs/axios";

class Downloader {
    private readonly $axios: NuxtAxiosInstance;

    constructor(axios: NuxtAxiosInstance) {
        this.$axios = axios;
    }

    private static clickBlob(blob: Blob, fileName: string) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    async url(url: string, fileName: string) {
        try {
            const res = await this.$axios({url, responseType: "arraybuffer"});
            Downloader.clickBlob(new Blob([res.data]), fileName);
        } catch (e) {
            console.error(e);
        }
    }

    json(json: string, fileName: string) {
        Downloader.clickBlob(new Blob([JSON.stringify(json, null, 4)]), fileName);
    }
}

const plugin: Plugin = (context, inject) => {
    inject("downloader", new Downloader(context.$axios));
};

export default plugin;

declare module "vue/types/vue" {
    interface Vue {
        $downloader: Downloader;
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        $downloader: Downloader;
    }

    interface Context {
        $downloader: Downloader;
    }
}


