<template>
	<v-app dark>
		<v-navigation-drawer
			v-if="true"
			v-model="drawer"
			class="drawer"
			clipped
			fixed
			app
		>
			<div
				class="background"
				:style="
					$store.state.profileColor
						? `background-color: ${$store.state.profileColor} !important;`
						: ''
				"
			/>
			<v-list rounded nav>
				<v-list-item
					v-if="!$auth.loggedIn"
					class="my-2"
					link
					two-line
					router
					to="/login"
				>
					<v-list-item-avatar>
						<v-icon large>
							mdi-account-circle
						</v-icon>
					</v-list-item-avatar>

					<v-list-item-content>
						<v-list-item-title>
							Login / register
						</v-list-item-title>
					</v-list-item-content>
					<v-icon>mdi-login</v-icon>
				</v-list-item>
				<v-list-group v-if="$auth.loggedIn" no-action>
					<template v-slot:activator>
						<v-list-item-avatar>
							<img
								v-if="$auth.loggedIn"
								:src="
									`https://cdn.discordapp.com/${avatar}?size=64`
								"
							/>
							<v-icon v-else large>
								mdi-account-circle
							</v-icon>
						</v-list-item-avatar>
						<v-list-item-content>
							<v-list-item-title>
								{{ $auth.user.username }}
							</v-list-item-title>
						</v-list-item-content>
					</template>
					<v-list-item
						dense
						router
						:to="`/creators/${$auth.user.id}`"
					>
						<v-list-item-title>My Profile</v-list-item-title>
						<v-list-item-icon>
							<v-icon>mdi-account</v-icon>
						</v-list-item-icon>
					</v-list-item>
					<v-list-item dense @click="logout()">
						<v-list-item-title>Logout</v-list-item-title>
						<v-list-item-icon>
							<v-icon>mdi-logout</v-icon>
						</v-list-item-icon>
					</v-list-item>
				</v-list-group>
				<v-divider class="mt-2" />
				<template v-for="item in items">
					<v-subheader v-if="item.header" :key="item.header">{{
						item.header
					}}</v-subheader>
					<v-divider
						v-else-if="item.divider"
						:key="item.divider"
						class="mt-2"
					/>
					<v-list-group
						v-else-if="Array.isArray(item.types)"
						:key="item.title"
					>
						<template v-slot:activator>
							<v-list-item-action>
								<v-icon v-text="item.icon" />
							</v-list-item-action>
							<v-list-item-content>
								<v-list-item-title v-text="item.title" />
							</v-list-item-content>
						</template>
						<template v-for="type in item.types">
							<v-list-item
								:key="item.title + type.name"
								router
								:to="`/${type.name}/${item.target}`"
								dense
								class="ml-11 pl-5"
							>
								<v-list-item-title
									class="text-capitalize"
									v-text="type.name"
								/>
								<v-list-item-icon v-if="type.icon">
									<v-icon v-text="type.icon" />
								</v-list-item-icon>
							</v-list-item>
						</template>
					</v-list-group>
					<v-list-item
						v-else
						:key="item.title"
						class="my-2"
						:to="item.to"
						router
					>
						<v-list-item-action>
							<v-icon v-text="item.icon" />
						</v-list-item-action>
						<v-list-item-content>
							<v-list-item-title v-text="item.title" />
						</v-list-item-content>
					</v-list-item>
				</template>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar
			class="navbar"
			clipped-left
			fixed
			app
			:style="
				$store.state.profileColor
					? `background-color: ${$store.state.profileColor} !important;`
					: ''
			"
		>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer" />
			<NuxtLink to="/" class="title-link">
				<v-toolbar-title class="d-flex title-text">
					<v-img
						class="mx-2"
						contain
						src="/icon-256.png"
						width="30"
						style="border-radius: 5px;"
					/>
					{{ title }}
				</v-toolbar-title>
			</NuxtLink>
			<v-spacer />
		</v-app-bar>
		<v-main class="content">
			<nuxt />
		</v-main>

		<!-- <v-footer fixed app>
			<span>&copy; {{ new Date().getFullYear() }} Migush</span>
		</v-footer> -->
		<v-dialog
			v-if="$auth.loggedIn && $auth.user"
			v-model="acceptDialog"
			max-width="800"
			class="mx-auto"
			persistent
		>
			<v-card>
				<v-card-title
					class="title font-weight-regular justify-space-between"
				>
					<span>Backup Code</span>
				</v-card-title>

				<v-card-text>
					In order to ensure you retain access to you Themezer account
					if anything happens to your Discord account, here is your
					creator ID and a backup code you can use in order to restore
					your account and connect a new Discord account. Be sure to
					store this backup code somewhere safe! The creator ID can
					also be found in the url of the creator page of your
					previous Themezer account. To restore your account, visit
					the about page.
					<div>
						THIS IS THE ONLY TIME YOU CAN VIEW THIS BACKUP CODE!
					</div>
					<v-flex class="d-flex">
						<v-text-field
							ref="creatorId"
							v-model="$auth.user.id"
							rounded
							class="my-5"
							hide-details
							readonly
							outlined
							prepend-icon="mdi-identifier"
						></v-text-field>

						<v-tooltip v-model="copyIdSuccess" nudge-top top>
							<template v-slot:activator="{ attrs }">
								<v-btn
									rounded
									v-bind="attrs"
									class="align-self-center ml-2"
									@click="copyId"
									>copy</v-btn
								>
							</template>
							<span>Copied!</span>
						</v-tooltip>
					</v-flex>
					<v-flex class="d-flex">
						<v-text-field
							ref="backupCode"
							v-model="backupCode"
							rounded
							class="my-5"
							hide-details
							readonly
							outlined
							prepend-icon="mdi-key-variant"
							:type="showBackupCode ? 'text' : 'password'"
							:append-icon="
								showBackupCode ? 'mdi-eye-off' : 'mdi-eye'
							"
							@click:append="
								() => (showBackupCode = !showBackupCode)
							"
						></v-text-field>

						<v-tooltip v-model="copyCodeSuccess" nudge-top top>
							<template v-slot:activator="{ attrs }">
								<v-btn
									rounded
									v-bind="attrs"
									class="align-self-center ml-2"
									@click="copyCode"
									>copy</v-btn
								>
							</template>
							<span>Copied!</span>
						</v-tooltip>
					</v-flex>

					<v-flex class="d-flex">
						<v-spacer />
						<v-btn
							rounded
							:disabled="!countdownFinished"
							color="secondary"
							:loading="loading.accept"
							@click.prevent="accept()"
						>
							Continue <v-icon right>mdi-check-outline</v-icon>
						</v-btn>
					</v-flex>
				</v-card-text>
			</v-card>
		</v-dialog>
		<Snackbar />
	</v-app>
