<template>
	<v-app dark>
		<v-navigation-drawer v-model="drawer" class="drawer" clipped fixed app>
			<div class="background" />
			<v-list nav>
				<!-- <v-divider /> -->
				<v-list-item
					v-for="(item, i) in items"
					:key="i"
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
					<v-img class="mx-2" contain src="/icon.png" width="30" />
					{{ title }}
				</v-toolbar-title>
			</NuxtLink>
			<v-spacer />
		</v-app-bar>
		<v-content>
			<!-- <v-container fluid pa-0 style="height: 100%"> -->
			<v-container>
				<nuxt />
			</v-container>
		</v-content>
		<!-- <v-footer fixed app>
			<span>&copy; {{ new Date().getFullYear() }}</span>
		</v-footer> -->
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	data() {
		return {
			title: process.env.APP_TITLE,
			drawer: false,
			items: [
				{
					icon: 'mdi-home',
					title: 'Home Menu',
					to: '/homemenu'
				},
				{
					icon: 'mdi-lock',
					title: 'Lockscreen',
					to: '/lockscreen'
				},
				{
					icon: 'mdi-apps',
					title: 'All Apps',
					to: '/allapps'
				},
				{
					icon: 'mdi-account',
					title: 'Player Select',
					to: '/playerselect'
				}
			]
		}
	}
})
</script>

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
		background-image: url('/images/drawer_backgrounds/animalcrossing.png');
		overflow: hidden;
	}
}

.navbar {
	user-select: none;
}
</style>
