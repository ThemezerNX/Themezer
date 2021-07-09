<template>
    <v-container
        ref="sheet"
        :fluid="$vuetify.breakpoint.smAndDown"
        style="height: 100%;"
    >
        <v-sheet class="pa-2 box_fill" no-gutters>
            <h1 class="box_text">
                Overlay Creator
            </h1>
            <div class="subtitle-1 box_text">
                Create a transparent overlay for your layout and customizations.
                You may use the tool here, or manually create an overlay if you
                can. Either way, an overlay is required for layouts on this
                website.
            </div>
            <h2 class="box_text">
                1. Upload Layout
            </h2>
            <div class="subtitle-1 box_text">
                Upload your layout here. You will get two NXThemes: one with a
                black background and one with a white one (be sure to allow the
                site to download multiple files). For each do the following:
                install it on your Switch and take a screenshot. Set the system
                theme to white(!) and have the cursor in the same position when
                taking the screenshots. Transfer the screenshots to your PC
                afterwards. Have you done that? Go to step 2.
                <a
                    href="https://github.com/ThemezerNX/Layouts#3-creating-overlays"
                    rel="noopener"
                    target="_blank"
                >
                    More detailed instructions
                </a>
            </div>
            <v-row class="ma-0">
                <v-col class="pa-2" cols="12">
                    <v-file-input
                        v-model="layoutJson"
                        accept="application/json"
                        filled
                        hide-details
                        label=".json layout"
                        prepend-icon="mdi-code-json"
                        rounded
                    />
                </v-col>
                <v-col class="pa-2" cols="12">
                    <v-file-input
                        v-model="pieceJson"
                        accept="application/json"
                        filled
                        hide-details
                        label=".json piece file (optional)"
                        prepend-icon="mdi-code-json"
                        rounded
                    />
                </v-col>
                <v-col class="pa-2" cols="12">
                    <v-file-input
                        v-model="commonJson"
                        accept="application/json"
                        filled
                        hide-details
                        label=".json common layout (optional)"
                        prepend-icon="mdi-code-json"
                        rounded
                    />
                </v-col>

                <ButtonDivider>
                    <v-btn
                        :disabled="!layoutJson"
                        :loading="loadingUploadLayout"
                        append
                        color="primary"
                        rounded
                        @click.prevent="uploadLayout()"
                    >
                        Get
                        <v-icon class="mt-1" right
                        >mdi-format-color-fill
                        </v-icon
                        >
                    </v-btn>
                </ButtonDivider>
            </v-row>

            <h2 class="box_text">
                2. Upload Screenshots
            </h2>
            <div class="subtitle-1 box_text">
                Here you will upload the two screenshots you took at step 1.
                Upload them to their own field below.
            </div>
            <v-row class="ma-0">
                <v-col
                    v-if="screenshotWhiteUrl"
                    class="pa-2"
                    cols="12"
                    sm="2"
                    style="position: relative;"
                    xs="12"
                >
                    <v-img
                        :src="screenshotWhiteUrl"
                        alt="Screenshot with white background"
                        aspect-ratio="1.7778"
                        class="placeholder"
                        contain
                    />
                </v-col>
                <v-col
                    :sm="screenshotWhiteUrl ? 10 : 12"
                    class="pa-2"
                    cols="12"
                    xs="12"
                >
                    <v-file-input
                        v-model="whiteImg"
                        accept="image/jpeg"
                        filled
                        hide-details
                        label="Screenshot with white background"
                        prepend-icon="mdi-monitor-screenshot"
                        rounded
                        @change="onScreenshotWhiteChange"
                    />
                </v-col>

                <v-col
                    v-if="screenshotBlackUrl"
                    class="pa-2"
                    cols="12"
                    sm="2"
                    style="position: relative;"
                    xs="12"
                >
                    <v-img
                        :src="screenshotBlackUrl"
                        alt="Screenshot with black background"
                        aspect-ratio="1.7778"
                        class="placeholder"
                        contain
                    />
                </v-col>
                <v-col
                    :sm="screenshotBlackUrl ? 10 : 12"
                    class="pa-2"
                    cols="12"
                    xs="12"
                >
                    <v-file-input
                        v-model="blackImg"
                        accept="image/jpeg"
                        filled
                        hide-details
                        label="Screenshot with black background"
                        prepend-icon="mdi-monitor-screenshot"
                        rounded
                        @change="onScreenshotBlackChange"
                    />
                </v-col>

                <ButtonDivider>
                    <v-btn
                        :disabled="!(blackImg && whiteImg)"
                        :loading="loadingUploadScreenshots"
                        append
                        color="primary"
                        rounded
                        @click.prevent="uploadScreenshots"
                    >
                        Create overlay
                        <v-icon right>mdi-image-edit-outline</v-icon>
                    </v-btn>
                </ButtonDivider>
            </v-row>

            <v-row v-if="!!resultImage" class="ma-0">
                <v-col class="pa-0" cols="12" xs="12">
                    <h2 class="box_text">
                        3. Result
                    </h2>
                </v-col>
                <v-col class="pa-2" cols="12" sm="4" xs="12">
                    <v-img
                        :src="
							`data:${resultImage.mimetype};base64,${resultImage.data}`
						"
                        alt="Created overlay image"
                        aspect-ratio="1.7778"
                        class="placeholder"
                        contain
                        style="background: rgba(255, 255, 255, 0.20);"
                        @click="download"
                    />
                </v-col>

                <v-col class="pa-0" cols="12" xs="12">
                    <ButtonDivider>
                        <DownloadButton
                            :download-function="download"
                            tooltip="Download image"
                        >
                            Save
                        </DownloadButton>
                    </ButtonDivider>
                </v-col>
            </v-row>
        </v-sheet>
    </v-container>
