<template>
	<error v-if="error" :error="error" />
	<div v-else-if="creator">
		<v-parallax
			dark
			:src="
				creator.banner_image
					? `//api.themezer.ga/storage/creators/${creator.id}/banner/${creator.banner_image}`
					: ''
			"
			class="d-flex align-center justify-center parallax"
		>
			<v-row class="profile d-flex py-4" align="center" justify="center">
				<v-col class="text-center" cols="12">
					<v-img
						v-if="creator.logo_image"
						contain
						class="ma-auto"
						:width="$vuetify.breakpoint.smAndDown ? 200 : 300"
						max-width="100%"
						max-height="50vh"
						:src="
							`//api.themezer.ga/storage/creators/${creator.id}/logo/${creator.logo_image}`
						"
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
					<h1 class="font-weight-regular discord-name py-1 px-3">
						<v-avatar
							v-if="creator.logo_image"
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
						{{ creator.discord_user.username }}#{{
							creator.discord_user.discriminator
						}}
						<v-tooltip top>
							<template v-slot:activator="{ on, attrs }">
								<v-icon
									v-if="roleIcon"
									class="mt-n2"
									v-bind="attrs"
									v-on="on"
								>
									{{ roleIcon }}
								</v-icon>
							</template>
							<span class="text-capitalize">{{
								creator.role
							}}</span>
						</v-tooltip>
					</h1>
				</v-col>
				<v-col v-if="isPageOwner" class="text-center" cols="12">
					<v-btn color="secondary" @click="editDialog = true">
						Edit Profile <v-icon right>mdi-pencil</v-icon>
					</v-btn>
				</v-col>
			</v-row>
		</v-parallax>
		<v-container
			:fluid="$vuetify.breakpoint.smAndDown"
			style="height: 100%;"
		>
			<v-row align="center" justify="center">
				<v-col cols="12" class="pt-0">
					<h1>
						Bio
					</h1>
					<v-divider />
					<!-- eslint-disable-next-line vue/no-v-html -->
					<div v-if="creator.bio" v-html="$md.render(creator.bio)" />
					<span v-else>There's nothing here yet...</span>
				</v-col>
			</v-row>
			<v-row
				v-if="latestThemesList && latestThemesList.length > 0"
				align="center"
				justify="center"
			>
				<v-col cols="12" class="pt-0">
					<h1>
						Latest Themes by this creator
					</h1>
					<v-divider />
					<ThemesSlideGroup :items="latestThemesList" />
				</v-col>
			</v-row>
			<v-row
				v-if="layoutsList && layoutsList.length > 0"
				align="center"
				justify="center"
			>
				<v-col cols="12" class="pt-0">
					<h1>
						All Layouts by this creator
					</h1>
					<v-divider />
					<LayoutsSlideGroup :items="layoutsList" />
				</v-col>
			</v-row>
		</v-container>

		<v-dialog v-model="editDialog" max-width="800" class="mx-auto">
			<v-form v-model="submitValid">
				<v-card>
					<v-card-title
						class="title font-weight-regular justify-space-between"
					>
						<span>Edit Profile</span>
						<v-spacer></v-spacer>

						<v-btn icon @click="editDialog = false">
							<v-icon>
								mdi-close
							</v-icon>
						</v-btn>
					</v-card-title>

					<v-card-text>
						<v-textarea
							v-model="changed.bio"
							:disabled="loading.submit"
							class="pt-1"
							outlined
							maxlength="1000"
							prepend-icon="mdi-pencil"
							counter="1000"
							label="Bio (supports Markdown)"
							auto-grow
							@change="
								changed.bio === '' ? (changed.bio = null) : null
							"
						></v-textarea>
						<span class="caption grey--text text--darken-1">
							Profile color will affect the navigation bar and
							side menu
						</span>
						<v-text-field
							v-model="changed.profileColor"
							:disabled="loading.submit"
							class="pt-2"
							label="Profile color"
							:color="changed.profileColor"
							outlined
							maxlength="7"
							:rules="[rules.hex]"
							prepend-icon="mdi-format-color-fill"
							@change="
								changed.profileColor === ''
									? (changed.profileColor = null)
									: null
							"
						></v-text-field>
						<v-file-input
							v-model="changed.bannerImage"
							label="Banner"
							outlined
							prepend-icon="mdi-image-area"
							:rules="[rules.banner_size]"
							accept="image/*"
							:disabled="
								changed.clearBannerImage || loading.submit
							"
						/>
						<v-flex class="d-flex mt-n4 mb-2">
							<v-spacer />
							<v-btn
								:disabled="
									!creator.banner_image ||
										changed.clearBannerImage ||
										changed.bannerImage ||
										loading.submit
								"
								text
								color="red"
								@click.prevent="changed.clearBannerImage = true"
							>
								Remove current banner
								<v-icon right>mdi-delete-outline</v-icon>
							</v-btn>
						</v-flex>
						<v-file-input
							v-model="changed.logoImage"
							label="Logo (replaces Discord avatar)"
							outlined
							prepend-icon="mdi-image"
							:rules="[rules.logo_size]"
							accept="image/*"
							:disabled="changed.clearLogoImage || loading.submit"
						/>
						<v-flex class="d-flex mt-n4 mb-2">
							<v-spacer />
							<v-btn
								:disabled="
									!creator.logo_image ||
										changed.clearLogoImage ||
										changed.logoImage ||
										loading.submit
								"
								text
								color="red"
								@click.prevent="changed.clearLogoImage = true"
							>
								Remove current logo
								<v-icon right>mdi-delete-outline</v-icon>
							</v-btn>
						</v-flex>
						<v-flex class="d-flex">
							<v-btn
								:disabled="!changes || loading.submit"
								color="red"
								@click.prevent="discard()"
							>
								Discard
								<v-icon right>mdi-delete-sweep-outline</v-icon>
							</v-btn>
							<v-spacer />
							<v-btn
								:disabled="!submitValid || !changes"
								color="secondary"
								type="submit"
								:loading="loading.submit"
								@click.prevent="submit()"
							>
								Save <v-icon right>mdi-cube-send</v-icon>
							</v-btn>
						</v-flex>
					</v-card-text>
				</v-card>
			</v-form>
		</v-dialog>
	</div>
