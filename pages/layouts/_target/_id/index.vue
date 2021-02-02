<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <LoadingOverlay :loading="!!$apollo.loading" :margin="false">
            <v-sheet v-if="layout" class="pa-2 box_fill" no-gutters>
                <v-row class="ma-0">
                    <v-col
                        :sm="landscape ? 8 : 12"
                        class="pa-2"
                        cols="12"
                        md="9"
                        xs="12"
                    >
                        <v-fade-transition>
                            <v-img
                                :src="
									`${API_ENDPOINT}cdn/layouts/${layout.uuid}/overlay.png`
								"
                                :style="backgroundStyle"
                                aspect-ratio="1.7778"
                                class="overlay-image transition-fast-in-fast-out"
                                cover
                            />
                        </v-fade-transition>
                    </v-col>
                    <v-col
                        :sm="landscape ? 4 : 12"
                        class="pa-2"
                        cols="12"
                        md="3"
                        style="position: relative;"
                        xs="12"
                    >
                        <h1>
                            {{ layout.details.name }}
                        </h1>
                        <div class="subtitle-1">
                            By
                            <nuxt-link
                                :to="`/creators/${layout.creator.id}`"
                                class="font-weight-bold"
                            >
                                {{ layout.creator.display_name }}
                            </nuxt-link>
                        </div>
                        <div
                            v-if="layout.details.description"
                            v-linkified:options="{
								className: 'font-weight-medium'
							}"
                            class="font-weight-thin subtitle-1"
                            v-html="layout.details.description"
                        />

                        <ButtonDivider>
                            <LikeButton
                                v-if="$auth.loggedIn"
                                :id="layout.id"
                                :count="
									layout.like_count > 0
										? layout.like_count
										: $auth.user.liked.layouts
												.map((l) => l.id)
												.includes(layout.id)
										? 1
										: 0
								"
                                :value="
									$auth.user.liked.layouts
										.map((l) => l.id)
										.includes(layout.id)
								"
                                type="layouts"
                            />
                            <ShareButton
                                :creator="layout.creator.display_name"
                                :name="layout.details.name"
                                type="layout"
                            />
                        </ButtonDivider>

                        <h3>
                            Details
                        </h3>
                        <div class="font-weight-light body-2">
                            <span class="font-weight-medium">ID: </span>
                            {{ layout.id }}
                        </div>
                        <div class="font-weight-light body-2">
                            <span class="font-weight-medium">Version: </span>
                            {{ layout.details.version }}
                        </div>
                        <div class="font-weight-light body-2">
							<span class="font-weight-medium"
              >Last Updated:</span
              >
                            {{ niceDate(layout.last_updated) }}
                        </div>
                        <div class="font-weight-light body-2">
							<span class="font-weight-medium"
              >Target File:
							</span>
                            {{ layout.target }}.szs
                        </div>
                        <div
                            v-if="!!layout.baselayout"
                            class="font-weight-light body-2"
                        >
                            <span class="font-weight-medium">Downloads: </span>
                            {{ layout.dl_count }}
                        </div>

                        <ButtonDivider>
                            <OptionsButton
                                v-if="layout.has_pieces && !!layout.baselayout"
                                :loading="loadingMerge"
                                to="options"
                            />
                            <DownloadButton
                                v-if="!!layout.baselayout"
                                :download-function="download"
                                :loading="loadingMerge"
                                tooltip="Download layout"
                            />
                        </ButtonDivider>

                        <div v-if="commonlayoutObject">
                            <h3 style="position: relative;">
                                Common layout
                                <v-tooltip v-model="showCommonInfo" top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            v-on="on"
                                            class="ml-1 pa-0 grey lighten-1"
                                            height="14"
                                            icon
                                            rounded
                                            style="position: absolute; top: 0; color: black;"
                                            width="14"
                                            @click="commonlayoutDialog = true"
                                        >
                                            ?
                                        </v-btn>
                                    </template>
                                    <span>What is this?</span>
                                </v-tooltip>
                            </h3>
                            <div class="font-weight-thin subtitle-1">
                                {{ commonlayoutObject.PatchName }}
                            </div>
                            <div
                                v-if="commonlayoutObject.AuthorName"
                                class="font-weight-light body-2"
                            >
								<span class="font-weight-medium">
									Author:
								</span>
                                {{ commonlayoutObject.AuthorName }}
                            </div>
                            <div
                                v-if="commonlayoutObject.TargetName"
                                class="font-weight-light body-2"
                            >
								<span class="font-weight-medium"
                >Target File:
								</span>
                                {{ commonlayoutObject.TargetName }}
                            </div>
                            <ButtonDivider>
                                <DownloadButton
                                    :download-function="downloadCommon"
                                    :loading="loadingGetCommon"
                                    tooltip="Download common"
                                />
                            </ButtonDivider>
                        </div>
                        <h3 style="position: relative;">
                            Overlay png
                            <v-tooltip v-model="showOverlayInfo" top>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        v-on="on"
                                        class="ml-1 pa-0 grey lighten-1"
                                        height="14"
                                        icon
                                        rounded
                                        style="position: absolute; top: 0; color: black;"
                                        width="14"
                                        @click="overlayDialog = true"
                                    >
                                        ?
                                    </v-btn>
                                </template>
                                <span>What is this?</span>
                            </v-tooltip>
                        </h3>
                        <ButtonDivider>
                            <DownloadButton
                                :download-href="
									`${API_ENDPOINT}cdn/layouts/${layout.uuid}/overlay.png`
								"
                                tooltip="Download overlay"
                            />
                        </ButtonDivider>
                        <h3>
                            Themes
                        </h3>
                        <nuxt-link
                            :to="
								`/themes/${fileNameToWebName(
									layout.target
								)}?sort=updated&order=desc&layouts=${layout.id}`
							"
                        >
                            <div style="text-shadow: 0 0 4px black;">
                                All Themes made with this layout
                            </div>
                        </nuxt-link>
                    </v-col>
                </v-row>
                <v-row class="ma-0">
                    <v-col
                        :class="
							$vuetify.breakpoint.smAndDown ? 'px-0 py-2' : 'pa-2'
						"
                    >
                        <BackgroundsSlideGroup/>
                    </v-col>
                </v-row>
                <v-dialog v-model="commonlayoutDialog" max-width="400">
                    <v-card>
                        <v-card-title class="headline"
                        >What is the Common layout?
                        </v-card-title
                        >

                        <v-card-text>
                            The Common layout is the footer seen in and shared
                            across the Home Menu, All Apps, Settings and News.
                            The stock version contains the currently active
                            controller on the left, the divider line and the
                            button actions on the right. Some layouts include a
                            Common layout to hide the line or make other minor
                            modifications. Modifying the Common layout for
                            Player Select and User Page is unsupported by the
                            Switch Theme Injector. It is always recommended to
                            download and use this layout as well!
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                                color="primary"
                                rounded
                                text
                                @click="commonlayoutDialog = false"
                            >
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="overlayDialog" max-width="400">
                    <v-card>
                        <v-card-title class="headline"
                        >What is the Overlay png?
                        </v-card-title
                        >

                        <v-card-text>
                            The Overlay png is the image used on this site to
                            preview Layouts. You may also use this to create the
                            'screenshot' you need when uploading a Theme to
                            Themezer.
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                                color="primary"
                                rounded
                                text
                                @click="overlayDialog = false"
                            >
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-sheet>
        </LoadingOverlay>
    </v-container>
