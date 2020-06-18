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
			<div class="background" />
			<v-list nav>
				<v-list-item
					v-if="!$auth.loggedIn"
					link
					two-line
					router
					to="/login"
					exact
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
								:src="`https://cdn.discordapp.com/${Avatar}`"
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
					<v-list-item dense router exact to="/account/profile">
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
				<v-divider />
				<template v-for="item in items">
					<v-subheader v-if="item.header" :key="item.header">{{
						item.header
					}}</v-subheader>
					<v-divider v-else-if="item.divider" :key="item.divider" />
					<v-list-group v-else-if="item.group" :key="item.title">
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
								:key="type"
								router
								:to="`/${type}/${item.target}`"
								dense
								class="ml-11"
							>
								<v-list-item-title
									class="text-capitalize"
									v-text="type"
								/>
								<v-list-item-icon>
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
						exact
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
		<v-app-bar class="navbar" clipped-left fixed app>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer" />
			<NuxtLink exact to="/" style="text-decoration: none; color: white;">
				<v-toolbar-title class="d-flex">
					<v-img
						class="mx-2"
						contain
						src="/logo-256.jpg"
						width="30"
						style="border-radius: 5px;"
					/>
					{{ title }}
				</v-toolbar-title>
			</NuxtLink>
			<v-spacer />
		</v-app-bar>
		<v-content class="content">
			<v-container
				:fluid="$vuetify.breakpoint.smAndDown"
				style="height: 100%;"
			>
				<!-- <v-container> -->
				<nuxt />
			</v-container>
		</v-content>

		<!-- <v-footer fixed app>
			<span>&copy; {{ new Date().getFullYear() }} Migush</span>
		</v-footer> -->
	</v-app>
</template>

<script>
export default {
	data() {
		return {
			title: process.env.APP_TITLE,
			drawer: false,
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
					group: true,
					icon: 'mdi-home-outline',
					title: 'Home Menu',
					target: 'homemenu',
					types: ['themes', 'layouts']
				},
				{
					group: true,
					icon: 'mdi-lock-outline',
					title: 'Lockscreen',
					target: 'lockscreen',
					types: ['themes', 'layouts']
				},
				{
					group: true,
					icon: 'mdi-apps',
					title: 'All Apps',
					target: 'allapps',
					types: ['themes', 'layouts']
				},
				{
					group: true,
					icon: 'mdi-cog-outline',
					title: 'Settings',
					target: 'settings',
					types: ['themes', 'layouts']
				},
				{
					group: true,
					icon: 'mdi-account-outline',
					title: 'Player Select',
					target: 'playerselect',
					types: ['themes', 'layouts']
				},
				{
					group: true,
					icon: 'mdi-newspaper-variant-outline',
					title: 'News',
					target: 'news',
					types: ['themes', 'layouts']
				},
				{
					header: 'Submit'
				},
				{
					icon: 'mdi-file-image-outline',
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
			]
		}
	},
	computed: {
		Avatar() {
			if (this.$auth.user.avatar) {
				return `avatars/${this.$auth.user.id}/${this.$auth.user.avatar}`
			} else {
				return `embed/avatars/${parseInt(
					this.$auth.user.discriminator
				) % 5}.png`
			}
		}
	},
	methods: {
		async logout() {
			await this.$auth.logout()
		}
	}
}
</script>

<style lang="scss">
.v-card__text,
.v-card__title {
	word-break: normal;
}

.box {
	background-color: #1e1e1e;
	border-radius: 4px;
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
		border-radius: 4px;
		// max-height: 70vh;
	}

	.box_text {
		margin-left: 8px;
	}

	h2.box_text {
		margin-top: 16px;
	}
}
</style>

<style lang="scss" scoped>
.drawer {
	user-select: none;

	.background {
		position: absolute;
		height: 100%;
		width: 100%;
		z-index: -1;
		background-size: cover;
		filter: blur(5px) brightness(0.4);
		// background-image: url('/images/drawer_backgrounds/animalcrossing.png');
		// background: linear-gradient(
		// 		to left top,
		// 		$themezer-aqua 0%,
		// 		$themezer-average 50%,
		// 		$themezer-magenta 100%
		// 	),
		// 	linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 1));
		// background: linear-gradient(135deg, $themezer-magenta, $themezer-aqua);
		overflow: hidden;
	}
}

.navbar {
	user-select: none;
	background: transparent;
}

.content {
	// background: linear-gradient(135deg, #b40a86, #0ab379);
}
</style>
