<template>
    <v-layout align-center column justify-center pa-3>
        <v-card class="box" max-width="600" style="border-radius: 20px;">
            <v-card-title class="headline">
                {{ $t("contact") }}
            </v-card-title>
            <v-card-text>
                <p>
                    <i18n path="contacts.discord">
                        <template v-slot:themezerNxDiscord>
                            <a
                                href="https://discord.gg/nnm8wyM"
                                rel="noopener"
                                target="_blank"
                                title="discord"
                            >ThemezerNX Discord</a>
                        </template>
                    </i18n>
                </p>
                <p>
                    <i18n path="contacts.issue">
                        <template v-slot:themezerNxGithub>
                            <a
                                href="https://github.com/ThemezerNX/Themezer/issues"
                                rel="noopener"
                                target="_blank"
                                title="contribute"
                            >ThemezerNX GitHub</a>
                        </template>
                    </i18n>
                </p>
                <hr class="mb-2"/>
            </v-card-text>
        </v-card>
    </v-layout>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
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
