<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <v-sheet class="pa-2 box_fill" no-gutters>
            <h1 class="box_text">
                Theme/Pack Submissions
            </h1>
            <div class="subtitle-1 box_text">
                Via this form you can submit themes you have created.
                If you're new to this, I urge you to
                <v-btn
                    class="px-1"
                    color="primary"
                    rounded
                    style="height: 24px"
                    text
                    @click="submitInfoDialog = true"
                >read this.
                </v-btn
                >
                <v-dialog v-model="submitInfoDialog" class="mx-auto" max-width="1000">
                    <TextCard title="More Info" max-width="1000" :items="submitInfo"></TextCard>
                </v-dialog>
            </div>

            <h2 class="box_text">
                1. Upload the theme/pack
            </h2>
            <v-row class="ma-0">
                <v-col class="pa-2" cols="12">
                    <v-radio-group v-model="selectedType" class="mt-0" row>
                        <v-radio
                            v-for="type in types"
                            :key="type.id"
                            :disabled="type.disabled"
                            :label="type.label"
                            :value="type.id"
                            @change="clearAll()"
                        ></v-radio>
                    </v-radio-group>
                    <v-file-input
                        v-if="selectedType === 'single'"
                        v-model="uploadSingleOrZip"
                        :loading="loading.uploadSingleOrZip"
                        accept=".nxtheme"
                        filled
                        hide-details
                        label="NXTheme file"
                        prepend-icon="mdi-file-outline"
                        rounded
                        @change="onFileChange"
                    />
                    <div v-if="selectedType === 'zip'">
                        <div class="subtitle-1 box_text">
                            Make sure the NXThemes are in the root of the zip,
                            not in a folder!
                        </div>
                        <v-file-input
                            v-if="selectedType === 'zip'"
                            v-model="uploadSingleOrZip"
                            :loading="loading.uploadSingleOrZip"
                            accept="application/zip"
                            filled
                            hide-details
                            label="Zip file"
                            prepend-icon="mdi-folder-zip-outline"
                            rounded
                            @change="onFileChange"
                        />
                    </div>

                    <div
                        v-if="selectedType === 'files'"
                        class="subtitle-1 box_text"
                    >
                        You can create NXThemes using the
                        <a
                            href="https://exelix11.github.io/SwitchThemeInjector/v2/"
                            rel="noopener"
                            target="_blank"
                        >WebInjector</a
                        >. You may submit the created NXTheme(s) here.
                    </div>
                </v-col>
            </v-row>
            <v-form ref="submitForm" v-model="submitValid">
                <div v-if="detectedThemes">
                    <h2 class="box_text">
                        3. Pack Details
                    </h2>
                    <v-row class="ma-0">
                        <v-col class="pa-2" cols="12">
                            <v-radio-group
                                v-model="selectedSubmitType"
                                class="mt-0"
                                mandatory
                                row
                            >
                                <v-radio
                                    v-for="type in submitTypes"
                                    :key="type.id"
                                    :disabled="
										(type.id === 'pack' &&
											detectedThemes.length === 1) ||
											type.disabled
									"
                                    :label="type.label"
                                    :value="type.id"
                                    @change="clearSwitchSubmitType()"
                                ></v-radio>
                            </v-radio-group>
                            <v-text-field
                                v-if="selectedSubmitType === 'pack'"
                                v-model="submitDetails.name"
                                :rules="[
									rules.required,
									rules.name_length,
									rules.utf8_only
								]"
                                counter="50"
                                label="Pack Name*"
                                maxlength="50"
                                minlength="3"
                                outlined
                                prepend-icon="mdi-pencil-outline"
                                rounded
                                @change="forceUpdate++"
                            ></v-text-field>
                            <v-text-field
                                v-if="selectedSubmitType === 'pack'"
                                v-model="submitDetails.description"
                                :rules="[
									rules.required,
									rules.description_length,
									rules.utf8_only
								]"
                                counter="500"
                                label="Pack Description*"
                                maxlength="500"
                                minlength="10"
                                outlined
                                prepend-icon="mdi-pencil-outline"
                                rounded
                                @change="forceUpdate++"
                            ></v-text-field>
                            <v-combobox
                                v-if="detectedThemes.length > 1"
                                v-model="packCategories"
                                :items="
									categories && categories.length > 0
										? categories
										: []
								"
                                :rules="[
									rules.category_length,
									rules.max_category_amount,
									rules.utf8_only
								]"
                                allow-overflow
                                chips
                                deletable-chips
                                label="Shared categories (this will replace the current set)"
                                multiple
                                outlined
                                prepend-icon="mdi-shape-outline"
                                rounded
                                small-chips
                            ></v-combobox>
                            <v-text-field
                                v-if="selectedSubmitType === 'pack'"
                                v-model="submitDetails.version"
                                :rules="[rules.required, rules.utf8_only]"
                                counter="10"
                                label="Pack version*"
                                maxlength="10"
                                outlined
                                prepend-icon="mdi-update"
                                rounded
                                @change="forceUpdate++"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </div>
                <div v-if="detectedThemes">
                    <h2 class="box_text">
                        3. Theme Details
                    </h2>
                    <div v-if="detectedThemes.length === 0">
                        Uhm something went wrong, please report this.
                    </div>
                    <v-row v-else class="ma-0">
                        <v-col class="pa-2" cols="12">
                            <div class="subtitle-1 box_text">
                                You must upload a SCREENSHOT (NOT simply the
                                background image). Do so by clicking the
                                placeholder image.
                            </div>
                            <template v-for="(theme, i) in detectedThemes">
                                <v-card
                                    v-if="theme"
                                    :key="theme.info.ThemeName"
                                    :class="
										i === detectedThemes.length - 1
											? ''
											: 'mb-2'
									"
                                    class="mx-auto"
                                    outlined
                                    style="border-radius: 10px; background-color: rgba(255, 255, 255, 0.02);"
                                >
                                    <v-list-item class="px-0" three-line>
                                        <v-list-item-content class="pa-0">
                                            <v-col
                                                class="pa-2"
                                                cols="12"
                                                md="2"
                                                sm="4"
                                                xs="12"
                                            >
                                                <v-hover
                                                    v-slot:default="{ hover }"
                                                >
                                                    <v-img
                                                        :src="
															uploadedScreenshotsUrls[
																i
															] || ''
														"
                                                        aspect-ratio="1.7778"
                                                        class="placeholder display-3"
                                                        contain
                                                    >
                                                        <v-expand-transition>
                                                            <v-file-input
                                                                v-show="
																	!uploadedScreenshots[
																		i
																	] || hover
																"
                                                                v-model="
																	uploadedScreenshots[
																		i
																	]
																"
                                                                :rules="[
																	rules.required
																]"
                                                                accept="image/jpeg"
                                                                class="screenshot_upload transition-fast-in-fast-out v-card--reveal"
                                                                color="black"
                                                                filled
                                                                full-width
                                                                height="100%"
                                                                hide-details
                                                                label="SCREENSHOT* (jpg, 1280x720)"
                                                                style="cursor: pointer; height: 100%; background: rgba(0, 0, 0, 0.5);"
                                                                @change="
																	onScreenshotChange(
																		$event,
																		i
																	)
																"
                                                            />
                                                        </v-expand-transition>
                                                    </v-img>
                                                </v-hover>
                                            </v-col>
                                            <v-col
                                                class="pa-2"
                                                cols="12"
                                                md="10"
                                                sm="8"
                                                style="position: relative;"
                                                xs="12"
                                            >
                                                <h1>
                                                    {{ theme.info.ThemeName }}
                                                </h1>
                                                <div
                                                    v-if="theme.info.Author"
                                                    class="subtitle-1"
                                                >
                                                    By {{ theme.info.Author }}
                                                    <i class="subtitle-2">
                                                        (this will be replaced
                                                        with YOUR username)
                                                    </i>
                                                </div>
                                                <v-list-item-subtitle
                                                    v-if="theme.layout"
                                                >
                                                    Layout:
                                                    <nuxt-link
                                                        :to="
															`/layouts/${fileNameToWebName(
																theme.layout
																	.target
															)}/${createUrlString(
																theme.layout.id,
																theme.layout
																	.details
																	.name
															)}`
														"
                                                        exact
                                                        target="_blank"
                                                    >
                                                        {{
                                                            theme.layout.details
                                                                .name
                                                        }}
                                                    </nuxt-link>
                                                    <div
                                                        v-if="
															theme.used_pieces &&
																theme
																	.used_pieces
																	.length > 0
														"
                                                    >
                                                        Options:
                                                        {{
                                                            optionsString(
                                                                theme.used_pieces
                                                            )
                                                        }}
                                                    </div>
                                                </v-list-item-subtitle>
                                                <!--TODO: this ain't working-->
                                                <v-list-item-subtitle
                                                    v-else-if="theme.layout_id"
                                                >
                                                    Layout:
                                                    <nuxt-link
                                                        :to="
															`/layouts/${fileNameToWebName(
																theme.target
															)}/${createUrlString(
																theme.layout_id,
																''
															)}`
														"
                                                        exact
                                                        target="_blank"
                                                    >
                                                        Manually selected
                                                    </nuxt-link>
                                                </v-list-item-subtitle>
                                                <v-list-item-subtitle v-else>
                                                    Layout: custom
                                                </v-list-item-subtitle>
                                                <v-list-item-subtitle>
                                                    Target:
                                                    {{
                                                        fileNameToNiceWebName(
                                                            theme.target
                                                        )
                                                    }}
                                                </v-list-item-subtitle>
                                                <v-list-item-subtitle
                                                    v-if="
														theme.layout &&
															theme.layout
																.has_commonlayout
													"
                                                >
                                                    Common layout: ✅
                                                </v-list-item-subtitle>
                                            </v-col>
                                            <v-col class="pb-0">
                                                <v-autocomplete
                                                    v-if="!theme.layout"
                                                    v-model="
														detectedThemes[i]
															.layout_id
													"
                                                    :items="
														layouts[theme.target]
													"
                                                    :loading="
														!!$apollo.queries
															.layoutList.loading
													"
                                                    allow-overflow
                                                    auto-select-first
                                                    label="Manual layout selection"
                                                    outlined
                                                    prepend-icon="mdi-code-json"
                                                    rounded
                                                    @mouseover="
														currentThemeTarget =
															theme.target
													"
                                                >
                                                </v-autocomplete>
                                                <v-text-field
                                                    v-model="
														detectedThemes[i]
															.description
													"
                                                    :rules="[
														rules.description_length,
														rules.utf8_only
													]"
                                                    counter="500"
                                                    label="Theme description"
                                                    maxlength="500"
                                                    minlength="10"
                                                    outlined
                                                    prepend-icon="mdi-pencil-outline"
                                                    rounded
                                                    @change="forceUpdate++"
                                                ></v-text-field>
                                                <v-combobox
                                                    v-model="
														detectedThemes[i]
															.categories
													"
                                                    :items="
														categories &&
														categories.length > 0
															? categories.filter(
																	(c) =>
																		c !==
																		'NSFW'
															  )
															: []
													"
                                                    :loading="
														!!$apollo.queries
															.categories.loading
													"
                                                    :rules="[
														rules.category_length,
														rules.min_category_amount,
														rules.max_category_amount,
														rules.required,
														rules.utf8_only
													]"
                                                    allow-overflow
                                                    chips
                                                    deletable-chips
                                                    label="Categories* ([enter] to create)"
                                                    multiple
                                                    outlined
                                                    prepend-icon="mdi-shape-outline"
                                                    rounded
                                                    small-chips
                                                ></v-combobox>
                                                <v-text-field
                                                    v-if="
														selectedSubmitType ===
															'separate'
													"
                                                    v-model="
														detectedThemes[i]
															.version
													"
                                                    :rules="[
														rules.required,
														rules.utf8_only
													]"
                                                    counter="10"
                                                    label="Theme version*"
                                                    maxlength="10"
                                                    outlined
                                                    prepend-icon="mdi-update"
                                                    rounded
                                                    @change="forceUpdate++"
                                                ></v-text-field>
                                                <v-checkbox
                                                    v-model="
														detectedThemes[i].nsfw
													"
                                                    class="mt-0"
                                                    color="red"
                                                    label="NSFW"
                                                    @change="
														nsfwConfirm($event, i)
													"
                                                />
                                            </v-col>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-card>
                                <div
                                    v-else
                                    :key="theme"
                                    class="subtitle-1 box_text font-italic"
                                >
                                    An error occurred
                                </div>
                            </template>
                        </v-col>
                    </v-row>
                    <v-flex class="d-flex justify-center my-3">
                        <v-btn
                            :disabled="!submitValid"
                            :loading="loading.submit"
                            color="secondary"
                            rounded
                            type="submit"
                            @click.prevent="submit()"
                        >
                            Submit
                            <v-icon right>mdi-cube-send</v-icon>
                        </v-btn>
                    </v-flex>
                </div>
            </v-form>
            <v-dialog v-model="nsfwDialog" max-width="600" persistent>
                <v-card>
                    <v-card-title class="headline"
                    >Theme will be marked as NSFW, continue?
                    </v-card-title>

                    <v-card-actions>
                        <v-btn
                            color="red"
                            rounded
                            text
                            @click="
								nsfwDialog = false
								detectedThemes[nsfwDialogThemeNr].nsfw = false
							"
                        >
                            No, cancel
                        </v-btn>

                        <v-spacer/>

                        <v-btn
                            color="primary"
                            rounded
                            text
                            @click="nsfwDialog = false"
                        >
                            Yes
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-sheet>
    </v-container>
