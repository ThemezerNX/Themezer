<template>
    <LoadingOverlay :loading="!!$apollo.loading" :margin="false">
        <div v-if="creator && id === creator.id">
            <v-parallax
                :src="
                  creator.banner_image
                    ? `${API_ENDPOINT}cdn/creators/${creator.id}/banner/${creator.banner_image}`
                    : ''
                "
                class="d-flex align-center justify-center parallax"
                style="margin-top: -20px;"
            >
                <v-row
                    align="center"
                    class="profile d-flex pt-6 pb-4"
                    justify="center"
                >
                    <v-col class="text-center" cols="12">
                        <v-img
                            v-if="creator.logo_image"
                            :src="
								`${API_ENDPOINT}cdn/creators/${creator.id}/logo/${creator.logo_image}`
							"
                            :width="$vuetify.breakpoint.smAndDown ? 200 : 300"
                            class="ma-auto"
                            contain
                            max-height="50vh"
                            max-width="100%"
                        >
                        </v-img>
                        <v-avatar
                            v-else
                            :size="$vuetify.breakpoint.smAndDown ? 150 : 200"
                            class="avatar"
                        >
                            <img
                                v-if="avatar"
                                :src="
									`https://cdn.discordapp.com/${avatar}?size=256`
								"
                                alt="Creator Avatar"
                            />
                        </v-avatar>
                    </v-col>
                    <v-col class="text-center" cols="12">
                        <h1 class="font-weight-regular discord-name py-1 px-4">
                            <v-avatar
                                v-if="
									creator.logo_image &&
										creator.roles &&
										!creator.roles.includes('system')
								"
                                :size="$vuetify.breakpoint.smAndDown ? 32 : 48"
                                class="avatar"
                            >
                                <img
                                    :src="
										`https://cdn.discordapp.com/${avatar}?size=64`
									"
                                    alt="Creator Avatar"
                                />
                            </v-avatar>

                            {{
                                creator.display_name
                            }}{{
                                !!creator.custom_username
                                    ? ""
                                    : `#${creator.discord_user.discriminator}`
                            }}

                            <template v-if="creator.roles">
                                <v-tooltip
                                    v-for="(role, i) in creator.roles"
                                    :key="role"
                                    top
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                            v-bind="attrs"
                                            v-on="on"
                                            :class="{
                                                'mr-1':
                                                  i !==
                                                  creator.roles.length - 1
                                              }"
                                            class="mt-n1"
                                        >
                                            {{ roleIcon(role.split("|")[0]) }}
                                        </v-icon>
                                    </template>
                                    <span class="text-capitalize">
                                        {{ roleName(role) }}
                                    </span>
                                </v-tooltip>
                            </template>
                        </h1>
                    </v-col>
                    <v-col class="text-center" cols="12">
                        <ButtonDivider :hide-dividers="true">
                            <v-tooltip top v-if="mayModerate">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        v-bind="attrs"
                                        v-on="on"
                                        append
                                        class="button"
                                        color="blue darken-1"
                                        dark
                                        rounded
                                        @click="editDialog = true"
                                    >
                                        {{ $t('item.edit') }}
                                        <v-icon right>{{ "mdi-shield-edit" }}</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('item.editProfile') }}</span>
                            </v-tooltip>
                            <LikeButton
                                :id="creator.id"
                                :count="
                                  creator.like_count > 0
                                    ? creator.like_count
                                    : ($auth.loggedIn && $auth.user.liked.creators.some((c) => c.id === creator.id) ? 1 : 0)
                                "
                                :value="
                                    $auth.loggedIn && $auth.user.liked.creators.some((c) => c.id === creator.id)
                                "
                                type="creators"
                            />
                            <ShareButton
                                :name="creator.display_name"
                                type="creator"
                            />
                            <ReportButton v-if="!mayModerate" type="creator"/>
                        </ButtonDivider>
                    </v-col>
                </v-row>
            </v-parallax>
            <v-container
                class="pt-0 px-0"
                :fluid="$vuetify.breakpoint.smAndDown"
                style="height: 100%;"
            >
                <v-row align="center" justify="center" class="ma-0">
                    <v-col class="pt-0"
                           cols="12"
                           xl="9"
                           lg="9"
                           md="9"
                           sm="12"
                           xs="12"
                    >
                        <v-sheet v-if="creator.bio" class="markdown-wrapper" elevation="12">
                            <Markdown :source="creator.bio" class="markdown"/>
                        </v-sheet>

                        <p class="ma-2" v-else>{{ $t("creators.noBiography") }}</p>
                    </v-col>
                </v-row>
            </v-container>

            <v-container
                class="pt-0"
                :fluid="$vuetify.breakpoint.smAndDown"
                style="height: 100%;"
            >
                <v-row
                    v-if="packList && packList.length > 0"
                    align="center"
                    justify="center"
                >
                    <v-col class="pt-0"
                           cols="12"
                           xl="9"
                           lg="9"
                           md="9"
                           sm="12"
                           xs="12"
                    >
                        <h1>
                            {{ $t("creators.latestPacksByCreator") }}
                        </h1>
                        <v-divider/>
                        <ItemGrid
                            :loading="!!$apollo.queries.packList.loading"
                            :items="packList"
                            :limit="4"
                            :more-url="
								`/packs?sort=updated&order=desc&creators=${creator.id}`
							"
                            type="packs"
                        />
                    </v-col>
                </v-row>
                <v-row
                    v-if="themeList && themeList.length > 0"
                    align="center"
                    justify="center"
                >
                    <v-col class="pt-0"
                           cols="12"
                           xl="9"
                           lg="9"
                           md="9"
                           sm="12"
                           xs="12"
                    >
                        <h1>
                            {{ $t("creators.latestThemesByCreator") }}
                        </h1>
                        <v-divider/>
                        <ItemGrid
                            :loading="!!$apollo.queries.themeList.loading"
                            :items="themeList"
                            :limit="4"
                            :more-url="
								`/themes?sort=updated&order=desc&creators=${creator.id}`
							"
                            type="themes"
                        />
                    </v-col>
                </v-row>
                <v-row
                    v-if="layoutList && layoutList.length > 0"
                    align="center"
                    justify="center"
                >
                    <v-col class="pt-0"
                           cols="12"
                           xl="9"
                           lg="9"
                           md="9"
                           sm="12"
                           xs="12"
                    >
                        <h1>
                            {{ $t("creators.latestLayoutsByCreator") }}
                        </h1>
                        <v-divider/>
                        <ItemGrid
                            :loading="!!$apollo.queries.layoutList.loading"
                            :items="layoutList"
                            :limit="4"
                            :more-url="
								`/layouts?sort=updated&order=desc&creators=${creator.id}`
							"
                            type="layouts"
                        />
                    </v-col>
                </v-row>
            </v-container>

            <v-dialog v-model="editDialog" class="mx-auto" max-width="800">
                <v-form v-model="submitValid">
                    <v-card>
                        <v-card-title
                            class="title font-weight-regular justify-space-between"
                        >
                            <span>{{ $t("item.editProfile") }}</span>
                            <v-spacer></v-spacer>

                            <v-btn icon rounded @click="editDialog = false">
                                <v-icon>
                                    mdi-close
                                </v-icon>
                            </v-btn>
                        </v-card-title>

                        <v-card-text>
                            <v-checkbox
                                v-if="
									!isPageOwner && $auth.user && $auth.user.isAdmin
								"
                                v-model="changed.isBlocked"
                                class="mt-0"
                                color="red"
                                :label="$t('creators.blockUser')"
                            />
                            <v-text-field
                                v-model="changed.customUsername"
                                :disabled="loading.submit"
                                :rules="[rules.utf8_only]"
                                class="pt-1"
                                counter="50"
                                :label="$t('creators.customName')"
                                maxlength="50"
                                outlined
                                prepend-icon="mdi-pencil"
                                rounded
                                @change="
									changed.customUsername === ''
										? (changed.customUsername = null)
										: null
								"
                            ></v-text-field>
                            <v-textarea
                                v-model="changed.bio"
                                :disabled="loading.submit"
                                auto-grow
                                class="pt-1"
                                counter="1000"
                                :label="$t('creators.bio')"
                                maxlength="1000"
                                outlined
                                prepend-icon="mdi-bio"
                                rounded
                                @change="
									changed.bio === ''
										? (changed.bio = null)
										: null
								"
                            ></v-textarea>
                            <span class="caption grey--text text--darken-1">
								{{ $t("creators.profileColorNote") }}
							</span>
                            <v-text-field
                                v-model="changed.profileColor"
                                :color="changed.profileColor"
                                :disabled="loading.submit"
                                :rules="[rules.hex]"
                                class="pt-2"
                                :label="$t('creators.profileColor')"
                                maxlength="7"
                                outlined
                                prepend-icon="mdi-format-color-fill"
                                rounded
                                @change="
									changed.profileColor === ''
										? (changed.profileColor = null)
										: null
								"
                            ></v-text-field>
                            <v-file-input
                                v-model="changed.bannerImage"
                                :disabled="
									changed.clearBannerImage || loading.submit
								"
                                :rules="[rules.banner_size]"
                                accept="image/*"
                                :label="$t('creators.banner', {size: '1920×800'})"
                                outlined
                                prepend-icon="mdi-image-area"
                                rounded
                            />
                            <v-flex class="d-flex mt-n4 mb-2">
                                <v-spacer/>
                                <v-btn
                                    :disabled="
										!creator.banner_image ||
											changed.clearBannerImage ||
											changed.bannerImage ||
											loading.submit
									"
                                    color="red"
                                    rounded
                                    text
                                    @click.prevent="
										changed.clearBannerImage = true
									"
                                >
                                    {{ $t("creators.bannerClear") }}
                                    <v-icon right>mdi-delete-outline</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-file-input
                                v-model="changed.logoImage"
                                :disabled="
									changed.clearLogoImage || loading.submit
								"
                                :rules="[rules.logo_size]"
                                accept="image/*"
                                :label="$t('creators.logo')"
                                outlined
                                prepend-icon="mdi-image"
                                rounded
                            />
                            <v-flex class="d-flex mt-n4 mb-2">
                                <v-spacer/>
                                <v-btn
                                    :disabled="
										!creator.logo_image ||
											changed.clearLogoImage ||
											changed.logoImage ||
											loading.submit
									"
                                    color="red"
                                    rounded
                                    text
                                    @click.prevent="
										changed.clearLogoImage = true
									"
                                >
                                    {{ $t("creators.logoClear") }}
                                    <v-icon right>mdi-delete-outline</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex class="d-flex">
                                <v-btn
                                    :disabled="!changes || loading.submit"
                                    color="red"
                                    rounded
                                    @click.prevent="discard()"
                                >
                                    {{ $t("discard") }}
                                    <v-icon right
                                    >mdi-delete-sweep-outline
                                    </v-icon>
                                </v-btn>
                                <v-spacer/>
                                <v-btn
                                    :disabled="!submitValid || !changes"
                                    :loading="loading.submit"
                                    color="secondary"
                                    rounded
                                    type="submit"
                                    @click.prevent="submit()"
                                >
                                    {{ $t("save") }}
                                    <v-icon right>mdi-cube-send</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-card-text>
                    </v-card>
                </v-form>
            </v-dialog>
        </div>
    </LoadingOverlay>