</template>

<script>
import Vue from 'vue'
import {createOverlay, createOverlayNXThemes} from '@/graphql/CreateOverlay.gql'

export default Vue.extend({
    components: {
        ButtonDivider: () => import('@/components/buttons/ButtonDivider.vue'),
        DownloadButton: () => import('@/components/buttons/DownloadButton.vue')
    },
    data() {
        return {
            layoutJson: null,
            pieceJson: null,
            commonJson: null,
            loadingUploadLayout: false,
            blackImg: null,
            screenshotBlackUrl: null,
            whiteImg: null,
            screenshotWhiteUrl: null,
            resultImage: null,
            loadingUploadScreenshots: false
        }
    },
    methods: {
        uploadLayout() {
            this.loadingUploadLayout = true
            this.blackImg = null
            this.whiteImg = null

            this.$apollo
                .mutate({
                    mutation: createOverlayNXThemes,
                    variables: {
                        layout: this.layoutJson,
                        piece: this.pieceJson,
                        common: this.commonJson
                    }
                })
                .then(({data}) => {
                    this.loadingUploadLayout = false
                    data.createOverlayNXThemes.forEach((file) => {
                        this.downloadFileB64(
                            file.data,
                            file.mimetype,
                            file.filename
                        )
                    })
                })
                .catch((err) => {
                    this.$snackbar.error(err)
                    this.loadingUploadLayout = false
                })
        },
        onScreenshotBlackChange(file) {
            if (file) {
                this.resultImage = null
                this.screenshotBlackUrl = URL.createObjectURL(file)
            }
        },
        onScreenshotWhiteChange(file) {
            if (file) {
                this.resultImage = null
                this.screenshotWhiteUrl = URL.createObjectURL(file)
            }
        },
        uploadScreenshots() {
            if (!(this.blackImg && this.whiteImg)) return

            this.resultImage = null
            this.loadingUploadScreenshots = true
            this.$apollo
                .mutate({
                    mutation: createOverlay,
                    variables: {
                        blackImg: this.blackImg,
                        whiteImg: this.whiteImg
                    }
                })
                .then(({data}) => {
                    this.loadingUploadScreenshots = false
                    this.resultImage = data.createOverlay

                    const self = this
                    setTimeout(() => {
                        const button = self.$refs.sheet
                        const position = button.getBoundingClientRect().bottom
                        window.scrollTo({top: position, behavior: 'smooth'})
                    }, 200)
                })
                .catch((err) => {
                    this.$snackbar.error(err)
                    this.loadingUploadScreenshots = false
                })
        },
        download() {
            this.downloadFileB64(
                this.resultImage.data,
                'image/png',
                this.resultImage.filename
            )
        }
    },
    head() {
        const metaTitle = 'Overlay Creator | Tools'
        const metaDesc =
            'Create a transparent overlay for your layout and customizations.'
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
