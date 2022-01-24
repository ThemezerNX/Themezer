<template>
    <PageSheet>
        <template #title>
            {{ $tc("overlayCreator", 1) }}
        </template>
        <template #description>
            {{ $t("overlayCreators.pageDescription") }} {{ $t("overlayCreators.pageUse") }}
        </template>
        <template #content>
            <h2>
                {{ $t("overlayCreators.step1") }}
            </h2>
            <p class="subtitle-1">
                {{ $t("overlayCreators.step1Description") }}
                <br>
                <OpenLink
                    to="https://github.com/ThemezerNX/Layouts/wiki/Creating-Overlays"
                >
                    {{ $t("overlayCreators.moreDetailedInstructions") }}
                </OpenLink>
            </p>
            <v-col>
                <v-row>
                    <v-col class="pa-2" cols="12">
                        <v-file-input
                            v-model="layoutJson"
                            :label="`${$tc('layout')}*`"
                            accept="application/json"
                            filled
                            outlined
                            prepend-icon="mdi-code-json"
                            :rules="[rules.required]"
                        />
                    </v-col>
                    <v-col class="pa-2" cols="12">
                        <v-file-input
                            v-model="pieceJson"
                            :label="$tc('layoutOption')"
                            :disabled="!layoutJson"
                            accept="application/json"
                            filled
                            outlined
                            hide-details
                            prepend-icon="mdi-code-json"
                        />
                    </v-col>
                    <v-col class="pa-2" cols="12">
                        <v-file-input
                            v-model="commonJson"
                            :label="$tc('commonLayout')"
                            accept="application/json"
                            filled
                            outlined
                            hide-details
                            prepend-icon="mdi-code-json"
                        />
                    </v-col>

                    <ButtonDivider>
                        <v-btn
                            :disabled="!layoutJson"
                            :loading="loadingUploadLayout"
                            append
                            color="primary"
                            @click.prevent="uploadLayout()"
                        >
                            {{ $t("createNxthemes") }}
                            <v-icon class="mt-1" right>mdi-format-color-fill</v-icon>
                        </v-btn>
                    </ButtonDivider>
                </v-row>
            </v-col>

            <h2>
                {{ $t("overlayCreators.step2") }}
            </h2>
            <p class="subtitle-1">
                {{ $t("overlayCreators.step2Description") }}
            </p>
            <v-col>
                <v-row>
                    <v-col
                        v-if="screenshotWhiteUrl"
                        class="pa-2"
                        cols="12"
                        sm="2"
                        style="position: relative;"
                        xs="12"
                    >
                        <v-img
                            :alt="$t('overlayCreators.screenshotWithWhiteBackground')"
                            :src="screenshotWhiteUrl"
                            aspect-ratio="1.7778"
                            cover
                        />
                    </v-col>
                    <v-col
                        :sm="screenshotWhiteUrl ? 10 : 12"
                        class="pa-2"
                        cols="12"
                        xs="12"
                    >
                        <v-file-input
                            v-model="whiteImage"
                            :label="`${$t('overlayCreators.screenshotWithWhiteBackground')}*`"
                            accept="image/jpeg"
                            filled
                            outlined
                            :rules="[rules.required]"
                            prepend-icon="mdi-monitor-screenshot"
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
                            :alt="$t('overlayCreators.screenshotWithBlackBackground')"
                            :src="screenshotBlackUrl"
                            aspect-ratio="1.7778"
                            cover
                        />
                    </v-col>
                    <v-col
                        :sm="screenshotBlackUrl ? 10 : 12"
                        class="pa-2"
                        cols="12"
                        xs="12"
                    >
                        <v-file-input
                            v-model="blackImage"
                            :label="`${$t('overlayCreators.screenshotWithBlackBackground')}*`"
                            accept="image/jpeg"
                            filled
                            outlined
                            :rules="[rules.required]"
                            prepend-icon="mdi-monitor-screenshot"
                        />
                    </v-col>

                    <ButtonDivider>
                        <v-btn
                            :disabled="!(blackImage && whiteImage)"
                            :loading="loadingUploadScreenshots"
                            append
                            color="primary"
                            @click.prevent="uploadScreenshots"
                        >
                            {{ $t("createOverlay") }}
                            <v-icon right>mdi-image-edit-outline</v-icon>
                        </v-btn>
                    </ButtonDivider>
                </v-row>
            </v-col>

            <v-col>
                <v-row v-if="!!resultImage">
                    <v-col class="pa-0" cols="12" xs="12">
                        <h2 class="box_text">
                            {{ $t("overlayCreators.step3") }}
                        </h2>
                    </v-col>
                    <v-col class="pa-2" cols="12" sm="4" xs="12">
                        <v-img
                            :alt="$t('overlayCreators.generatedImage')"
                            :src="`data:${resultImage.mimetype};base64,${resultImage.data}`"
                            aspect-ratio="1.7778"
                            cover
                            style="background: rgba(255, 255, 255, 0.20);"
                            @click="download"
                        />
                    </v-col>

                    <v-col class="pa-0" cols="12" xs="12">
                        <ButtonDivider>
                            <DownloadButton
                                :download-function="download"
                                :label="$t('item.downloadOverlay')"
                            >
                                {{ $t("save") }}
                            </DownloadButton>
                        </ButtonDivider>
                    </v-col>
                </v-row>
            </v-col>
        </template>
        <template #footer-centered>

        </template>
    </PageSheet>
