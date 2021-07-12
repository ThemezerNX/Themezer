<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <v-sheet class="pa-2 box_fill" no-gutters>
            <h1 class="box_text">
                {{ $t("themePackSubmissions") }}
            </h1>
            <div class="subtitle-1 box_text">
                <i18n path="submitTheme.pageUse">
                    <template v-slot:action>
                        <v-btn
                            class="px-1"
                            color="primary"
                            rounded
                            style="height: 24px"
                            text
                            @click="submitInfoDialog = true"
                        >{{ $t("readThis") }}</v-btn>
                    </template>
                </i18n>
                <v-dialog v-model="submitInfoDialog" class="mx-auto" max-width="1000">
                    <TextCard title="More Info" max-width="1000" :items="submitInfo">
                        <template #footer>
                            <v-card-actions>
                                <v-spacer></v-spacer>

                                <v-btn
                                    color="primary"
                                    rounded
                                    text
                                    @click="submitInfoDialog = false"
                                >
                                    {{ $t("close") }}
                                </v-btn>
                            </v-card-actions>
                        </template>
                    </TextCard>
                </v-dialog>
            </div>

            <h2 class="box_text">
                {{ $t("submitTheme.step1") }}
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
                        :label="$t('fields.typeFile', {type: $tc('nxtheme')})"
                        prepend-icon="mdi-file-outline"
                        rounded
                        @change="onFileChange"
                    />
                    <div v-if="selectedType === 'zip'">
                        <div class="subtitle-1 box_text">
                            {{ $t("submitTheme.packHint") }}
                        </div>
                        <v-file-input
                            v-if="selectedType === 'zip'"
                            v-model="uploadSingleOrZip"
                            :loading="loading.uploadSingleOrZip"
                            accept="application/zip"
                            filled
                            hide-details
                            :label="$t('fields.typeFile', {type: $tc('zip')})"
                            prepend-icon="mdi-folder-zip-outline"
                            rounded
                            @change="onFileChange"
                        />
                    </div>

                    <div
                        v-if="selectedType === 'files'"
                        class="subtitle-1 box_text"
                    >
                        <i18n path="submitTheme.webInjector">
                            <template v-slot:webInjectorHref>
                                <nuxt-link to="/tools/theme-creator">{{ $t("onlineThemeCreator") }}</nuxt-link>
                            </template>
                        </i18n>
                    </div>
                </v-col>
            </v-row>
            <v-form ref="submitForm" v-model="submitValid">
                <div v-if="detectedThemes">
                    <h2 class="box_text">
                        {{ $t("submitTheme.step2") }}
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
                                :label="`${$t('fields.typeName', {type: $tc('pack')})}*`"
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
                                :label="`${$t('fields.typeDescription', {type: $tc('pack')})}*`"
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
                                :label="$t('fields.sharedCategories')"
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
                                :label="`${$t('fields.typeVersion', {type: $tc('pack')})}*`"
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
                        {{ $t("submitTheme.step3") }}
                    </h2>
                    <div v-if="detectedThemes.length === 0">
                        {{ $t("error.otherError") }}
                    </div>
                    <v-row v-else class="ma-0">
                        <v-col class="pa-2" cols="12">
                            <div class="subtitle-1 box_text">
                                {{ $t("submitTheme.screenshotHint") }}
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
                                    style="border-radius: 20px; background-color: rgba(255, 255, 255, 0.02);"
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
                                                                class="screenshot_upload transition-ease v-card--reveal"
                                                                color="black"
                                                                filled
                                                                full-width
                                                                height="100%"
                                                                hide-details
                                                                :label="`${$t('fields.screenshot', {filetype: 'jpg', size: '1280×720'})}*`"
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
                                                    {{ $t("item.author", {creator: theme.info.Author}) }}
                                                    <i class="subtitle-2">
                                                        ({{ $t("submitTheme.authorDisclaimer") }})
                                                    </i>
                                                </div>
                                                <v-list-item-subtitle
                                                    v-if="theme.layout"
                                                >
                                                    <i18n path="item.layout">
                                                        <template v-slot:value>
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
                                                        </template>
                                                    </i18n>
                                                    <div
                                                        v-if="
                                                          theme.used_pieces &&
                                                            theme
                                                              .used_pieces
                                                              .length > 0
                                                        "
                                                    >
                                                        <i18n path="item.customizations">
                                                            <template v-slot:value>
                                                                {{
                                                                    optionsString(
                                                                        theme.used_pieces
                                                                    )
                                                                }}
                                                            </template>
                                                        </i18n>
                                                    </div>
                                                </v-list-item-subtitle>
                                                <!--TODO: this ain't working-->
                                                <v-list-item-subtitle
                                                    v-else-if="theme.layout_id"
                                                >
                                                    <i18n path="item.layout">
                                                        <template v-slot:value>
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
                                                                {{ $t("submitTheme.manuallySelected") }}
                                                            </nuxt-link>
                                                        </template>
                                                    </i18n>
                                                </v-list-item-subtitle>
                                                <v-list-item-subtitle v-else>
                                                    {{ $t("item.layout", {value: $t("customLayout")}) }}
                                                </v-list-item-subtitle>
                                                <v-list-item-subtitle>
                                                    {{ $t("target.menu") }}
                                                    {{
                                                        toNiceWebName(
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
                                                    {{ $t("submitTheme.commonLayoutStatus", {key: "Common Layout", status: "✅"}) }}
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
                                                    :label="$t('fields.manualLayout')"
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
                                                    :label="`${$t('fields.typeDescription', {type: $tc('theme')})}`"
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
                                                    :label="`${$t('fields.categories', {key: '↵'})}* (${$t('fields.categoriesHint')})`"
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
                                                    :label="`${$t('fields.typeVersion', {type: $tc('theme')})}*`"
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
                                    {{ $t("error.otherError") }}
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
                            {{ $t("submit") }}
                            <v-icon right>mdi-cube-send</v-icon>
                        </v-btn>
                    </v-flex>
                </div>
            </v-form>
            <v-dialog v-model="nsfwDialog" max-width="600" persistent>
                <v-card>
                    <v-card-title class="headline">{{ $t("submitTheme.nsfwConfirm") }}</v-card-title>

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
                            {{ $t("noCancel") }}
                        </v-btn>

                        <v-spacer/>

                        <v-btn
                            color="primary"
                            rounded
                            text
                            @click="nsfwDialog = false"
                        >
                            {{ $t("yesContinue") }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-sheet>
    </v-container>
</template>

<script>
import Vue from 'vue'
import rules from '@/components/mixins/rules'
import allLayoutsDropdown from '@/components/mixins/allLayoutsDropdown'
import allCategoriesDropdown from '@/components/mixins/allCategoriesDropdown'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '@/components/mixins/urlParser'
import {submitThemes, uploadSingleOrZip} from '@/graphql/SubmitTheme.gql'
import optionsString from '@/components/mixins/optionsString'
import submitInfo from '~/components/mixins/submitInfo'
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
        optionsString,
        rules,
        submitInfo
    ],
    data() {
        return {
            forceUpdate: 0,
            types: [
                {
                    id: 'single',
                    label: this.$t("submitTheme.uploadTypes.single")
                },
                {
                    id: 'zip',
                    label: this.$t("submitTheme.uploadTypes.zip", {max: "25 MB"})
                },
                {
                    id: 'files',
                    label: this.$t("submitTheme.uploadTypes.files")
                }
            ],
            submitTypes: [
                {
                    id: 'pack',
                    label: this.$tc("pack")
                },
                {
                    id: 'separate',
                    label: this.$t("submitTheme.separateType", {type: this.$tc("theme", 2)})
                }
            ],
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
            this.packCategories = []
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
                this.loading.submit = true;

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
                                message = this.$t("submitTheme.submitSuccess", {type: this.$tc("pack")})
                            } else {
                                message = this.$t("submitTheme.submitSuccess", {type: this.$tc("theme", 2)})
                            }
                            this.loading.submit = false
                            this.clearAll()
                            this.$snackbar.message(message)
                        } else {
                            this.$snackbar.error(this.$t("error.otherError"))
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
        const metaTitle = `${this.$tc("theme")}/${this.$tc("pack")} | ${this.$t("upload")}`
        const metaDesc = this.$t("submitTheme.pageDescription")
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

<style lang="scss">
@import 'assets/screenshot-upload.scss';
</style>
