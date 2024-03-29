<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <LoadingOverlay :loading="!!$apollo.loading" :margin="false">
            <v-sheet v-if="theme" class="pa-2 box" no-gutters>
                <v-row class="ma-0">
                    <v-col
                        :sm="landscape ? 8 : 12"
                        class="pa-2"
                        cols="12"
                        md="9"
                        xs="12"
                    >
                        <v-img
                            :src="theme.preview.original"
                            aspect-ratio="1.7778"
                            class="overlay-image"
                            cover
                        />
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
                            {{ theme.details.name }}
                        </h1>
                        <div class="subtitle-1">
                            <i18n path="item.author">
                                <template v-slot:creator>
                                    <nuxt-link
                                        :to="`/creators/${theme.creator.id}`"
                                        class="font-weight-bold"
                                    >
                                        {{ theme.creator.display_name }}
                                    </nuxt-link>
                                </template>
                            </i18n>
                        </div>
                        <div
                            v-if="theme.details.description"
                            v-linkified:options="{
                                className: 'font-weight-medium'
                            }"
                            class="font-weight-thin subtitle-1"
                            v-html="theme.details.description"
                        />

                        <div>
                            <v-chip
                                v-for="(category, i) in theme.categories"
                                :key="i"
                                class="ma-2"
                                pill
                                small
                            >
                                {{ category }}
                            </v-chip>
                        </div>

                        <ButtonDivider>
                            <LikeButton
                                :id="theme.id"
                                :count="
                                  theme.like_count > 0
                                    ? theme.like_count
                                    : ($auth.loggedIn && $auth.user.liked.themes.some((t) => t.id === theme.id) ? 1 : 0)
                                "
                                :value="
                                    $auth.loggedIn && $auth.user.liked.themes.some((t) => t.id === theme.id)
                                "
                                type="themes"
                            />
                            <ShareButton
                                :creator="theme.creator.display_name"
                                :name="theme.details.name"
                                type="theme"
                            />
                            <EditButton v-if="mayModerate" :label="$t('item.editTheme')"/>
                            <ReportButton
                                v-if="!mayModerate"
                                :nsfw="theme.categories.includes('NSFW')"
                                type="theme"
                            />
                        </ButtonDivider>

                        <h3>
                            {{ $t("item.details") }}
                        </h3>
                        <div class="font-weight-medium body-2">
                            <i18n path="item.id">
                                <template v-slot:value>
                                    <span class="font-weight-light">{{ theme.id }}</span>
                                </template>
                            </i18n>
                        </div>
                        <div class="font-weight-medium body-2">
                            <i18n path="item.lastUpdated">
                                <template v-slot:value>
                                    <span class="font-weight-light">{{ $d(new Date(theme.last_updated), "short") }}</span>
                                </template>
                            </i18n>
                        </div>
                        <div class="font-weight-medium body-2">
                            <i18n path="item.layout">
                                <template v-slot:value>
                                    <nuxt-link
                                        v-if="theme.layout"
                                        :to="
                                  `/layouts/${fileNameToWebName(
                                    theme.layout.target
                                  )}/${createUrlString(
                                    theme.layout.id,
                                    theme.layout.details.name
                                  )}`
                                "
                                        class="font-weight-bold"
                                    >
                                        {{ theme.layout.details.name }}
                                    </nuxt-link>
                                    <template v-else>
                                        <a
                                            class="font-weight-bold"
                                            href="#"
                                            @click="
                                        downloadFileUrl(
                                          `${API_ENDPOINT}cdn/themes/${theme.id}/layout.json`,
                                          'application/json',
                                          `${theme.details.name} (custom layout).json`
                                        )
                                    "
                                        >
                                            {{ $t("customLayout") }}
                                        </a>
                                    </template>
                                </template>
                            </i18n>
                        </div>
                        <div
                            v-if="
                                theme.layout &&
                                  theme.pieces &&
                                  theme.pieces.length > 0
                              "
                            class="font-weight-medium body-2"
                        >
                            <i18n path="item.customizations">
                                <template v-slot:value>
                                    <span class="font-weight-light">{{ optionsString(theme.pieces) }}</span>
                                </template>
                            </i18n>
                        </div>
                        <div
                            v-if="theme.bg_type"
                            class="font-weight-medium body-2"
                        >
                            <i18n path="item.background">
                                <template v-slot:value>
                                    <a :href="`${API_ENDPOINT}cdn/themes/${theme.id}/image.${theme.bg_type}`"
                                        class="font-weight-bold"
                                        target="_blank"
                                    >
                                        {{ theme.bg_type.toUpperCase() }}
                                    </a>
                                </template>
                            </i18n>

                        </div>
                        <div class="font-weight-medium body-2">
                            <i18n path="item.dlCount">
                                <template v-slot:value>
                                    <span class="font-weight-light">{{ theme.dl_count }}</span>
                                </template>
                            </i18n>
                        </div>

                        <ButtonDivider>
                            <DownloadButton
                                :download-function="downloadTheme"
                                :loading="loadingDownload"
                                :label="$t('item.downloadTheme')"
                            />
                        </ButtonDivider>

                        <ThemeInstaller :id="theme.id" type="theme"/>

                        <ButtonDivider/>

                        <div v-if="theme.pack">
                            <h3 style="position: relative;">
                                {{ $tc("pack") }}
                                <v-tooltip v-model="showPackInfo" top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            v-on="on"
                                            class="ml-1 pa-0 grey lighten-1"
                                            height="14"
                                            icon
                                            rounded
                                            style="position: absolute; top: 0; color: black;"
                                            width="14"
                                            @click="packDialog = true"
                                        >
                                            ?
                                        </v-btn>
                                    </template>
                                    <span>{{ $t("whatIs.this") }}</span>
                                </v-tooltip>
                            </h3>
                            <div class="subtitle-1">
                                {{ $t("themes.pack") }}
                            </div>
                            <nuxt-link
                                :to="
                                  `/packs/${createUrlString(
                                    theme.pack.id,
                                    theme.pack.details.name
                                  )}`
                                "
                                class="subtitle-1 font-weight-bold"
                            >
                                {{
                                    theme.pack.details.name + (theme.pack.categories.includes("NSFW") ? " (NSFW!)" : "")
                                }}
                            </nuxt-link>
                        </div>
                    </v-col>
                </v-row>
                <v-dialog v-model="packDialog" max-width="400">
                    <v-card>
                        <v-card-title class="headline">
                            {{ $t("whatIs.pack") }}
                        </v-card-title>

                        <v-card-text>
                            {{ $t("whatIs.packDescription") }}
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                                color="primary"
                                rounded

                                text
                                @click="packDialog = false"
                            >
                                {{ $t("close") }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-sheet>
        </LoadingOverlay>
    </v-container>
</template>

<script>
import Vue from "vue";
import shared from "@/layouts/details/SharedScript";
import targetParser from "@/components/mixins/targetParser";
import urlParser from "@/components/mixins/urlParser";
import {downloadTheme, theme} from "@/graphql/Theme.gql";

export default Vue.extend({
    components: {
        ThemeInstaller: () =>
            import("@/components/sections/ThemeInstaller.vue"),
        ButtonDivider: () => import("@/components/buttons/ButtonDivider.vue"),
        DownloadButton: () => import("@/components/buttons/DownloadButton.vue"),
        ReportButton: () => import("@/components/buttons/ReportButton.vue"),
        LikeButton: () => import("@/components/buttons/LikeButton.vue"),
        ShareButton: () => import("@/components/buttons/ShareButton.vue"),
        EditButton: () => import("@/components/buttons/EditButton.vue"),
        LoadingOverlay: () => import("@/components/LoadingOverlay.vue"),
    },
    mixins: [shared, targetParser, urlParser],
    data() {
        return {
            API_ENDPOINT: process.env.API_ENDPOINT,
            isPageOwner: false,
            showPackInfo: false,
            packDialog: false,
            loadingDownload: false,
        };
    },
    computed: {
        mayModerate() {
            return this.isPageOwner || this.$auth.user?.isAdmin;
        },
    },
    apollo: {
        theme: {
            query: theme,
            variables() {
                return {
                    id: this.id,
                };
            },
            result({data}) {
                if (data && data.theme) {
                    this.isPageOwner =
                        this.$auth.loggedIn &&
                        data.theme.creator.id === this.$auth.user.id;

                    this.updateUrlString(
                        data.theme.id,
                        data.theme.details.name,
                        this.fileNameToWebName(data.theme.target),
                    );
                }
            },
            prefetch: true,
        },
    },
    methods: {
        optionsString(usedPieces) {
            const values = [];
            if (usedPieces && usedPieces.length > 0) {
                usedPieces.forEach((piece) => {
                    if (piece.value.value === "true") {
                        values.push(piece.name);
                    } else {
                        values.push(`${piece.name}: ${piece.value.value}`);
                    }
                });
            }
            return values.join(", ");
        },
        downloadTheme() {
            this.loadingDownload = true;
            const usedPieces = [];

            if (this.theme.pieces) {
                for (let i = 0; i < this.theme.pieces.length; i++) {
                    usedPieces.push(this.theme.pieces[i].value.uuid);
                }
            }

            this.$apollo
                .mutate({
                    mutation: downloadTheme,
                    variables: {
                        id: this.theme.id,
                        piece_uuids: usedPieces.length > 0 ? usedPieces : null,
                    },
                })
                .then(({data}) => {
                    this.loadingDownload = false;

                    this.downloadFileUrl(
                        data.downloadTheme.url,
                        undefined,
                        data.downloadTheme.filename,
                    );
                })
                .catch((err) => {
                    this.$snackbar.error(err);
                    this.loadingDownload = false;
                });
        },
    },
    head() {
        if (this.theme) {
            const metaTitle = `${this.theme.details.name}${
                this.theme.categories.includes("NSFW") ? " (NSFW!)" : ""
            } | ${this.targetName()} | ${this.$tc("theme", 2)}`;
            const metaDesc = this.theme.details.description;
            const metaImg = !this.theme.categories.includes("NSFW")
                ? this.theme.preview.original
                : null;

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
        }
    },
});
</script>