</template>

<script>
import Vue from "vue";
import PageSheet from "@/components/page/Sheet";
import rules from "@/components/mixins/rules";
import {CREATE_OVERLAY_THEMES_QUERY} from "@/graphql/overlay-creator/CreateOverlayThemes";
import {CREATE_OVERLAY_QUERY} from "@/graphql/overlay-creator/CreateOverlay";
import DownloadButton from "@/components/buttons/DownloadButton";
import ButtonDivider from "@/components/buttons/ButtonDivider";

export default Vue.extend({
    mixins: [rules],
    components: {
        ButtonDivider,
        DownloadButton,
        PageSheet,
    },
    data() {
        return {
            layoutJson: null,
            pieceJson: null,
            commonJson: null,
            loadingUploadLayout: false,
            blackImage: null,
            screenshotBlackUrl: null,
            whiteImage: null,
            screenshotWhiteUrl: null,
            resultImage: null,
            loadingUploadScreenshots: false,
        };
    },
    methods: {
        async uploadLayout() {
            this.loadingUploadLayout = true;
            this.blackImage = null;
            this.screenshotBlackUrl = null;
            this.whiteImage = null;
            this.screenshotWhiteUrl = null;

            this.$apollo
                .query({
                    query: CREATE_OVERLAY_THEMES_QUERY,
                    variables: {
                        layoutJson: this.layoutJson ? await this.layoutJson.text() : undefined,
                        pieceJson: this.pieceJson ? await this.pieceJson.text() : undefined,
                        commonLayoutJson: this.commonJson ? await this.commonJson.text() : undefined,
                    },
                    fetchPolicy: "no-cache",
                })
                .then(({data}) => {
                    this.loadingUploadLayout = false;
                    data.createOverlayThemes.forEach((file) => {
                        this.$downloader.base64(
                            file.data,
                            file.mimetype,
                            file.fileName,
                        );
                    });
                })
                .catch((err) => {
                    this.$snackbar.error(err);
                    this.loadingUploadLayout = false;
                });
        },
        uploadScreenshots() {
            this.resultImage = null;
            this.loadingUploadScreenshots = true;
            this.$apollo
                .query({
                    query: CREATE_OVERLAY_QUERY,
                    variables: {
                        blackImage: this.blackImage,
                        whiteImage: this.whiteImage,
                    },
                    fetchPolicy: "no-cache",
                })
                .then(({data}) => {
                    this.loadingUploadScreenshots = false;
                    this.resultImage = data.createOverlay;

                    setTimeout(() => {
                        const button = this.$refs.sheet;
                        const position = button.getBoundingClientRect().bottom;
                        window.scrollTo({top: position, behavior: "smooth"});
                    }, 200);
                })
                .catch((err) => {
                    this.$snackbar.error(err);
                    this.loadingUploadScreenshots = false;
                });
        },
        download() {
            this.$downloader.base64(
                this.resultImage.data,
                "image/png",
                this.resultImage.fileName,
            );
        },
    },
    watch: {
        blackImage(val) {
            this.resultImage = null;
            if (val) {
                this.screenshotBlackUrl = URL.createObjectURL(val);
            }
        },
        whiteImage(val) {
            this.resultImage = null;
            if (val) {
                this.screenshotWhiteUrl = URL.createObjectURL(val);
            }
        },
    },
    head() {
        const metaTitle = `${this.$tc("overlayCreator")} | ${this.$tc("tool", 2)}`;
        const metaDesc = this.$t("overlayCreators.pageDescription");
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