</template>

<script>
import { updateAuth } from '@/graphql/Creator.gql'

const bothTypes = [
	{
		name: 'themes',
		icon: 'mdi-format-color-fill'
	},
	{
		name: 'layouts',
		icon: 'mdi-code-json'
	}
]

export default {
	data() {
		return {
			title: process.env.APP_TITLE,
			drawer: false,
			error: null,
			items: [
				{
					icon: 'mdi-package-variant-closed',
					title: 'Theme Packs',
					to: '/packs'
				},
				{
					header: 'Themes & Layouts'
				},
				{
					icon: 'mdi-home-outline',
					title: 'Home Menu',
					target: 'homemenu',
					types: bothTypes
				},
				{
					icon: 'mdi-lock-outline',
					title: 'Lockscreen',
					target: 'lockscreen',
					types: bothTypes
				},
				{
					icon: 'mdi-apps',
					title: 'All Apps',
					target: 'allapps',
					types: bothTypes
				},
				{
					icon: 'mdi-cog-outline',
					title: 'Settings',
					target: 'settings',
					types: bothTypes
				},
				{
					icon: 'mdi-account-multiple',
					title: 'Player Select',
					target: 'playerselect',
					types: bothTypes
				},
				{
					icon: 'mdi-account-outline',
					title: 'User Page',
					target: 'userpage',
					types: bothTypes
				},
				{
					icon: 'mdi-newspaper-variant-outline',
					title: 'News',
					target: 'news',
					types: bothTypes
				},
				{
					header: 'Submit'
				},
				{
					icon: 'mdi-format-color-fill',
					title: 'Theme',
					to: '/submit/theme'
				},
				{
					icon: 'mdi-code-json',
					title: 'Layout',
					to: '/submit/layout'
				},
				{
					header: 'Tools'
				},
				{
					icon: 'mdi-image-edit-outline',
					title: 'Overlay Creator',
					to: '/tools/overlaycreator'
				},
				{
					divider: true
				},
				{
					icon: 'mdi-information-outline',
					title: 'About',
					to: '/about'
				}
			],
			acceptDialog: false,
			accepts: true,
			backupCode: null,
			showBackupCode: false,
			copyIdSuccess: false,
			copyCodeSuccess: false,
			countdownFinished: false,
			loading: {
				accept: false
			}
		}
	},
	computed: {
		avatar() {
			if (this.$auth.loggedIn && this.$auth.user.avatar) {
				return `avatars/${this.$auth.user.id}/${this.$auth.user.avatar}`
			} else if (this.$auth.loggedIn) {
				return `embed/avatars/${parseInt(
					this.$auth.user.discriminator
				) % 5}.png`
			} else return null
		}
	},
	watch: {
		acceptDialog() {
			setTimeout(() => {
				this.countdownFinished = true
			}, 10000)
		}
	},
	mounted() {
		if (this.$auth.loggedIn) {
			this.loading.accept = true
			this.$apollo
				.mutate({
					mutation: updateAuth
				})
				.then(({ data }) => {
					this.loading.accept = false
					if (data.updateAuth) {
						if (data.updateAuth.has_accepted === true) {
							this.accepts = true
						} else {
							this.accepts = false
							this.acceptDialog = true
							this.backupCode = data.updateAuth.backup_code
						}
					}
				})
				.catch((err) => {
					this.$snackbar.error(err)

					this.loading.accept = false
				})
		}
	},
	methods: {
		logout() {
			this.error = null
			return this.$auth.logout('social').catch((e) => {
				this.error = e.response.data
			})
		},
		accept() {
			this.loading.accept = true
			this.$apollo
				.mutate({
					mutation: updateAuth,
					variables: {
						accepts: true
					}
				})
				.then(({ data }) => {
					this.loading.accept = false
					if (data.updateAuth) {
						if (data.updateAuth.has_accepted === true) {
							this.accepts = true
							this.acceptDialog = false
							this.backupCode = null
						}
					}
				})
				.catch((err) => {
					this.$snackbar.error(err)
					this.loading.accept = false
				})
		},
		copyCode() {
			navigator.clipboard
				.writeText(this.backupCode)
				.then(() => {
					this.copyCodeSuccess = true
					setTimeout(() => {
						this.copyCodeSuccess = false
					}, 2000)
				})
				.catch((e) => {
					// eslint-disable-next-line no-console
					console.log('Something went wrong, unable to copy', e)
				})
		},
		copyId() {
			navigator.clipboard
				.writeText(this.$auth.user.id)
				.then(() => {
					this.copyIdSuccess = true
					setTimeout(() => {
						this.copyIdSuccess = false
					}, 2000)
				})
				.catch((e) => {
					// eslint-disable-next-line no-console
					console.log('Something went wrong, unable to copy', e)
				})
		}
	}
}
</script>

