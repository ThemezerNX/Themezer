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
            >
                <v-row
                    align="center"
                    class="profile d-flex py-4"
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
                                    <span class="text-capitalize">{{
                                            role.split("|")[role.split("|").length - 1]
                                        }}</span>
                                </v-tooltip>
                            </template>
                        </h1>
                    </v-col>
                    <v-col class="text-center" cols="12">
                        <ButtonDivider :hide-dividers="true">
                            <v-btn
                                v-if="mayModerate"
                                color="secondary"
                                rounded
                                @click="editDialog = true"
                            >
                                Edit Profile
                                <v-icon right>mdi-pencil</v-icon>
                            </v-btn>
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
                <v-row align="center" justify="center">
                    <v-col class="pt-0" cols="12">
                        <v-sheet v-if="creator.bio" class="markdown-wrapper" elevation="12">
                            <Markdown :source="creator.bio" class="markdown"/>
                        </v-sheet>

                        <p class="ma-2" v-else>This creator hasn't written anything about themselves yet...</p>
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
                    <v-col class="pt-0" cols="12">
                        <h1>
                            Latest Packs by this creator
                        </h1>
                        <v-divider/>
                        <ItemGrid
                            :loading="!!$apollo.queries.packList.loading"
                            :items="packList"
                            :limit="6"
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
                    <v-col class="pt-0" cols="12">
                        <h1>
                            Latest Themes by this creator
                        </h1>
                        <v-divider/>
                        <ItemGrid
                            :loading="!!$apollo.queries.themeList.loading"
                            :items="themeList"
                            :limit="6"
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
                    <v-col class="pt-0" cols="12">
                        <h1>
                            Latest Layouts by this creator
                        </h1>
                        <v-divider/>
                        <ItemGrid
                            :loading="!!$apollo.queries.layoutList.loading"
                            :items="layoutList"
                            :limit="6"
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
                            <span>Edit Profile</span>
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
                                label="Block user from submitting"
                            />
                            <v-text-field
                                v-model="changed.customUsername"
                                :disabled="loading.submit"
                                :rules="[rules.utf8_only]"
                                class="pt-1"
                                counter="50"
                                label="Custom display name"
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
                                :rules="[rules.no_scripts]"
                                auto-grow
                                class="pt-1"
                                counter="1000"
                                label="Bio (supports Markdown and HTML)"
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
								Profile color will affect the navigation bar and
								side menu
							</span>
                            <v-text-field
                                v-model="changed.profileColor"
                                :color="changed.profileColor"
                                :disabled="loading.submit"
                                :rules="[rules.hex]"
                                class="pt-2"
                                label="Profile color"
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
                                label="Banner (recommended: 1920x800)"
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
                                    Remove current banner
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
                                label="Logo (replaces Discord avatar)"
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
                                    Remove current logo
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
                                    Discard
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
                                    Save
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
import rules from "~/assets/lang/rules";
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
    },
    // async asyncData({ error, app, params }) {
    // 	const syncData = {
    // 		id: params.id,
    // 		isPageOwner: app.$auth.loggedIn && params.id === app.$auth.user.id,
    // 		changed: {
    // 			profileColor: null,
    // 			customUsername: null,
    // 			bio: null,
    // 			bannerImage: null,
    // 			logoImage: null,
    // 			clearBannerImage: false,
    // 			clearLogoImage: false
    // 		}
    // 	}

    // 	syncData.creator = await app.apolloProvider.clients.defaultClient
    // 		.query({
    // 			query: syncData.isPageOwner ? me : creator,
    // 			variables: { id: params.id }
    // 		})
    // 		.then(({ data }) => {
    // 			if (syncData.isPageOwner) {
    // 				return data?.me
    // 			} else {
    // 				return data?.creator
    // 			}
    // 		})
    // 		.catch((e) => {
    // 			error(e)
    // 		})

    // 	if (syncData.creator) {
    // 		if (
    // 			syncData.creator.old_ids &&
    // 			syncData.creator.old_ids.includes(syncData.id)
    // 		) {
    // 			// Sort of redirect, needs proper HTML 301 (moved permanently)
    // 			app.$router.push(`/creators/${syncData.creator.id}`)
    // 		} else {
    // 			app.$store.commit(
    // 				'SET_PROFILE_COLOR',
    // 				syncData.creator.profile_color
    // 			)

    // 			syncData.changed.profileColor = syncData.creator.profile_color
    // 			syncData.changed.customUsername =
    // 				syncData.creator.custom_username
    // 			syncData.changed.bio = syncData.creator.bio

    // 			if (syncData.creator.discord_user.avatar) {
    // 				syncData.avatar = `avatars/${syncData.creator.id}/${syncData.creator.discord_user.avatar}`
    // 			} else {
    // 				syncData.avatar = `embed/avatars/${parseInt(
    // 					syncData.creator.discord_user.discriminator
    // 				) % 5}.png`
    // 			}
    // 		}
    // 	}

    // 	return syncData
    // },
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
            rules,
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
                    limit: 6,
                };
            },
            prefetch: true,
        },
        themeList: {
            query: rowThemeList,
            variables() {
                return {
                    creators: [this.id],
                    limit: 6,
                };
            },
            prefetch: true,
        },
        layoutList: {
            query: rowLayoutList,
            variables() {
                return {
                    creators: [this.id],
                    limit: 6,
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
        if (this.changes) {
            const answer = window.confirm(
                "Do you really want to leave? You have unsaved changes!",
            );
            if (answer) {
                next();
            } else {
                next(false);
            }
        } else next();
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
                            "Success! Changes might take some time to apply.",
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
            const metaTitle = `${this.creator.display_name} | Creators`;
            const metaDesc = this.creator.bio
                ? removeMd(this.creator.bio)
                : `${this.creator.display_name}'s page on Themezer. View Packs, Themes and Layouts created by ${this.creator.display_name}.`;

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

            return {
                title: metaTitle,
                meta: [
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
