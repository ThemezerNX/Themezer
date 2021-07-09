<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <v-sheet class="pa-2 box" no-gutters>
            <h1 class="box_text">
                Layout Submissions
            </h1>
            <div class="subtitle-1 box_text">
                You can submit layouts to the Themezer Layouts GitHub
                repository. See the
                <a
                    href="https://github.com/ThemezerNX/Layouts#readme"
                    rel="noopener"
                    target="_blank"
                >
                    README.md</a
                >
                for instructions. If it's too technical for you, don't hesitate to
                <a href="https://discord.gg/nnm8wyM" rel="noopener">
                    join our Discord</a
                > and ask for help in #submitting. One of the moderators will happily do it for you!
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
                    Go to GitHub
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
        const metaTitle = 'Layout | Submit'
        const metaDesc =
            'You can submit layouts to the Themezer Layouts GitHub repository.'
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
