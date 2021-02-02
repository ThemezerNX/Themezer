<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <LoadingOverlay :loading="!!$apollo.loading">
            <v-sheet v-if="pack && pack.details" class="pa-2 box" no-gutters>
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
                            By
                            <nuxt-link
                                :to="`/creators/${pack.creator.id}`"
                                class="font-weight-bold"
                            >
                                {{ pack.creator.display_name }}
                            </nuxt-link>
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
                                v-if="$auth.loggedIn"
                                :id="pack.id"
                                :count="
									pack.like_count > 0
										? pack.like_count
										: $auth.user.liked.packs
												.map((p) => p.id)
												.includes(pack.id)
										? 1
										: 0
								"
                                :value="
									$auth.user.liked.packs
										.map((p) => p.id)
										.includes(pack.id)
								"
                                type="packs"
                            />
                            <ShareButton
                                :creator="pack.creator.display_name"
                                :name="pack.details.name"
                                type="pack"
                            />
                            <EditButton v-if="mayModerate" type="pack"/>
                            <ReportButton
                                v-if="!mayModerate"
                                :nsfw="
									pack.themes[0].categories.includes('NSFW')
								"
                                type="pack"
                            />
                        </ButtonDivider>

                        <h3>
                            Details
                        </h3>
                        <div class="font-weight-light body-2">
                            <span class="font-weight-medium">ID: </span>
                            {{ pack.id }}
                        </div>
                        <div class="font-weight-light body-2">
                            <span class="font-weight-medium">Version: </span>
                            {{ pack.details.version }}
                        </div>
                        <div class="font-weight-light body-2">
							<span class="font-weight-medium"
              >Last Updated:</span
              >
                            {{ niceDate(pack.last_updated) }}
                        </div>
                        <div class="font-weight-light body-2">
                            <span class="font-weight-medium">Downloads: </span>
                            {{ pack.dl_count }}
                        </div>

                        <ButtonDivider>
                            <DownloadButton
                                :download-function="downloadPack"
                                :loading="loadingDownload"
                                tooltip="Download pack"
                            />
                        </ButtonDivider>

                        <ThemeInstaller :id="pack.id" type="pack"/>

                        <ButtonDivider/>
                    </v-col>
                </v-row>
                <v-row class="ma-0">
                    <v-col
                        :class="
							$vuetify.breakpoint.smAndDown ? 'px-0 py-2' : 'pa-2'
						"
                    >
                        <h2 class="px-2">
                            Themes in this Pack
                        </h2>
                        <v-divider/>
                        <ThemesSlideGroup
                            :items="pack.themes"
                            :show-props="['target']"
                        />
                    </v-col>
                </v-row>
            </v-sheet>
        </LoadingOverlay>
    </v-container>
</template>

<script>
import Vue from 'vue'
import shared from '@/layouts/details/SharedScript'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '@/components/mixins/urlParser'
import {downloadPack, pack} from '@/graphql/Pack.gql'

export default Vue.extend({
    components: {
        ThemeInstaller: () =>
            import('@/components/sections/ThemeInstaller.vue'),
        ButtonDivider: () => import('@/components/buttons/ButtonDivider.vue'),
        DownloadButton: () => import('@/components/buttons/DownloadButton.vue'),
        ReportButton: () => import('@/components/buttons/ReportButton.vue'),
        LikeButton: () => import('@/components/buttons/LikeButton.vue'),
        ShareButton: () => import('@/components/buttons/ShareButton.vue'),
        ThemesSlideGroup: () => import('@/components/ThemesSlideGroup.vue'),
        EditButton: () => import('@/components/buttons/EditButton.vue'),
        LoadingOverlay: () => import('@/components/LoadingOverlay.vue')
    },
    mixins: [shared, targetParser, urlParser],
    data() {
        return {
            isPageOwner: false,
            packDialog: false,
            loadingDownload: false
        }
    },
    computed: {
        backgroundStyle() {
            return ''
            // if (this.pack.details.color) {
            // 	return `background: ${this.pack.details.color};`
            // } else {
            // 	return `background: #e2e2e2;`
            // }
        },
        categories() {
            const c = []
            for (const i in this.pack.themes) {
                if (this.pack.themes[i].categories)
                    c.concat(
                        this.pack.themes[i].categories.filter(
                            (item) => !c.includes(item)
                        )
                    )
            }
            return c
        },
        mayModerate() {
            return this.isPageOwner || this.$auth.user?.isAdmin
        }
    },
    apollo: {
        pack: {
            query: pack,
            variables() {
                return {
                    id: this.id
                }
            },
            result({data}) {
                if (data && data.pack) {
                    this.isPageOwner =
                        this.$auth.loggedIn &&
                        data.pack.creator.id === this.$auth.user.id

                    this.updateUrlString(data.pack.id, data.pack.details.name)
                }
            },
            prefetch: true
        }
    },
    methods: {
        downloadPack() {
            this.loadingDownload = true

            this.$apollo
                .mutate({
                    mutation: downloadPack,
                    variables: {
                        id: this.pack.id
                    }
                })
                .then(({data}) => {
                    this.loadingDownload = false

                    this.downloadFileUrl(
                        data.downloadPack.url,
                        undefined,
                        data.downloadPack.filename
                    )
                })
                .catch((err) => {
                    this.$snackbar.error(err)
                    this.loadingDownload = false
                })
        }
    },
    head() {
        if (this.pack) {
            const metaTitle = `${this.pack.details.name}${
                this.pack.themes.some((t) => t.categories?.includes('NSFW'))
                    ? ' (NSFW!)'
                    : ''
            } | Packs`
            const metaDesc = this.pack.details.description
            const metaImg = !this.pack.themes[0].categories.includes('NSFW')
                ? this.pack.themes[0].preview.original
                : null

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

<style lang="scss">
.overlay-image .theme-name {
    padding: 5px 10px;
    width: fit-content;
    border-radius: 0 0 10px 0;
    background-color: rgba(0, 0, 0, 0.4);

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}
</style>
