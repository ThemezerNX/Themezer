<template>
    <v-layout align-center column justify-center pa-3>
        <v-card class="box" max-width="600" style="border-radius: 20px;">
            <v-card-title class="headline">
                Contact
            </v-card-title>
            <v-card-text>
                <p>
                    For contact, please join the
                    <a
                        href="https://discord.gg/nnm8wyM"
                        rel="noopener"
                        target="_blank"
                        title="discord"
                    >Discord server</a
                    >.
                </p>
                <p>
                    Found a bug or have a suggestion?
                    <a
                        href="https://github.com/ThemezerNX/Themezer/issues"
                        rel="noopener"
                        target="_blank"
                        title="contribute"
                    >Create an issue on GitHub</a
                    >
                    or join the Discord server.
                </p>
                <hr class="mb-2"/>
            </v-card-text>
        </v-card>
    </v-layout>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
    head() {
        const metaTitle = 'Contact'

        const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true })
        return {
            htmlAttrs: {
                ...i18nHead.htmlAttrs
            },
            link: [
                ...i18nHead.link
            ],
            title: metaTitle,
            meta: [
                ...i18nHead.meta,
                {
                    hid: 'og:title',
                    name: 'og:title',
                    property: 'og:title',
                    content: metaTitle
                }
            ]
        }
    }
})
</script>