</template>

<script>
import Vue from 'vue'
import rules from '~/assets/lang/rules'
import allLayoutsDropdown from '@/components/mixins/allLayoutsDropdown'
import allCategoriesDropdown from '@/components/mixins/allCategoriesDropdown'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '@/components/mixins/urlParser'
import {submitThemes, uploadSingleOrZip} from '@/graphql/SubmitTheme.gql'
import optionsString from '@/components/mixins/optionsString'
import submitInfo from '~/assets/lang/submitInfo'
import TextCard from "~/components/TextCard.vue";

export default Vue.extend({
    components: {TextCard},
    middleware: ['auth'],
    options: {
        auth: true
    },
    mixins: [
        targetParser,
        urlParser,
        allLayoutsDropdown,
        allCategoriesDropdown,
        optionsString
    ],
    data() {
        return {
            forceUpdate: 0,
            types: [
                {
                    id: 'single',
                    label: 'A single NXTheme'
                },
                {
                    id: 'zip',
                    label: 'A zip with NXThemes (pack/bulk, max 25MB)'
                },
                {
                    id: 'files',
                    label: 'An image'
                }
            ],
            submitTypes: [
                {
                    id: 'pack',
                    label: 'Pack'
                },
                {
                    id: 'separate',
                    label: 'Separate Themes'
                }
            ],
            submitInfo,
            nsfwDialog: false,
            nsfwDialogThemeNr: null,
            submitInfoDialog: false,
            selectedType: null,
            uploadSingleOrZip: null,
            loading: {
                uploadSingleOrZip: false,
                submit: false
            },
            detectedThemes: null,
            uploadedScreenshots: [],
            uploadedScreenshotsUrls: [],
            selectedSubmitType: null,
            submitValid: false,
            rules,
            submitDetails: {
                name: null,
                description: null,
                color: null,
                version: null
            }
        }
    },

    methods: {
        clearAll() {
            this.uploadSingleOrZip = null
            this.loading.uploadSingleOrZip = false
            this.loading.submit = false
            this.detectedThemes = null
            this.uploadedScreenshots = []
            this.uploadedScreenshotsUrls = []
            this.selectedSubmitType = null
            this.submitValid = false
            this.submitDetails = {
                name: null,
                description: null,
                color: null,
                version: null
            }
        },
        nsfwConfirm(value, i) {
            if (value) {
                this.nsfwDialog = true
                this.nsfwDialogThemeNr = i
            }
        },
        clearSwitchSubmitType() {
            for (const i in this.detectedThemes) {
                this.detectedThemes[i].version = null
            }
        },
        onFileChange(file) {
            if (file) {
                this.loading.uploadSingleOrZip = true

                this.$apollo
                    .mutate({
                        mutation: uploadSingleOrZip,
                        variables: {
                            file
                        }
                    })
                    .then(({data}) => {
                        this.loading.uploadSingleOrZip = false

                        this.detectedThemes = data.uploadSingleOrZip

                        this.$apollo.queries.categories.skip = false
                        this.$apollo.queries.categories.refetch()
                        this.$apollo.queries.layoutList.skip = false
                    })
                    .catch((err) => {
                        this.$snackbar.error(err)
                        this.loading.uploadSingleOrZip = false
                    })
            }
        },
        onScreenshotChange(file, i) {
            if (file) {
                this.uploadedScreenshotsUrls[i] = URL.createObjectURL(file)

                this.forceUpdate++
            }
        },
        submit() {
            if (
                this.uploadedScreenshots.length === this.detectedThemes.length
            ) {
                const themeInput = this.detectedThemes.map((t) => {
                    return {
                        info: t.info,
                        tmp: t.tmp,
                        layout_id: t.layout ? t.layout.id : t.layout_id || null,
                        used_pieces: t.used_pieces,
                        target: t.target,
                        color: t.color,
                        description: t.description,
                        version: t.version,
                        categories: t.categories,
                        nsfw: t.nsfw
                    }
                })

                this.$apollo
                    .mutate({
                        mutation: submitThemes,
                        variables: {
                            files: this.uploadedScreenshots,
                            themes: themeInput,
                            details: this.submitDetails,
                            type: this.selectedSubmitType
                        }
                    })
                    .then(({data}) => {
                        if (data.submitThemes === true) {
                            let message
                            if (this.selectedSubmitType === 'pack') {
                                message = 'Pack submitted successfully!'
                            } else {
                                message = 'Themes submitted successfully!'
                            }
                            this.loading.submit = false
                            this.clearAll()
                            this.$snackbar.message(message)
                        } else {
                            this.$snackbar.error(new Error('Unknown error'))
                        }
                    })
                    .catch((err) => {
                        this.$snackbar.error(err)
                        this.loading.submit = false
                    })
            }
        }
    },
    head() {
        const metaTitle = 'Theme | Submit'
        const metaDesc =
            'You can submit themes here for listing on this website.'
        const metaImg = null

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
})
</script>

<style lang="scss">
@import 'assets/screenshot-upload.scss';
</style>
