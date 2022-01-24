<template>
    <PageSheet>
        <template #title>
            {{ $t("layoutSubmissions") }}
        </template>
        <template #description>
            {{ $t("submitLayout.pageDescription") }}
            <i18n path="submitLayout.instructions">
                <template #readme>
                    <OpenLink to="https://github.com/ThemezerNX/Layouts#readme" new-tab>
                        README.md
                    </OpenLink>
                </template>
                <template #joinDiscord>
                    <OpenLink to="https://discord.gg/nnm8wyM" new-tab>
                        {{ $t("submitLayout.joinDiscord") }}
                    </OpenLink>
                </template>
                <template #channel>#submitting</template>
            </i18n>
        </template>
        <template #footer-centered>
            <v-btn
                class="mx-2"
                color="primary"
                href="https://github.com/ThemezerNX/Layouts"
                target="_blank"
            >
                ThemezerNX GitHub
                <v-icon right>mdi-github</v-icon>
            </v-btn>
        </template>
    </PageSheet>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
    head() {
        const metaTitle = `${this.$tc("layout")} | ${this.$t("upload")}`;
        const metaDesc = this.$t("submitLayout.pageDescription");
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