</template>

<script>
import Vue from 'vue'
import { creator, profile } from '@/graphql/Creator.gql'
import { latestThemesList } from '@/graphql/Theme.gql'
import { allLayoutsList } from '@/graphql/Layout.gql'
import ThemesSlideGroup from '@/components/ThemesSlideGroup.vue'
import LayoutsSlideGroup from '@/components/LayoutsSlideGroup.vue'
import error from '@/layouts/error'

export default Vue.extend({
	components: {
		ThemesSlideGroup,
		LayoutsSlideGroup,
		error
	},
	middleware: ['auth'],
	options: {
		auth: false
	},
	data() {
		return {
			id: this.$route.params.id,
			isPageOwner:
				this.$auth.user && this.$route.params.id === this.$auth.user.id,
			editDialog: false,
			submitValid: false,
			loading: {
				submit: false
			},

			changed: {
				profileColor: null,
				bio: null,
				bannerImage: null,
				logoImage: null,
				clearBannerImage: false,
				clearLogoImage: false
			},

			error: null,
			avatar: null,
			rules: {
				hex: (value) =>
					!value ||
					(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
						? true
						: 'Invalid HEX color'),
				banner_size: (file) =>
					!file ||
					file.size < 1048576 ||
					'Image size should be less than 1 MB!',
				logo_size: (file) =>
					!file ||
					file.size < 1048576 ||
					'Image size should be less than 1 MB!'
			}
		}
	},
	computed: {
		changes() {
			return !(
				this.creator.profile_color === this.changed.profileColor &&
				this.creator.bio === this.changed.bio &&
				!this.changed.bannerImage &&
				!this.changed.logoImage &&
				!this.changed.clearBannerImage &&
				!this.changed.clearLogoImage
			)
		},
		roleIcon() {
			switch (this.creator.role) {
				case 'verified':
					return 'mdi-check-decagram'

				default:
					return null
			}
		}
	},
	apollo: {
		creator: {
			query: creator,
			variables() {
				return {
					id: this.id
				}
			},
			error(e) {
				this.error = e
			},
			prefetch: true
		},
		latestThemesList: {
			query: latestThemesList,
			variables() {
				return {
					creator_id: this.id,
					limit: 10
				}
			},
			error(e) {
				this.error = e
			},
			prefetch: true
		},
		layoutsList: {
			query: allLayoutsList,
			variables() {
				return {
					creator_id: this.id
				}
			},
			error(e) {
				this.error = e
			},
			prefetch: true
		}
	},
	watch: {
		creator(creator) {
			if (creator) {
				this.$store.commit('SET_PROFILE_COLOR', creator.profile_color)

				this.changed.profileColor = creator.profile_color
				this.changed.bio = creator.bio

				if (creator.discord_user.avatar) {
					this.avatar = `avatars/${creator.id}/${creator.discord_user.avatar}`
				} else {
					this.avatar = `embed/avatars/${parseInt(
						creator.discord_user.discriminator
					) % 5}.png`
				}
			}
		}
	},
	beforeRouteLeave(_to, _from, next) {
		if (this.$refs.CreatorPage && this.$refs.CreatorPage.changes) {
			const answer = window.confirm(
				'Do you really want to leave? you have unsaved changes!'
			)
			if (answer) {
				next()
			} else {
				next(false)
			}
		} else next()
	},
	beforeDestroy() {
		this.$store.commit('SET_PROFILE_COLOR', null)
	},
	methods: {
		discard() {
			this.changed = {
				profileColor: this.creator.profile_color,
				bio: this.creator.bio,
				bannerImage: null,
				logoImage: null,
				clearBannerImage: false,
				clearLogoImage: false
			}
		},
		submit() {
			this.loading.submit = true

			this.$apollo
				.mutate({
					mutation: profile,
					variables: {
						bio: this.changed.bio,
						profile_color: this.changed.profileColor,
						banner_image: this.changed.bannerImage,
						logo_image: this.changed.logoImage,
						clear_banner_image: this.changed.clearBannerImage,
						clear_logo_image: this.changed.clearLogoImage
					}
				})
				.then(({ data }) => {
					this.loading.submit = false
					if (data && data.profile) {
						this.editDialog = false
						this.changed.bannerImage = null
						this.changed.logoImage = null
						this.changed.clearBannerImage = false
						this.changed.clearLogoImage = false
						this.$apollo.queries.creator.refetch()
					}
				})
				.catch((error) => {
					this.loading.submit = false
					// eslint-disable-next-line no-console
					console.error(error)
					const parsedError = JSON.parse(JSON.stringify(error))
					if (
						parsedError.graphQLErrors &&
						parsedError.graphQLErrors.length > 0 &&
						parsedError.graphQLErrors[0].message
					) {
						this.error = parsedError.graphQLErrors[0].message
					} else {
						this.error = error.message
							.toString()
							.replace('GraphQL error: ', '')
					}
					this.loading.uploadSingleOrZip = false
					this.snackbar = true
					setTimeout(() => {
						this.error = null
					}, 8100)
				})
		}
	}
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

.parallax {
	height: auto !important;

	.v-parallax__content {
		width: 100%;
		height: 100%;
		position: relative;
		background: radial-gradient(
			transparent 0%,
			map-get($material-dark, 'background') 150%
		);
	}

	.avatar {
		user-select: none;
		margin-top: -4px;
		box-shadow: #00000060 0px 5px 30px;
	}

	.discord-name {
		width: fit-content;
		margin: auto;
		background-color: #222222a0;
		border-radius: 20px;
		text-align: center;
		word-break: break-all;
		box-shadow: #00000050 0px 1px 30px;
	}
}
</style>