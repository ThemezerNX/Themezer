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
					@click="$auth.loginWith('social')"
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
								alt="avatar"
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
						class="ml-11 pl-5"
						:to="`/creators/${$auth.user.id}`"
					>
						<v-list-item-title>My Profile</v-list-item-title>
						<v-list-item-icon>
							<v-icon>mdi-account</v-icon>
						</v-list-item-icon>
					</v-list-item>
					<v-list-item class="ml-11 pl-5" dense @click="logout()">
						<v-list-item-title>Logout</v-list-item-title>
						<v-list-item-icon>
							<v-icon>mdi-logout</v-icon>
						</v-list-item-icon>
					</v-list-item>
				</v-list-group>
				<template v-for="(item, i) in items">
					<v-subheader
						v-if="!!item.header"
						:key="i"
						class="mt-5"
						inset
						:class="item.class"
						style="height: 24px;"
					>
						{{ item.header }}
						<v-icon v-if="item.icon" right v-text="item.icon" />
					</v-subheader>

					<v-divider
						v-else-if="item.divider"
						:key="i"
						:inset="item.inset"
						class="my-2"
						:class="item.class"
					/>

					<v-list-group
						v-else-if="Array.isArray(item.menus)"
						:key="i"
						:class="item.class"
					>
						<template v-slot:activator>
							<v-list-item-action>
								<v-icon v-text="item.icon" />
							</v-list-item-action>
							<v-list-item-content>
								<v-list-item-title v-text="item.title" />
							</v-list-item-content>
						</template>
						<template v-for="type in item.menus">
							<v-list-item
								:key="item.name + type.target"
								router
								:to="`/${item.name}/${type.target}`"
								dense
								class="ml-11 pl-5"
							>
								<v-list-item-title
									class="text-capitalize"
									v-text="type.title"
								/>
								<v-list-item-icon v-if="type.icon">
									<v-icon v-text="type.icon" />
								</v-list-item-icon>
							</v-list-item>
						</template>
					</v-list-group>

					<v-list-item
						v-else
						:key="i"
						class="my-2"
						:class="item.class"
						:to="item.to"
						router
						:href="item.href"
						rel="noopener"
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
			<NuxtLink to="/" class="title-link mx-6">
				<v-toolbar-title class="d-flex title-text">
					<v-img
						class="mr-4"
						contain
						src="/icon-256-filled.png"
						width="32"
						style="border-radius: 5px; -webkit-filter: drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.1));"
					/>
					{{ title }}
				</v-toolbar-title>
			</NuxtLink>
			<v-toolbar-items class="d-none d-sm-flex">
				<v-btn
					v-for="target in targets"
					:key="target.name"
					:to="`/${target.name}`"
					:depressed="true"
					style="background-color: transparent"
				>
					{{ target.title }}
					<v-icon
						right
						:style="`margin-top: ${target.margin_top};`"
						>{{ target.icon }}</v-icon
					>
				</v-btn>
			</v-toolbar-items>
			<v-spacer />
			<v-toolbar-items>
				<v-menu bottom left offset-y>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							v-bind="attrs"
							:depressed="true"
							style="background-color: transparent"
							v-on="on"
						>
							<v-icon>mdi-shuffle</v-icon>
						</v-btn>
					</template>

					<v-list>
						<v-list-item
							v-for="(item, i) in randomMenuItems"
							:key="i"
							@click="item.function"
						>
							<v-list-item-action>
								<v-icon v-text="item.icon" />
							</v-list-item-action>
							<v-list-item-content>
								<v-list-item-title v-text="item.title" />
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-menu>
			</v-toolbar-items>
		</v-app-bar>
		<v-main class="content">
			<nuxt />
		</v-main>

		<v-footer inset absolute app>
			<span class="pr-3"
				>&copy; {{ new Date().getFullYear() }} Themezer</span
			>
			<nuxt-link class="pr-3" to="/contact">Contact</nuxt-link>
			<nuxt-link class="pr-3" to="/tos">Terms of Service</nuxt-link>
			<a target="_blank" href="https://status.themezer.net/">Status</a>
		</v-footer>
		<v-dialog
			v-if="$auth.loggedIn && $auth.user"
			v-model="acceptDialog"
			max-width="800"
			class="mx-auto"
			persistent
		>
			<v-card>
				<v-window v-model="step" touchless>
					<v-window-item :value="0">
						<v-card-title
							class="title font-weight-regular justify-space-between"
						>
							<span>Welcome to Themezer!</span>
						</v-card-title>

						<v-card-text>
							<p class="mb-4">
								Now you can finally upload your themes! But...
								there are a few rules here on Themezer:
							</p>

							<h1 class="mb-2">
								Terms of Service
							</h1>
							<div v-for="item in tos" :key="item.title">
								<h2>{{ item.title }}</h2>
								<p>
									{{ item.content }}
								</p>
							</div>

							<v-flex class="d-flex">
								<v-spacer />
								<v-btn
									rounded
									:disabled="!countdownFinished"
									color="secondary"
									@click.prevent="step++"
								>
									Accept
									<v-icon right>mdi-arrow-right</v-icon>
								</v-btn>
							</v-flex>
						</v-card-text>
					</v-window-item>
					<v-window-item :value="1">
						<v-card-title
							class="title font-weight-regular justify-space-between"
						>
							<span>Backup Code</span>
						</v-card-title>

						<v-card-text>
							In order to ensure you retain access to you Themezer
							account if anything happens to your Discord account,
							here is your creator ID and a backup code you can
							use in order to restore your account and connect a
							new Discord account. Be sure to store this backup
							code somewhere safe! The creator ID can also be
							found in the url of the creator page of your
							previous Themezer account. To restore your account,
							visit the about page.
							<div>
								THIS IS THE ONLY TIME YOU CAN VIEW THIS BACKUP
								CODE!
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

								<v-tooltip v-model="copyIdSuccess" top>
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
										showBackupCode
											? 'mdi-eye-off'
											: 'mdi-eye'
									"
									@click:append="
										() => (showBackupCode = !showBackupCode)
									"
								></v-text-field>

								<v-tooltip v-model="copyCodeSuccess" top>
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
								<v-btn
									rounded
									color="secondary"
									@click.prevent="step--"
								>
									Previous
									<v-icon right>mdi-arrow-left</v-icon>
								</v-btn>
								<v-spacer />
								<v-btn
									rounded
									:disabled="!backupCountdownFinished"
									color="secondary"
									:loading="loading.accept"
									@click.prevent="accept()"
								>
									Finish
									<v-icon right>mdi-check</v-icon>
								</v-btn>
							</v-flex>
						</v-card-text>
					</v-window-item>
				</v-window>
			</v-card>
		</v-dialog>
		<Snackbar />
	</v-app>
