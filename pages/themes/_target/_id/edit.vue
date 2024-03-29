<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <LoadingOverlay :loading="!!$apollo.queries.theme.loading" :margin="false">
            <v-sheet v-if="theme" class="pa-2 box_fill" no-gutters>
                <h1 class="box_text">{{ $t("item.editTheme") }}</h1>
                <h2 class="box_text mt-0">
                    <nuxt-link
                        :to="
							`/themes/${fileNameToWebName(
								theme.target
							)}/${createUrlString(theme.id, theme.details.name)}`
						"
                        class="font-weight-bold"
                    >
                        {{ theme.details.name }}
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
                        <v-col class="pa-2" cols="12" sm="4" xs="12">
                            <v-hover v-slot:default="{ hover }">
                                <v-img
                                    :src="
										uploadedScreenshotUrl ||
											theme.preview.original
									"
                                    aspect-ratio="1.7778"
                                    class="placeholder display-3"
                                    contain
                                >
                                    <v-expand-transition>
                                        <v-file-input
                                            v-show="hover"
                                            v-model="uploadedScreenshot"
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
												onScreenshotChange($event, i)
											"
                                        />
                                    </v-expand-transition>
                                </v-img>
                            </v-hover>
                        </v-col>
                        <v-col class="pa-2" cols="12" sm="8" xs="12">
                            <v-text-field
                                v-model="changed.details.name"
                                :rules="[
									rules.required,
									rules.name_length,
									rules.utf8_only
								]"
                                counter="50"
                                :label="`${$t('fields.themeName')}*`"
                                maxlength="50"
                                minlength="3"
                                outlined
                                prepend-icon="mdi-pencil-outline"
                                rounded
                            ></v-text-field>
                            <v-text-field
                                v-model="changed.details.description"
                                :rules="[
                                  rules.description_length,
                                  rules.utf8_only
                                ]"
                                counter="500"
                                :label="$t('fields.themeDescription')"
                                maxlength="500"
                                minlength="10"
                                outlined
                                prepend-icon="mdi-pencil-outline"
                                rounded
                                @change="
									changed.details.description === ''
										? (changed.details.description = null)
										: null
								"
                            ></v-text-field>
                            <v-autocomplete
                                v-model="changed.layout.simple_id"
                                :hint="
									changed.pieces && changed.pieces.length > 0
										? `Options: ${optionsString(
												changed.pieces
										  )}`
										: !changed.layout.id
										? 'Replaces custom layout! IRREVERSIBLE!'
										: null
								"
                                :items="layouts[theme.target]"
                                :loading="!!$apollo.queries.layoutList.loading"
                                allow-overflow
                                auto-select-first
                                :label="$tc('layout')"
                                outlined
                                persistent-hint
                                prepend-icon="mdi-code-json"
                                rounded
                                @change="
									changed.pieces = []
									changed.layout.id = changed.layout.simple_id
								"
                                @mouseover.once="
									$apollo.queries.layoutList.skip = false
								"
                            >
                            </v-autocomplete>
                            <v-autocomplete
                                v-model="changed.pack.id"
                                :items="packList || []"
                                :loading="!!$apollo.queries.packList.loading"
                                allow-overflow
                                auto-select-first
                                clearable
                                :label="$tc('pack')"
                                outlined
                                persistent-hint
                                prepend-icon="mdi-package-variant-closed"
                                rounded
                                @mouseover.once="
                                  $apollo.queries.packList.skip = false
                                "
                            ></v-autocomplete>
                            <v-combobox
                                v-model="changed.actualCategories"
                                :items="
                                  categories && categories.length > 0
                                    ? categories.filter((c) => c !== 'NSFW')
                                    : []
                                "
                                :loading="!!$apollo.queries.categories.loading"
                                :rules="[
                                  rules.category_length,
                                  rules.max_category_amount,
                                  rules.utf8_only
                                ]"
                                allow-overflow
                                chips
                                deletable-chips
                                :label="`${$t('fields.categories')}* (${$t('fields.categoriesHint', {key_: '↵'})})`"
                                multiple
                                outlined
                                prepend-icon="mdi-shape-outline"
                                rounded
                                small-chips
                                @mouseover.once="
									$apollo.queries.categories.skip = false
								"
                            ></v-combobox>
                            <v-checkbox
                                v-model="changed.nsfw"
                                class="mt-0"
                                color="red"
                                label="NSFW"
                            />

                            <ButtonDivider :margin="false">
                                <v-btn
                                    :disabled="!changes || loading.submit"
                                    color="red"
                                    rounded
                                    @click.prevent="discard()"
                                >
                                    {{ $t("discard") }}
                                    <v-icon right>mdi-delete-sweep-outline</v-icon>
                                </v-btn>
                                <v-btn
                                    :disabled="!changes || !submitValid"
                                    :loading="loading.submit"
                                    color="secondary"
                                    rounded
                                    type="submit"
                                    @click.prevent="submit()"
                                >
                                    {{ $t("save") }}
                                    <v-icon right>mdi-cube-send</v-icon>
                                </v-btn>
                            </ButtonDivider>
                        </v-col>
                    </v-row>
                </v-form>
                <ButtonDivider>
                    <DeleteButton
                        :id="theme.id"
                        :go-back="
							!!(
								fromRoute &&
								fromRoute.name &&
								fromRoute.name.startsWith('packs')
							)
						"
                        :query="deleteQuery"
                        :return-url="`/themes/${this.$route.params.target}`"
                        type="theme"
                    />
                </ButtonDivider>
            </v-sheet>
        </LoadingOverlay>
    </v-container>
