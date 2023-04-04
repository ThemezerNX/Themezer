import {Plugin} from "@nuxt/types";
import {NuxtI18nHeadOptions, NuxtI18nMeta} from "@nuxtjs/i18n/types/vue";
import {
    LinkPropertyBase,
    LinkPropertyHref,
    LinkPropertyHrefCallback,
    MetaInfo,
    MetaPropertyCharset,
    MetaPropertyEquiv,
    MetaPropertyMicrodata,
    MetaPropertyName,
    MetaPropertyProperty,
} from "vue-meta/types/vue-meta";

type createHeadParams = {
    title?: string;
    description?: string;
    image?: string;
    link?: (LinkPropertyBase | LinkPropertyHref | LinkPropertyHrefCallback)[];
    meta?: (MetaPropertyCharset | MetaPropertyEquiv | MetaPropertyName | MetaPropertyMicrodata | MetaPropertyProperty)[];
}

const plugin: Plugin = (_context, inject) => {
    const $createHead = (
        $nuxtI18nHead: (options?: NuxtI18nHeadOptions) => NuxtI18nMeta,
        {title, description, image, link, meta}: createHeadParams,
    ): MetaInfo => {
        const i18nHead = $nuxtI18nHead({addSeoAttributes: true});

        const mergedLink = [
            ...(link || []),
            ...(i18nHead.link || []),
        ];

        const mergedMeta = [
            ...(meta || []),
            ...(i18nHead.meta || []),
        ];

        const head: MetaInfo = {
            htmlAttrs: {
                ...i18nHead.htmlAttrs,
            },
            link: mergedLink,
            meta: mergedMeta,
        };

        if (title) {
            head.title = title;
            mergedMeta.push({
                hid: "og:title",
                name: "og:title",
                property: "og:title",
                content: title,
            });
        }
        if (description) {
            mergedMeta.push({
                hid: "description",
                name: "description",
                property: "description",
                content: description,
            });
            mergedMeta.push({
                hid: "og:description",
                name: "og:description",
                property: "og:description",
                content: description,
            });
        }
        if (image) {
            mergedMeta.push({
                hid: "og:image",
                name: "og:image",
                property: "og:image",
                content: image,
            });
        }

        return head;
    };

    inject("createHead", $createHead);
};

export default plugin;

type createHeadFunction = (
    $nuxtI18nHead: (options?: NuxtI18nHeadOptions) => NuxtI18nMeta,
    {title, description, image, link, meta}: createHeadParams,
) => MetaInfo

declare module "vue/types/vue" {
    interface Vue {
        $createHead: createHeadFunction;
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        $createHead: createHeadFunction;
    }

    interface Context {
        $createHead: createHeadFunction;
    }
}
