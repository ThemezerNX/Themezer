<template>
	<v-app dark>
		<v-navigation-drawer v-model="drawer" class="drawer" clipped fixed app>
			<div class="background" />
			<v-list nav>
				<!-- <v-divider /> -->
				<template v-for="item in items">
					<v-subheader v-if="item.header" :key="item.header">{{
						item.header
					}}</v-subheader>
					<v-list-item
						v-else
						:key="item.title"
						class="my-2"
						:to="item.to"
						router
						exact
					>
						<v-list-item-action>
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-item-action>
						<v-list-item-content>
							<v-list-item-title v-text="item.title" />
						</v-list-item-content>
					</v-list-item>
				</template>
				<v-divider />
				<v-list-item to="/about" class="my-2" router exact>
					<v-list-item-action>
						<v-icon>mdi-information-outline</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title>
							About
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
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
			<span>&copy; {{ new Date().getFullYear() }}</span>
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
					header: 'Layouts'
				},
				{
					icon: 'mdi-home',
					title: 'Home Menu',
					to: '/layouts/homemenu'
				},
				{
					icon: 'mdi-lock',
					title: 'Lockscreen',
					to: '/layouts/lockscreen'
				},
				{
					icon: 'mdi-apps',
					title: 'All Apps',
					to: '/layouts/allapps'
				},
				{
					icon: 'mdi-account',
					title: 'Player Select',
					to: '/layouts/playerselect'
				}
			]
		}
	}
}
</script>

<style lang="scss">
.v-card__text,
.v-card__title {
	word-break: normal;
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
	background: linear-gradient(135deg, #b40a86, #0ab379);
}
</style>