</template>

<script>
import { updateAuth } from '@/graphql/Creator.gql'
import { randomPackIDs } from '@/graphql/Pack.gql'
import { randomThemeIDs } from '@/graphql/Theme.gql'
import { randomLayoutIDs } from '@/graphql/Layout.gql'
import targets from '@/assets/targets'
import tos from '@/assets/tos'

export default {
	data() {
		return {
			targets,
			title: process.env.APP_TITLE,
			drawer: false,
			error: null,
			items: [
				{
					header: 'Download',
					icon: 'mdi-download',
					class: 'd-flex d-sm-none'
				},
				{
					divider: true,
					inset: true,
					class: 'd-flex d-sm-none'
				},
				...targets,
				{
					header: 'Submit',
					icon: 'mdi-upload'
				},
				{
					divider: true,
					inset: true
				},
				{
					icon: 'mdi-format-color-fill',
					title: 'Theme/Pack',
					to: '/submit/theme'
				},
				{
					icon: 'mdi-code-json',
					title: 'Layout',
					to: '/submit/layout'
				},
				{
					header: 'Tools',
					icon: 'mdi-tools'
				},
				{
					divider: true,
					inset: true
				},
				{
					icon: 'mdi-image-edit-outline',
					title: 'Overlay Creator',
					to: '/tools/overlaycreator'
				},
				{
					icon: 'mdi-web',
					title: 'Online Theme Creator',
					href: 'https://exelix11.github.io/SwitchThemeInjector/v2/'
				},
				{
					icon: 'mdi-open-in-app',
					title: 'Themezer NX App',
					href:
						'https://github.com/suchmememanyskill/themezer-nx/releases'
				},
				{
					divider: true,
					inset: true
				},
				{
					icon: 'mdi-information-outline',
					title: 'About',
					to: '/about'
				}
			],
			randomMenuItems: [
				{
					icon: 'mdi-package-variant-closed',
					title: 'Random Pack',
					function: this.randomPack
				},
				{
					icon: 'mdi-format-color-fill',
					title: 'Random Theme',
					function: this.randomTheme
				},
				{
					icon: 'mdi-code-json',
					title: 'Random Layout',
					function: this.randomLayout
				}
			],
			acceptDialog: false,
			step: 0,
			tos,
			accepts: true,
			backupCode: null,
			showBackupCode: false,
			copyIdSuccess: false,
			copyCodeSuccess: false,
			countdownFinished: false,
			backupCountdownFinished: false,
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
		},
		step(n) {
			if (n === 1) {
				setTimeout(() => {
					this.backupCountdownFinished = true
				}, 10000)
			}
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
		randomPack() {
			this.$apollo
				.query({
					query: randomPackIDs,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
					this.$router.push(`/packs/${data.randomPackIDs[0]}`)
				})
				.catch((err) => {
					this.$snackbar.error(err)
				})
		},
		randomTheme() {
			this.$apollo
				.query({
					query: randomThemeIDs,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
					this.$router.push(`/themes/_/${data.randomThemeIDs[0]}`)
				})
				.catch((err) => {
					this.$snackbar.error(err)
				})
		},
		randomLayout() {
			this.$apollo
				.query({
					query: randomLayoutIDs,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
					this.$router.push(`/layouts/_/${data.randomLayoutIDs[0]}`)
				})
				.catch((err) => {
					this.$snackbar.error(err)
				})
		},
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
@import '~assets/variables.scss';

$border-radius: 10px;

html {
	word-break: break-word !important;
}

.v-list-group__header.v-list-item {
	margin-bottom: 8px !important;
}

.v-menu__content {
	.v-card {
		background-color: #424242 !important;
	}
}

.v-card {
	border-radius: $border-radius !important;
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
	background: url('/images/diagonal_joycon-180.png') #333;
	background-repeat: repeat;
	animation: flow 45s linear infinite;
}

.card .v-image__image--preload,
.placeholder {
	background: url('/images/diagonal_joycon-180.png') #333;
	background-repeat: repeat;
	animation: flow 8s linear infinite;
}

.placeholder {
	border-radius: $border-radius;
}

.box_fill .v-image__image--preload,
.box .v-image__image--preload {
	background: url('/images/diagonal_joycon-180.png') #333;
	background-repeat: repeat;
	animation: flow 30s linear infinite;
}

.v-autocomplete__content.v-menu__content {
	box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
		0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
	border-radius: $border-radius !important;
}

.v-select.v-input--dense .v-input__append-inner {
	margin-top: auto;
	margin-bottom: auto;
	margin-right: -15px;
}

.v-select.v-input--dense .v-chip {
	margin: 4px 0 !important;
}

//For some reason this is missing in a build
.v-btn__content .v-icon--left,
.v-btn__content .v-icon--right {
	font-size: 18px !important;
	height: 18px !important;
	width: 18px !important;
}

@keyframes flow {
	from {
		background-position: bottom left;
	}
	to {
		background-position: top right;
	}
}

.box {
	background-color: #1e1e1e;
	border-radius: $border-radius !important;
	box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
		0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

	&_fill {
		@extend .box;
		min-height: 100%;
	}

	.overlay-image {
		background-size: contain;
		background-position: center;
		// transition-duration: 200ms;
		// transition-timing-function: ease-in-out;
		border-radius: $border-radius;
	}

	.box_text {
		margin-left: 8px;
		margin-right: 8px;
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
