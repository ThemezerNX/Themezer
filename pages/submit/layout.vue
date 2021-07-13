<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <v-sheet class="pa-2 box" no-gutters>
            <h1 class="box_text">
                {{ $t("layoutSubmissions") }}
            </h1>
            <div class="subtitle-1 box_text">
                {{ $t("this.pageDescription") }}
                <i18n path="submitLayout.instructions">
                    <template v-slot:readme>
                        <a
                            href="https://github.com/ThemezerNX/Layouts#readme"
                            rel="noopener"
                            target="_blank"
                        >README.md</a>
                    </template>
                    <template v-slot:joinDiscord>
                        <a href="https://discord.gg/nnm8wyM" rel="noopener"
                        >{{ $t("submitLayout.joinDiscord") }}</a>
                    </template>
                    <template v-slot:channel>#submitting</template>
                </i18n>
            </div>
            <v-flex class="d-flex justify-center my-3">
                <v-btn
                    class="mx-2"
                    color="primary"
                    href="https://github.com/ThemezerNX/Layouts"
                    rel="noopener"
                    rounded
                    router
                    target="_blank"
                >
                    ThemezerNX GitHub
                    <v-icon right>mdi-github</v-icon>
                </v-btn>
            </v-flex>
        </v-sheet>
    </v-container>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
    head() {
        const metaTitle = `${this.$tc("layout")} | ${this.$t("upload")}`
        const metaDesc = this.$t("submitLayout.pageDescription")
        const metaImg = null

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
                    hid: 'description',
                    name: 'description',
                    content: metaDesc
                },
                {
                    hid: 'og:title',
                    name: 'og:title',
                    property: 'og:title',
                    content: metaTitle
                },
                {
                    hid: 'og:description',
                    name: 'og:description',
                    property: 'og:description',
                    content: metaDesc
                },
                {
                    hid: 'og:image',
                    name: 'og:image',
                    property: 'og:image',
                    content: metaImg
                }
            ]
        }
    }
})
</script>