<style lang="scss">
html {
	word-break: break-word;
}

.v-list--nav .v-list-item,
.v-list--rounded .v-list-item {
	margin-bottom: 0 !important;
}

.v-card__subtitle,
.v-card__text,
.v-card__title {
	word-break: break-word !important;
}

.v-slide-group__content {
	padding-top: 6px;
	padding-bottom: 6px;
}

.v-slide-group__wrapper {
	touch-action: inherit !important;
}

.smAndDown .v-slide-group__prev,
.smAndDown .v-slide-group__next {
	min-width: unset;
	max-width: fit-content;
}

.v-parallax__image-container {
	filter: blur(2px);
	background: url('/images/diagonal_joycon-180.png') #333;
	background-repeat: repeat;
	animation: flow 45s linear infinite;
}

.card .v-image__image--preload,
.placeholder {
	background: url('/images/diagonal_joycon-180.png') #333;
	background-repeat: repeat;
	animation: flow 6s linear infinite;
}

.placeholder {
	border-radius: 10px;
}

.box_fill .v-image__image--preload,
.box .v-image__image--preload {
	background: url('/images/diagonal_joycon-180.png') #333;
	background-repeat: repeat;
	animation: flow 30s linear infinite;
}

@keyframes flow {
	from {
		background-position: bottom left;
	}
	to {
		background-position: right;
	}
}

.box {
	background-color: #1e1e1e;
	border-radius: 10px;
	box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
		0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);

	&_fill {
		@extend .box;
		min-height: 100%;
	}

	.overlay-image {
		background-size: contain;
		background-position: center;
		// transition-duration: 200ms;
		// transition-timing-function: ease-in-out;
		border-radius: 10px;
	}

	.box_text {
		margin-left: 8px;
	}

	h2.box_text {
		margin-top: 16px;
	}
}

::-webkit-scrollbar-track {
	box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	background-color: #1e1e1e;
}

::-webkit-scrollbar {
	width: 6px;
	background-color: #1e1e1e;
}

::-webkit-scrollbar-thumb {
	background-color: #4e4e4e;
}
</style>

<style lang="scss" scoped>
.drawer {
	user-select: none;

	.background {
		position: absolute;
		height: 100%;
		width: 100%;
		z-index: -5;

		transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1) background-color;
		transition-property: background-color;
		transition-duration: 0.2s;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1),
			cubic-bezier(0.4, 0, 0.2, 1);
		transition-delay: 0s;
	}
}

.navbar {
	user-select: none;
	background: transparent;
	.title-link {
		text-decoration: none;
	}
	.title-text {
		color: white !important;
	}
}

// .content {
// 	background: linear-gradient(0deg, #b40a86, #0ab379);
// }
</style>