</template>

<script>
import Vue from "vue";
import rules from '@/components/mixins/rules'
import allLayoutsDropdown from "@/components/mixins/allLayoutsDropdown";
import allCategoriesDropdown from "@/components/mixins/allCategoriesDropdown";
import allPacksDropdown from "@/components/mixins/allPacksDropdown";
import targetParser from "@/components/mixins/targetParser";
import {deleteTheme, theme, updateTheme} from "@/graphql/Theme.gql";
import urlParser from "~/components/mixins/urlParser";
import optionsString from "@/components/mixins/optionsString";

export default Vue.extend({
    beforeRouteEnter(_to, from, next) {
        next((vm) => {
            vm.fromRoute = from;
            if (vm.$auth.loggedIn) next();
            else next("/");
        });
    },
    components: {
        ButtonDivider: () => import("@/components/buttons/ButtonDivider.vue"),
        DeleteButton: () => import("@/components/buttons/DeleteButton.vue"),
        LoadingOverlay: () => import("@/components/LoadingOverlay.vue"),
    },
    mixins: [
        urlParser,
        targetParser,
        allLayoutsDropdown,
        allCategoriesDropdown,
        allPacksDropdown,
        optionsString,
        rules,
    ],
    data() {
        return {
            fromRoute: null,
            isPageOwner: true,
            loading: {
                submit: false,
            },
            // required to make props reactive
            changed: {
                nsfw: null,
            },

            deleteQuery: deleteTheme,
            submitValid: false,
            uploadedScreenshot: null,
            uploadedScreenshotUrl: null,
        };
    },
    computed: {
        changes() {
            return (
                this.theme.details.name !== this.changed.details.name ||
                this.theme.details.description !== this.changed.details.description ||
                this.theme.nsfw !== this.changed.nsfw ||
                this.theme.pack?.id !== this.changed.pack.id ||
                (this.theme.layout?.id &&
                    this.theme.layout.id +
                    (this.theme.pieces?.length > 0
                        ? `|${this.theme.pieces
                            .map((p) => p.value.uuid)
                            .join(",")}`
                        : "") !==
                    this.changed.layout.id) ||
                (!this.theme.layout?.id && this.changed.layout.id) ||
                JSON.stringify(this.theme.actualCategories) !== JSON.stringify(this.changed.actualCategories) ||
                !!this.uploadedScreenshot
            );
        },
    },
    beforeRouteLeave(_to, _from, next) {
        next(vm =>
            !this.changes || window.confirm(vm.$t("unsavedChanged")),
        );
    },
    watch: {
        isPageOwner(n) {
            if (!n) {
                this.$router.push("/");
            }
        },
    },
    apollo: {
        theme: {
            query: theme,
            fetchPolicy: "cache-and-network",
            variables() {
                return {
                    id: this.id,
                };
            },
            result({data}) {
                if (data && data.theme) {
                    this.isPageOwner =
                        this.$auth.loggedIn &&
                        (data.theme.creator.id === this.$auth.user.id ||
                            this.$auth.user.isAdmin);

                    this.updateUrlString(
                        data.theme.id,
                        data.theme.details.name,
                        this.fileNameToWebName(data.theme.target),
                    );

                    this.currentThemeTarget = data.theme.target;
                    if (data.theme.layout)
                        this.$apollo.queries.layoutList.skip = false;
                    if (data.theme.pack)
                        this.$apollo.queries.packList.skip = false;

                    data.theme.nsfw = !!data.theme.categories?.includes("NSFW");
                    data.theme.actualCategories = data.theme.categories.filter(
                        (c) => c !== "NSFW",
                    );

                    this.changed = JSON.parse(JSON.stringify(data.theme));
                    if (!this.changed.pack) {
                        this.changed.pack = {};
                    }
                    if (!this.changed.layout) this.changed.layout = {};
                    else {
                        this.changed.layout.simple_id = this.changed.layout.id;
                        this.changed.layout.id =
                            this.changed.layout.id +
                            (this.changed.pieces?.length > 0
                                ? `|${this.changed.pieces
                                    .map((p) => p.value.uuid)
                                    .join(",")}`
                                : "");
                    }
                }
                return data;
            },
            prefetch: true,
        },
    },
    methods: {
        onScreenshotChange(file) {
            if (file) {
                this.uploadedScreenshotUrl = URL.createObjectURL(file);
            }
        },
        discard() {
            if (this.theme.categories?.includes("NSFW")) this.theme.nsfw = true;
            this.theme.actualCategories = this.theme.categories.filter(
                (c) => c !== "NSFW",
            );
            this.changed = JSON.parse(JSON.stringify(this.theme));
            if (!this.changed.layout) this.changed.layout = {};
            else {
                this.changed.layout.simple_id = this.changed.layout.id;
                this.changed.layout.id =
                    this.changed.layout.id +
                    (this.changed.pieces?.length > 0
                        ? `|${this.changed.pieces
                            .map((p) => p.value.uuid)
                            .join(",")}`
                        : "");
            }
            if (!this.changed.pack) {
                this.changed.pack = {};
            }

            this.uploadedScreenshot = null;
            this.uploadedScreenshotUrl = null;
        },
        submit() {
            this.loading.submit = true;

            this.$apollo
                .mutate({
                    mutation: updateTheme,
                    variables: {
                        id: this.id,
                        file: this.uploadedScreenshot,
                        name: this.changed.details.name,
                        layout_id: this.changed.layout.id,
                        pack_id: this.changed.pack.id,
                        description: this.changed.details.description,
                        categories: this.changed.actualCategories,
                        nsfw: this.changed.nsfw,
                    },
                })
                .then(({data}) => {
                    this.loading.submit = false;
                    if (data && data.updateTheme) {
                        this.uploadedScreenshot = null;
                        this.$apollo.queries.theme.refetch();
                        this.$snackbar.message(
                            this.$t("saveSuccess"),
                        );
                    }
                })
                .catch((err) => {
                    this.$snackbar.error(err);
                    this.loading.submit = false;
                });
        },
    },
    head() {
        if (this.theme) {
            const metaTitle = `${this.$t("item.edit")} | ${this.theme.details.name}${
                this.theme.nsfw ? " (NSFW!)" : ""
            } | ${this.targetName()} | ${this.$tc("theme", 2)}`;
            const metaDesc = this.theme.details.description;
            const metaImg = !this.theme.nsfw ? this.theme.preview.original : null;

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
@import 'assets/screenshot-upload.scss';

.v-menu__content {
    border-radius: 20px !important;
}
</style>
