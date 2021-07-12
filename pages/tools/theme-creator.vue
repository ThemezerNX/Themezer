<template>
    <v-container
        ref="sheet"
        :fluid="$vuetify.breakpoint.smAndDown"
        style="height: 100%;"
    >
        <v-sheet class="pa-2 box" no-gutters>
            <h1 class="box_text">
                {{ $tc("themeCreator", 1) }}
            </h1>
            <div class="subtitle-1 box_text">
                {{ $t("themeCreators.pageDescription") }}
                <i18n path="themeCreators.pageHint">
                    <template v-slot:switchThemeInjector>
                        <a
                            href="https://github.com/exelix11/SwitchThemeInjector/releases/latest"
                            rel="noopener"
                            target="_blank"
                            title="switch theme injector"
                        >Switch Theme Injector</a>
                    </template>
                </i18n>
            </div>
            <iframe src="https://exelix11.github.io/SwitchThemeInjector/v2/"/>
        </v-sheet>
    </v-container>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
    head() {
        const metaTitle = `${this.$tc("themeCreator")} | ${this.$tc("tool", 2)}`;
        const metaDesc = this.$t("themeCreators.pageDescription");
        const metaImg = null;

        const i18nHead = this.$nuxtI18nHead({addSeoAttributes: true});
        return {
            htmlAttrs: {
                ...i18nHead.htmlAttrs,
            },
            link: [
                ...i18nHead.link,
            ],
            title: metaTitle,
            meta: [
                ...i18nHead.meta,
                {
                    hid: "description",
                    name: "description",
                    content: metaDesc,
                },
                {
                    hid: "og:title",
                    name: "og:title",
                    property: "og:title",
                    content: metaTitle,
                },
                {
                    hid: "og:description",
                    name: "og:description",
                    property: "og:description",
                    content: metaDesc,
                },
                {
                    hid: "og:image",
                    name: "og:image",
                    property: "og:image",
                    content: metaImg,
                },
            ],
        };
    },
});
</script>

<style>
iframe {
    border-bottom-left-radius: 20px !important;
    border-bottom-right-radius: 20px !important;
    height: 70vh;
}
</style>