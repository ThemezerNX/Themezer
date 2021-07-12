<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <LoadingOverlay :loading="!!$apollo.loading" :margin="false">
            <v-sheet
                v-if="layout && layout.has_pieces"
                class="pa-2 box_fill"
                no-gutters
            >
                <h1 class="box_text">{{ $t("item.customizeType", {type: $tc("layout")}) }}</h1>
                <h2 class="box_text mt-0">
                    <nuxt-link
                        :to="
							`/layouts/${$route.params.target}/${createUrlString(
								layout.id,
								layout.details.name
							)}`
						"
                        class="font-weight-bold"
                    >
                        {{ layout.details.name }}
                    </nuxt-link>
                </h2>
                <div class="subtitle-1 box_text">
                    <i18n path="item.author">
                        <template v-slot:creator>
                            <nuxt-link
                                :to="`/creators/${layout.creator.id}`"
                                class="font-weight-bold"
                            >
                                {{ layout.creator.display_name }}
                            </nuxt-link>
                        </template>
                    </i18n>
                </div>

                <v-divider class="my-3 mx-2"/>

                <v-row class="ma-0">
                    <v-col
                        class="pa-2"
                        cols="12"
                        sm="4"
                        style="position: relative;"
                        xs="12"
                    >
                        <v-img
                            :src="
								preview ||
									`${API_ENDPOINT}cdn/layouts/${layout.uuid}/overlay.png`
							"
                            :style="backgroundStyle"
                            aspect-ratio="1.7778"
                            class="overlay-image"
                            cover
                            style="background-size: cover;"
                        />
                    </v-col>
                    <v-col
                        v-show="restoredActivePieces"
                        class="pa-2"
                        cols="12"
                        sm="8"
                        xs="12"
                    >
                        <v-list
                            class="my-3"
                            flat
                            style="background: rgba(255,255,255,0.12); border-radius: 20px;"
                            subheader
                        >
                            <v-subheader>{{ $tc("item.layoutOption", 2) }}</v-subheader>
                            <div
                                v-for="(piece, i) in layout.pieces"
                                :key="piece.name"
                            >
                                <v-list-item v-if="piece.values.length === 1">
                                    <v-list-item-content
                                        class="pa-0"
                                        style="overflow: visible;"
                                    >
                                        <v-col
                                            class="pa-0"
                                            cols="12"
                                            lg="8"
                                            md="8"
                                            sm="6"
                                            xl="10"
                                        >
                                            <v-list-item-title
                                                style="white-space: inherit;"
                                            >
                                                {{ piece.name }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                {{ piece.description }}
                                            </v-list-item-subtitle>
                                        </v-col>
                                        <v-col
                                            class="pa-0 d-flex"
                                            cols="12"
                                            lg="4"
                                            md="4"
                                            sm="6"
                                            style="position: relative;"
                                            xl="2"
                                        >
                                            <v-checkbox
                                                v-model="data[i]"
                                                :input-value="data[i]"
                                                class="ma-0 pa-0 d-flex align-self-center"
                                                hide-details
                                                style="position: absolute; right: 0;"
                                                width="auto"
                                                @change="
													valueChange(
														$event,
														piece.values
													)
													setPreview(
														piece,
														piece.values[0],
														data[i]
													)
												"
                                            ></v-checkbox>
                                        </v-col>
                                    </v-list-item-content>
                                </v-list-item>

                                <v-list-item
                                    v-else-if="piece.values.length > 0"
                                >
                                    <v-list-item-content class="pa-0">
                                        <v-col
                                            class="pa-0"
                                            cols="12"
                                            lg="8"
                                            md="8"
                                            sm="6"
                                            xl="10"
                                        >
                                            <v-list-item-title
                                                style="white-space: inherit;"
                                            >
                                                {{ piece.name }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle
                                                style="-webkit-line-clamp: unset;"
                                            >
                                                {{ piece.description }}
                                            </v-list-item-subtitle>
                                        </v-col>
                                        <v-col
                                            class="pa-0"
                                            cols="12"
                                            lg="4"
                                            md="4"
                                            sm="6"
                                            xl="2"
                                        >
                                            <v-select
                                                v-model="data[i]"
                                                :input-value="data[i]"
                                                :items="
													dropdownKeys(piece.values)
												"
                                                :menu-props="{ offsetY: true }"
                                                class="soloSelectGrey"
                                                hide-details
                                                label="Default"
                                                rounded
                                                solo
                                                @change="
													valueChange(
														data[i],
														piece.values
													)
													setPreview(
														piece,
														piece.values.find(
															(v) =>
																v.value ===
																data[i]
														),
														data[i]
													)
												"
                                            ></v-select>
                                        </v-col>
                                    </v-list-item-content>
                                </v-list-item>
                            </div>
                        </v-list>
                        <ButtonDivider>
                            <DownloadButton
                                :download-function="download"
                                :loading="loadingMerge"
                                type="layout"
                            />
                            <ShareButton
                                :creator="layout.creator.display_name"
                                :name="layout.details.name"
                                :tooltip="$t('permalink')"
                                type="layout"
                            />
                        </ButtonDivider>
                    </v-col>
                </v-row>
            </v-sheet>
        </LoadingOverlay>
    </v-container>
</template>

<script>
import Vue from 'vue'
import {downloadLayout, layout} from '@/graphql/Layout.gql'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '~/components/mixins/urlParser'

export default Vue.extend({
    beforeRouteEnter(to, _from, next) {
        if (to.params.id) {
            next()
        } else {
            next('/')
        }
    },
    components: {
        ButtonDivider: () => import('@/components/buttons/ButtonDivider.vue'),
        DownloadButton: () => import('@/components/buttons/DownloadButton.vue'),
        ShareButton: () => import('@/components/buttons/ShareButton.vue'),
        LoadingOverlay: () => import('@/components/LoadingOverlay.vue')
    },
    mixins: [urlParser, targetParser],
    data() {
        return {
            API_ENDPOINT: process.env.API_ENDPOINT,
            data: [],
            preview: null,
            loadingMerge: false,
            activePieces: [],
            restoredActivePieces: false
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
        activePiecesComputed() {
            return this.activePieces
        }
    },
    watch: {
        activePiecesComputed(n) {
            this.$router
                .replace({
                    query: {pieces: n.length > 0 ? n.join() : undefined}
                }) // Don't throw 'redundant navigation'
                .catch(() => {
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

                    if (this.$route.query.pieces) {
                        this.activePieces = this.$route.query.pieces
                            .toLowerCase()
                            .split(',')
                            .filter((uuid) =>
                                data.layout.pieces.some((p) =>
                                    p.values.some((v) => v.uuid === uuid)
                                )
                            )

                        if (this.activePieces.length > 0) {
                            this.activePieces.forEach((aP) => {
                                let index
                                let value
                                for (
                                    let i = 0;
                                    i < data.layout.pieces.length;
                                    i++
                                ) {
                                    data.layout.pieces[i].values.find((v) => {
                                        if (v.uuid === aP) {
                                            index = i
                                            if (
                                                data.layout.pieces[i].values
                                                    .length > 1
                                            ) {
                                                // Dropdown
                                                value = v.value
                                            } else {
                                                // Checkbox
                                                value = true
                                            }
                                            return true
                                        }
                                    })
                                }

                                // noinspection JSUnusedAssignment
                                this.$data.data[index] = value
                            })
                        }
                    }
                    this.restoredActivePieces = true
                }
            },
            prefetch: true
        }
    },
    methods: {
        dropdownKeys(items) {
            const values = items.map((item) => item.value)
            values.unshift('Default')
            return values
        },
        setPreview(option, value, data) {
            if (data && data !== 'Default') {
                if (value.image) {
                    this.preview = encodeURI(
                        `${process.env.API_ENDPOINT}cdn/layouts/${this.layout.uuid}/pieces/${option.name}/${value.image}`
                    )
                }
            } else this.preview = null
        },
        valueChange(value, pieces) {
            if (value === true) {
                // Checkbox
                this.activePieces.push(pieces[0].uuid)
            } else if (value === false) {
                // Unchecked checkbox
                this.activePieces = this.activePieces.filter(
                    (u) => u !== pieces[0].uuid
                )
            } else if (typeof value === 'string') {
                // Dropdown
                const newPiece = pieces.find((v) => v.value === value)
                const removePieces = pieces
                    .filter((v) => v.value !== value)
                    .map((v) => v.uuid)

                this.activePieces = this.activePieces.filter(
                    (uuid) => !removePieces.includes(uuid)
                )

                if (newPiece) {
                    // If not 'Default'
                    this.activePieces.push(newPiece.uuid)
                }
            }
        },
        combineLayouts() {
            const usedPieces = []

            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i] === true) {
                    // Checkbox
                    usedPieces.push(this.layout.pieces[i].values[0].uuid)
                } else if (
                    typeof this.data[i] === 'string' &&
                    this.data[i] !== 'Default'
                ) {
                    // Dropdown
                    const selected = this.layout.pieces[i].values.find(
                        (v) => v.value === this.data[i]
                    )
                    usedPieces.push(selected.uuid)
                }
            }

            this.loadingMerge = true
            this.$apollo
                .mutate({
                    mutation: downloadLayout,
                    variables: {
                        id: this.layout.id,
                        piece_uuids: usedPieces
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
        download() {
            this.combineLayouts(
                this.layout.baselayout,
                this.layout.details.name
            )
        }
    },
    head() {
        if (this.layout) {
            const metaTitle = `${
                this.layout.details.name
            } | ${this.targetName()} | Layouts`
            const metaDesc = this.layout.details.description
            const metaImg = `${process.env.API_ENDPOINT}cdn/layouts/${this.layout.uuid}/overlay.png`

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
    }
})
</script>

<style lang="scss">
.v-menu__content {
    border-radius: 20px !important;
}
</style>
