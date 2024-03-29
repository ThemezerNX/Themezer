<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <LoadingOverlay :loading="!!$apollo.loading" :margin="false">
            <v-sheet v-if="pack && pack.details" class="pa-2 pb-0 box" no-gutters>
                <v-row class="ma-0">
                    <v-col
                        :sm="landscape ? 8 : 12"
                        class="pa-2"
                        cols="12"
                        md="9"
                        xs="12"
                    >
                        <v-carousel
                            class="overlay-image"
                            continuous
                            cycle
                            height="auto"
                            hide-delimiter-background
                            hide-delimiters
                        >
                            <v-carousel-item
                                v-for="(theme, i) in pack.themes"
                                :key="i"
                                :src="theme.preview.original"
                                aspect-ratio="1.7778"
                                height="auto"
                            >
                                <div class="theme-name subtitle-1">
                                    {{ theme.details.name }}
                                </div>
                            </v-carousel-item>
                        </v-carousel>
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
                            {{ pack.details.name }}
                        </h1>
                        <div class="subtitle-1">
                            <i18n path="item.author">
                                <template v-slot:creator>
                                    <nuxt-link
                                        :to="`/creators/${pack.creator.id}`"
                                        class="font-weight-bold"
                                    >
                                        {{ pack.creator.display_name }}
                                    </nuxt-link>
                                </template>
                            </i18n>
                        </div>
                        <div
                            v-if="pack.details.description"
                            v-linkified:options="{
								className: 'font-weight-medium'
							}"
                            class="font-weight-thin subtitle-1"
                            v-html="pack.details.description"
                        />

                        <div>
                            <v-chip
                                v-for="(category, i) in categories"
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
                                :id="pack.id"
                                :count="
                                  pack.like_count > 0
                                    ? pack.like_count
                                    : ($auth.loggedIn && $auth.user.liked.packs.some((p) => p.id === pack.id) ? 1 : 0)
                                "
                                :value="
                                  $auth.loggedIn &&
                                  $auth.user.liked.packs.some((p) => p.id === pack.id)
                                "
                                type="packs"
                            />
                            <ShareButton
                                :creator="pack.creator.display_name"
                                :name="pack.details.name"
                                type="pack"
                            />
                            <EditButton v-if="mayModerate" :label="$t('item.editPack')"/>
                            <ReportButton
                                v-if="!mayModerate"
                                :nsfw="
                                  pack.themes[0].categories.includes('NSFW')
                                "
                                type="pack"
                            />
                        </ButtonDivider>

                        <h3>
                            {{ $t("item.details") }}
                        </h3>
                        <div class="font-weight-medium body-2">
                            <i18n path="item.id">
                                <template v-slot:value>
                                    <span class="font-weight-light">{{ pack.id }}</span>
                                </template>
                            </i18n>
                        </div>
                        <div class="font-weight-medium body-2">
                            <i18n path="item.lastUpdated">
                                <template v-slot:value>
                                    <span class="font-weight-light">{{
                                            $d(new Date(pack.last_updated), "short")
                                        }}</span>
                                </template>
                            </i18n>
                        </div>
                        <div class="font-weight-medium body-2">
                            <i18n path="item.dlCount">
                                <template v-slot:value>
                                    <span class="font-weight-light">{{ pack.dl_count }}</span>
                                </template>
                            </i18n>
                        </div>

                        <ButtonDivider>
                            <DownloadButton
                                :download-function="downloadPack"
                                :loading="loadingDownload"
                                :label="$t('item.downloadPack')"
                            />
                        </ButtonDivider>

                        <ThemeInstaller :id="pack.id" type="pack"/>
                    </v-col>
                </v-row>
                <v-row class="ma-0">
                    <v-col
                        :class="$vuetify.breakpoint.smAndDown ? 'pa-0' : 'pa-2 pb-1'"
                    >
                        <h2 class="px-2">
                            {{ $t("packs.packContents") }}
                        </h2>
                        <v-divider/>
                        <ItemGrid
                            :items="pack.themes"
                            :show-props="['target']"
                            :loading="false"
                            type="themes"
                        />
                    </v-col>
                </v-row>
            </v-sheet>
        </LoadingOverlay>
    </v-container>
</template>

<script>
import Vue from "vue";
import shared from "@/layouts/details/SharedScript";
import targetParser from "@/components/mixins/targetParser";
import urlParser from "@/components/mixins/urlParser";
import {downloadPack, pack} from "@/graphql/Pack.gql";

export default Vue.extend({
    components: {
        ThemeInstaller: () =>
            import("@/components/sections/ThemeInstaller.vue"),
        ButtonDivider: () => import("@/components/buttons/ButtonDivider.vue"),
        DownloadButton: () => import("@/components/buttons/DownloadButton.vue"),
        ReportButton: () => import("@/components/buttons/ReportButton.vue"),
        LikeButton: () => import("@/components/buttons/LikeButton.vue"),
        ShareButton: () => import("@/components/buttons/ShareButton.vue"),
        ItemGrid: () => import("@/components/ItemGrid.vue"),
        EditButton: () => import("@/components/buttons/EditButton.vue"),
        LoadingOverlay: () => import("@/components/LoadingOverlay.vue"),
    },
    data() {
        return {
            prevRoute: null,
            isPageOwner: false,
            packDialog: false,
            loadingDownload: false,
            focusOnId: undefined,
        };
    },
    mixins: [shared, targetParser, urlParser],
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.prevRoute = from ? from.path : undefined;
        });
    },
    mounted() {
        const lastTheme = /-(.+)/.exec(this.prevRoute);
        this.focusOnId = lastTheme ? lastTheme[1] : undefined;
    },
    computed: {
        categories() {
            const c = [];
            for (const i in this.pack.themes) {
                if (this.pack.themes[i].categories)
                    c.concat(
                        this.pack.themes[i].categories.filter(
                            (item) => !c.includes(item),
                        ),
                    );
            }
            return c;
        },
        mayModerate() {
            return this.isPageOwner || this.$auth.user?.isAdmin;
        },
    },
    apollo: {
        pack: {
            query: pack,
            variables() {
                return {
                    id: this.id,
                };
            },
            result({data}) {
                if (data && data.pack) {
                    this.isPageOwner =
                        this.$auth.loggedIn &&
                        data.pack.creator.id === this.$auth.user.id;

                    this.updateUrlString(data.pack.id, data.pack.details.name);
                }
            },
            prefetch: true,
        },
    },
    methods: {
        downloadPack() {
            this.loadingDownload = true;

            this.$apollo
                .mutate({
                    mutation: downloadPack,
                    variables: {
                        id: this.pack.id,
                    },
                })
                .then(({data}) => {
                    this.loadingDownload = false;

                    this.downloadFileUrl(
                        data.downloadPack.url,
                        undefined,
                        data.downloadPack.filename,
                    );
                })
                .catch((err) => {
                    this.$snackbar.error(err);
                    this.loadingDownload = false;
                });
        },
    },
    head() {
        if (this.pack) {
            const metaTitle = `${this.pack.details.name}${
                this.pack.themes.some((t) => t.categories?.includes("NSFW"))
                    ? " (NSFW!)"
                    : ""
            } | ${this.$tc("pack", 2)}`;
            const metaDesc = this.pack.details.description;
            const metaImg = !this.pack.themes[0].categories.includes("NSFW")
                ? this.pack.themes[0].preview.original
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

<style lang="scss">
.overlay-image .theme-name {
    padding: 5px 10px;
    width: fit-content;
    border-bottom-right-radius: 20px;
    background-color: rgba(0, 0, 0, 0.4);

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}
</style>
