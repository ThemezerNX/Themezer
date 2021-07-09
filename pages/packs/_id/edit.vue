<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <LoadingOverlay :loading="!!$apollo.loading" :margin="false">
            <v-sheet v-if="pack" class="pa-2 box_fill" no-gutters>
                <h1 class="box_text">Edit Pack</h1>
                <h2 class="box_text mt-0">
                    <nuxt-link
                        :to="
							`/packs/${createUrlString(
								pack.id,
								pack.details.name
							)}`
						"
                        class="font-weight-bold"
                    >
                        {{ pack.details.name }}
                    </nuxt-link>
                </h2>

                <v-divider class="my-3 mx-2"/>

                <v-form
                    v-if="changed"
                    ref="submitForm"
                    v-model="submitValid"
                    class="box_text"
                >
                    <v-row class="ma-0">
                        <v-col class="pa-2" cols="12">
                            <v-text-field
                                v-model="changed.details.name"
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
                            ></v-text-field>
                            <v-text-field
                                v-model="changed.details.description"
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
                            ></v-text-field>
                            <v-text-field
                                v-model="changed.details.version"
                                :rules="[rules.required, rules.utf8_only]"
                                counter="10"
                                label="Pack version*"
                                maxlength="10"
                                outlined
                                prepend-icon="mdi-update"
                                rounded
                            ></v-text-field>

                            <ButtonDivider :margin="false">
                                <v-btn
                                    :disabled="!changes || loading.submit"
                                    color="red"
                                    rounded
                                    @click.prevent="discard()"
                                >
                                    Discard
                                    <v-icon right
                                    >mdi-delete-sweep-outline
                                    </v-icon>
                                </v-btn>
                                <v-btn
                                    :disabled="!submitValid || !changes"
                                    :loading="loading.submit"
                                    color="secondary"
                                    rounded
                                    type="submit"
                                    @click.prevent="submit()"
                                >
                                    Save
                                    <v-icon right>mdi-cube-send</v-icon>
                                </v-btn>
                            </ButtonDivider>
                        </v-col>
                    </v-row>
                </v-form>

                <h3 class="box_text">Themes in this pack:</h3>
                <h3 class="box_text subtitle-1 font-italic">
                    Click any to edit
                </h3>
                <v-list class="box_text" rounded>
                    <v-list-item
                        v-for="theme in pack.themes"
                        :key="theme.id"
                        :to="
                          `/themes/${fileNameToWebName(
                            theme.target
                          )}/${createUrlString(
                            theme.id,
                            theme.details.name
                          )}/edit`
                        "
                    >
                        <v-list-item-avatar height="auto" tile width="140">
                            <v-img
                                :src="theme.preview.thumb"
                                aspect-ratio="1.7778"
                                contain
                                style="border-radius: 10px;"
                            />
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title
                                v-text="theme.details.name"
                            ></v-list-item-title>
                            <v-list-item-subtitle>
                                Target:
                                {{ fileNameToNiceWebName(theme.target) }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <ButtonDivider>
                    <DeleteButton
                        :id="pack.id"
                        :query="deleteQuery"
                        return-url="/packs"
                        type="pack"
                    />
                </ButtonDivider>
            </v-sheet>
        </LoadingOverlay>
    </v-container>
</template>

<script>
import Vue from 'vue'
import rules from '~/assets/lang/rules'
import targetParser from '@/components/mixins/targetParser'
import {deletePack, pack, updatePack} from '@/graphql/Pack.gql'
import urlParser from '~/components/mixins/urlParser'

export default Vue.extend({
    beforeRouteEnter(_to, _from, next) {
        next((vm) => {
            if (vm.$auth.loggedIn) next()
            else next('/')
        })
    },
    components: {
        ButtonDivider: () => import('@/components/buttons/ButtonDivider.vue'),
        DeleteButton: () => import('@/components/buttons/DeleteButton.vue'),
        LoadingOverlay: () => import('@/components/LoadingOverlay.vue')
    },
    mixins: [urlParser, targetParser],
    data() {
        return {
            isPageOwner: true,
            loading: {
                submit: false
            },
            changed: null,

            deleteQuery: deletePack,
            submitValid: false,
            rules,
            uploadedScreenshot: null,
            uploadedScreenshotUrl: null
        }
    },
    computed: {
        changes() {
            return JSON.stringify(this.pack) !== JSON.stringify(this.changed)
        }
    },
    beforeRouteLeave(_to, _from, next) {
        if (!this.changes || window.confirm("Do you really want to leave? You have unsaved changes!")) {
            next();
        }
    },
    watch: {
        isPageOwner(n) {
            if (!n) {
                this.$router.push('/')
            }
        }
    },
    apollo: {
        pack: {
            query: pack,
            fetchPolicy: 'cache-and-network',
            variables() {
                return {
                    id: this.id
                }
            },
            result({data}) {
                if (data && data.pack) {
                    this.isPageOwner =
                        this.$auth.loggedIn &&
                        (data.pack.creator.id === this.$auth.user.id ||
                            this.$auth.user.isAdmin)

                    this.updateUrlString(
                        data.pack.id,
                        data.pack.details.name,
                        this.fileNameToWebName(data.pack.target)
                    )
                    this.changed = JSON.parse(JSON.stringify(data.pack))
                }
            },
            prefetch: true
        }
    },
    methods: {
        discard() {
            this.changed = JSON.parse(JSON.stringify(this.pack))
        },
        submit() {
            this.loading.submit = true

            this.$apollo
                .mutate({
                    mutation: updatePack,
                    variables: {
                        id: this.id,
                        name: this.changed.details.name,
                        description: this.changed.details.description,
                        version: this.changed.details.version
                    }
                })
                .then(({data}) => {
                    this.loading.submit = false
                    if (data && data.updatePack) {
                        this.$apollo.queries.pack.refetch()
                        this.$snackbar.message(
                            'Success! Changes might take some time to apply.'
                        )
                    }
                })
                .catch((err) => {
                    this.$snackbar.error(err)
                    this.loading.submit = false
                })
        }
    },
    head() {
        if (this.pack) {
            const metaTitle = `Edit | ${this.pack.details.name}${
                this.pack.themes.some((t) => t.categories?.includes('NSFW'))
                    ? ' (NSFW!)'
                    : ''
            } | Packs`
            const metaDesc = this.pack.details.description
            const metaImg = !this.pack.themes.some((t) =>
                t.categories?.includes('NSFW')
            )
                ? this.pack.themes[0].preview.original
                : null

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
@import 'assets/screenshot-upload.scss';

.v-menu__content {
    border-radius: 20px !important;
}
</style>
