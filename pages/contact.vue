<template>
    <PageSheet max-width="600">
        <template #title>
            {{ $t("contact") }}
        </template>
        <template #content>
            <p>
                <i18n path="contacts.discord">
                    <template #themezerNxDiscord>
                        <OpenLink
                            to="https://discord.gg/nnm8wyM"
                            new-tab
                            title="discord"
                        >
                            ThemezerNX Discord
                        </OpenLink>
                    </template>
                </i18n>
            </p>
            <i18n path="contacts.issue">
                <template #themezerNxGithub>
                    <OpenLink
                        to="https://github.com/ThemezerNX/Themezer/issues"
                        new-tab
                        title="contribute"
                    >
                        ThemezerNX GitHub
                    </OpenLink>
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
    components: {CopyrightBar},
    head() {
        const metaTitle = this.$t("contact");

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