</template>

<script>
import Vue from 'vue'
import shared from '@/layouts/details/SharedScript'
import {downloadCommonLayout, downloadLayout, layout} from '@/graphql/Layout.gql'
import targetParser from '@/components/mixins/targetParser'

export default Vue.extend({
    components: {
        ButtonDivider: () => import('@/components/buttons/ButtonDivider.vue'),
        OptionsButton: () => import('@/components/buttons/OptionsButton.vue'),
        DownloadButton: () => import('@/components/buttons/DownloadButton.vue'),
        LikeButton: () => import('@/components/buttons/LikeButton.vue'),
        ShareButton: () => import('@/components/buttons/ShareButton.vue'),
        BackgroundsSlideGroup: () =>
            import('@/components/BackgroundsSlideGroup.vue'),
        LoadingOverlay: () => import('@/components/LoadingOverlay.vue')
    },
    mixins: [shared, targetParser],
    data() {
        return {
            API_ENDPOINT: process.env.API_ENDPOINT,
            showCommonInfo: false,
            commonlayoutDialog: false,
            showOverlayInfo: false,
            overlayDialog: false,
            loadingMerge: false,
            loadingGetCommon: false
        }
    },
    computed: {
        backgroundStyle() {
            if (this.$store.state.background) {
                return (
                    'background-image: url(' +
                    (this.$store.state.background.startsWith('blob')
                        ? this.$store.state.background
                        : require(`@/assets/backgrounds/${this.$store.state.background}`)) +
                    ')'
                )
            } else if (this.$route.params.target === 'playerselect') {
                return `background-image: url(/images/blurredhome.jpg);`
            } else if (this.layout.details.color) {
                return `background: ${this.layout.details.color};`
            } else {
                return `background: #2d2d2d;`
            }
        },
        commonlayoutObject() {
            if (this.layout.commonlayout) {
                return JSON.parse(this.layout.commonlayout)
            } else return null
        }
    },
    methods: {
        download() {
            this.loadingMerge = true
            this.$apollo
                .mutate({
                    mutation: downloadLayout,
                    variables: {
                        id: this.layout.id,
                        piece_uuids: []
                    }
                })
                .then(({data}) => {
                    this.loadingMerge = false

                    this.downloadFile(
                        data.downloadLayout,
                        'application/json',
                        this.layout.details.name
                    )
                })
                .catch((err) => {
                    this.$snackbar.error(err)
                    this.loadingMerge = false
                })
        },
        downloadCommon() {
            this.loadingGetCommon = true
            this.$apollo
                .mutate({
                    mutation: downloadCommonLayout,
                    variables: {
                        id: this.layout.id
                    }
                })
                .then(({data}) => {
                    this.loadingGetCommon = false

                    this.downloadFile(
                        data.downloadCommonLayout,
                        'application/json',
                        `${this.layout.details.name} - Common layout`
                    )
                })
                .catch((err) => {
                    this.$snackbar.error(err)
                    this.loadingGetCommon = false
                })
        }
    },
    apollo: {
        layout: {
            query: layout,
            variables() {
                return {
                    id: this.id
                }
            },
            result({data}) {
                if (data && data.layout) {
                    this.updateUrlString(
                        data.layout.id,
                        data.layout.details.name,
                        this.fileNameToWebName(data.layout.target)
                    )
                }
            },
            prefetch: true
        }
    },
    head() {
        if (this.layout) {
            const metaTitle = `${
                this.layout.details.name
            } | ${this.targetName()} | Layouts`
            const metaDesc = this.layout.details.description
            const metaImg = `${process.env.API_ENDPOINT}cdn/layouts/${this.layout.uuid}/overlay.png`

            return {
                title: metaTitle,
                meta: [
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
    }
})
</script>

<style lang="scss" scoped>
.overlay-image {
    background-size: cover !important;
}
</style>
