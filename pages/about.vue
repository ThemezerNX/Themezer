<template>
    <PageSheet max-width="600">
        <template #title>
            {{ $t("about") }}
        </template>
        <template #description>
            {{ $t("themezerIntro") }}
        </template>
        <template #content>
            <i18n path="abouts.sourceCode">
                <template #themezerNxGithub>
                    <OpenLink
                        to="https://github.com/ThemezerNX"
                        new-tab
                        title="discord"
                    >
                        ThemezerNX GitHub
                    </OpenLink>
                </template>
            </i18n>
            <br>
            <br>
            <i18n path="abouts.certifiedBadge">
                <template #image>
                    <CertifiedBadge inline/>
                </template>
            </i18n>
        </template>
        <template #footer>
            <CopyrightBar/>
        </template>
    </PageSheet>
</template>

<script>
import Vue from "vue";
import CopyrightBar from "@/components/sections/CopyrightBar";

export default Vue.extend({
    components: {
        CopyrightBar,
        CertifiedBadge: () => import("@/components/badges/CertifiedBadge.vue"),
    },
    head() {
        const metaTitle = this.$t("about");

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
                    hid: "og:title",
                    name: "og:title",
                    property: "og:title",
                    content: metaTitle,
                },
            ],
        };
    },
});
</script>