</template>

<script>
import Vue from "vue";
import rules from '@/components/mixins/rules'
import {creator, me, updateProfile} from "@/graphql/Creator.gql";
import {rowPackList} from "@/graphql/Pack.gql";
import {rowThemeList} from "@/graphql/Theme.gql";
import {rowLayoutList} from "@/graphql/Layout.gql";

const removeMd = require("remove-markdown");

export default Vue.extend({
    components: {
        ButtonDivider: () => import("@/components/buttons/ButtonDivider.vue"),
        ReportButton: () => import("@/components/buttons/ReportButton.vue"),
        LikeButton: () => import("@/components/buttons/LikeButton.vue"),
        ShareButton: () => import("@/components/buttons/ShareButton.vue"),
        Markdown: () => import("@/components/Markdown.vue"),
        ItemGrid: () => import("@/components/ItemGrid.vue"),
        LoadingOverlay: () => import("@/components/LoadingOverlay.vue"),
        EditButton: () => import("@/components/buttons/EditButton.vue"),
    },
    mixins: [rules],
    data() {
        return {
            API_ENDPOINT: process.env.API_ENDPOINT,
            id: this.$route.params.id,
            isPageOwner:
                this.$auth.loggedIn &&
                this.$route.params.id === this.$auth.user.id,
            editDialog: false,
            submitValid: false,
            loading: {
                submit: false,
            },

            changed: {
                profileColor: null,
                customUsername: null,
                bio: null,
                bannerImage: null,
                logoImage: null,
                clearBannerImage: false,
                clearLogoImage: false,
                isBlocked: null,
            },

            avatar: null,
        };
    },
    computed: {
        changes() {
            return !(
                this.creator.profile_color === this.changed.profileColor &&
                this.creator.custom_username === this.changed.customUsername &&
                this.creator.bio === this.changed.bio &&
                !this.changed.bannerImage &&
                !this.changed.logoImage &&
                !this.changed.clearBannerImage &&
                !this.changed.clearLogoImage &&
                this.creator.is_blocked === this.changed.isBlocked
            );
        },
        mayModerate() {
            return this.isPageOwner || this.$auth.user?.isAdmin;
        },
    },
    apollo: {
        creator: {
            query() {
                return this.$data.isPageOwner ? me : creator;
            },
            variables() {
                return {
                    id: this.id,
                };
            },
            update(res) {
                if (this.$data.isPageOwner) {
                    return res?.me;
                } else {
                    return res?.creator;
                }
            },
            prefetch: true,
        },
        packList: {
            query: rowPackList,
            variables() {
                return {
                    creators: [this.id],
                    limit: 4,
                };
            },
            prefetch: true,
        },
        themeList: {
            query: rowThemeList,
            variables() {
                return {
                    creators: [this.id],
                    limit: 4,
                };
            },
            prefetch: true,
        },
        layoutList: {
            query: rowLayoutList,
            variables() {
                return {
                    creators: [this.id],
                    limit: 4,
                };
            },
            prefetch: true,
        },
    },
    watch: {
        creator(creator) {
            if (creator) {
                if (creator.old_ids && creator.old_ids.includes(this.id)) {
                    // Sort of redirect, needs proper HTML 301 (moved permanently)
                    this.$router.push(`/creators/${creator.id}`);
                } else {
                    this.$store.commit(
                        "SET_PROFILE_COLOR",
                        creator.profile_color,
                    );

                    this.changed.profileColor = creator.profile_color;
                    this.changed.customUsername = creator.custom_username;
                    this.changed.bio = creator.bio;
                    this.changed.isBlocked = creator.is_blocked;

                    if (creator.discord_user.avatar) {
                        this.avatar = `avatars/${creator.id}/${creator.discord_user.avatar}`;
                    } else {
                        this.avatar = `embed/avatars/${parseInt(
                            creator.discord_user.discriminator,
                        ) % 5}.png`;
                    }
                }
            }
        },
    },
    beforeRouteLeave(_to, _from, next) {
        next(vm =>
            !this.changes || window.confirm(vm.$t("unsavedChanged")),
        );
    },
    beforeDestroy() {
        this.$store.commit("SET_PROFILE_COLOR", null);
    },
    methods: {
        roleIcon(role) {
            switch (role) {
                case "system":
                    return "mdi-cogs";
                case "admin":
                    return "mdi-shield-check";
                case "verified":
                    return "mdi-check-decagram";
                case "dino":
                    return "mdi-google-downasaur";

                default:
                    return `mdi-${role}`;
            }
        },
        roleName(role) {
            const roleName = role.split("|")[role.split("|").length - 1];
            if (["system", "admin", "verified"].includes(roleName)) {
                return this.$t("roles." + roleName);
            } else {
                return roleName;
            }
        },
        discard() {
            this.changed = {
                profileColor: this.creator.profile_color,
                customUsername: this.creator.custom_username,
                bio: this.creator.bio,
                bannerImage: null,
                logoImage: null,
                clearBannerImage: false,
                clearLogoImage: false,
                isBlocked: this.creator.is_blocked,
            };
        },
        submit() {
            this.loading.submit = true;

            this.$apollo
                .mutate({
                    mutation: updateProfile,
                    variables: {
                        id: this.id,
                        custom_username: this.changed.customUsername,
                        bio: this.changed.bio,
                        profile_color: this.changed.profileColor,
                        banner_image: this.changed.bannerImage,
                        logo_image: this.changed.logoImage,
                        clear_banner_image: this.changed.clearBannerImage,
                        clear_logo_image: this.changed.clearLogoImage,
                        is_blocked: this.changed.isBlocked,
                    },
                })
                .then(({data}) => {
                    this.loading.submit = false;
                    if (data && data.updateProfile) {
                        this.editDialog = false;
                        this.changed.bannerImage = null;
                        this.changed.logoImage = null;
                        this.changed.clearBannerImage = false;
                        this.changed.clearLogoImage = false;
                        this.$apollo.queries.creator.refetch();
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
        if (this.creator) {
            const metaTitle = `${this.creator.display_name} | ${this.$tc("creator", 2)}`;
            const metaDesc = this.creator.bio
                ? removeMd(this.creator.bio)
                : this.$t("creators.pageDescription", {creator: this.creator.display_name});

            let avatar = null;
            if (this.creator.discord_user.avatar) {
                avatar = `avatars/${this.creator.id}/${this.creator.discord_user.avatar}`;
            } else {
                avatar = `embed/avatars/${parseInt(
                    this.creator.discord_user.discriminator,
                ) % 5}.png`;
            }

            const metaImg = this.creator.logo_image
                ? `${process.env.API_ENDPOINT}cdn/creators/${this.creator.id}/logo/${this.creator.logo_image}`
                : `https://cdn.discordapp.com/${avatar}?size=256`;

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
                    this.creator.profile_color
                        ? {
                            hid: "theme-color",
                            name: "theme-color",
                            property: "theme-color",
                            content: this.creator.profile_color,
                        }
                        : {},
                ],
            };
        }
    },
});
</script>

<style lang="scss" scoped>
.parallax {
    height: auto !important;

    .v-parallax__content {
        width: 100%;
        height: 100%;
        position: relative;
        background: radial-gradient(transparent 0%, #121212 150%);
    }

    .avatar {
        user-select: none;
        margin-top: -4px;
        box-shadow: #00000060 0 5px 30px;
    }

    .discord-name {
        width: fit-content;
        margin: auto;
        background-color: #222222a0;
        border-radius: 200px;
        text-align: center;
        word-break: break-all;
        box-shadow: #00000050 0 1px 30px;
    }
}

.markdown-wrapper {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
}

.markdown {
    padding: 20px;
}
</style>
