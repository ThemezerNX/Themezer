<template>
    <PageSheet>
        <template #title>
            {{ $tc("themeCreator", 1) }}
        </template>
        <template #description>
            {{ $t("themeCreators.pageDescription") }}
            <i18n path="themeCreators.pageHint">
                <template #switchThemeInjector>
                    <a
                        href="https://github.com/exelix11/SwitchThemeInjector/releases/latest"
                        rel="noopener"
                        target="_blank"
                        title="switch theme injector"
                    >Switch Theme Injector</a>
                </template>
            </i18n>
        </template>
        <template #content>
            <iframe src="https://exelix11.github.io/SwitchThemeInjector/v2/"/>
        </template>
    </PageSheet>
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
    height: 70vh;
    margin-bottom: -8px;
}
</style>
