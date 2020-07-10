<template>
	<v-container fluid class="pa-0 content" style="height: 100%;">
		<error v-if="error" :error="error" />
		<div v-else>
			<!-- <v-parallax
				class="d-flex align-center justify-center parallax"
				height="100%"
				src="https://res.cloudinary.com/rebelwalls/image/upload/b_black,c_fill,f_auto,fl_progressive,h_533,q_auto,w_800/v1479371023/article/R10961_image1"
			/> -->
			<v-layout column justify-center>
				<v-container class="pt-0" style="height: 100%;" fluid>
					<v-img
						class="d-block my-1"
						height="200"
						width="auto"
						src="/icon-256.png"
						style="-webkit-filter: drop-shadow(0px 0px 10px rgb(255 255 255 / 10%));"
						contain
					/>
					<h1 v-if="$auth.loggedIn" class="text-center intro-title">
						Welcome back {{ $auth.user.username }}!
					</h1>
					<h1 v-else class="text-center intro-title">
						Welcome to Themezer!
					</h1>
					<v-row
						v-if="packsList && packsList.length > 0"
						align="center"
						justify="center"
					>
						<v-col cols="12" class="pt-0">
							<h2>
								Latest Packs
							</h2>
							<v-divider />
							<PacksSlideGroup
								:items="packsList"
								:show-props="['creator']"
							/>
						</v-col>
					</v-row>
					<v-row
						v-if="themesList && themesList.length > 0"
						align="center"
						justify="center"
					>
						<v-col cols="12" class="pt-0">
							<h2>
								Latest Themes
							</h2>
							<v-divider />
							<ThemesSlideGroup
								:items="themesList"
								:show-props="['creator']"
							/>
						</v-col>
					</v-row>
					<v-row
						v-if="layoutsList && layoutsList.length > 0"
						align="center"
						justify="center"
					>
						<v-col cols="12" class="pt-0">
							<h2>
								Latest Updated Layouts
							</h2>
							<v-divider />
							<LayoutsSlideGroup
								:items="layoutsList"
								:show-props="['creator']"
							/>
						</v-col>
					</v-row>
				</v-container>
				<div class="circle-1 primary" />
				<div class="circle-2 secondary" />
			</v-layout>
		</div>
	</v-container>
</template>

<script>
import Vue from 'vue'
import { rowPacksList } from '@/graphql/Pack.gql'
import { rowThemesList } from '@/graphql/Theme.gql'
import { rowLayoutsList } from '@/graphql/Layout.gql'
import error from '@/layouts/error.vue'

export default Vue.extend({
	components: {
		error
	},
	data() {
		return {
			error: null
		}
	},
	apollo: {
		packsList: {
			query: rowPacksList,
			variables() {
				return {
					limit: 10
				}
			},
			error(e) {
				this.error = e
			},
			prefetch: true
		},
		themesList: {
			query: rowThemesList,
			variables() {
				return {
					limit: 10
				}
			},
			error(e) {
				this.error = e
			},
			prefetch: true
		},
		layoutsList: {
			query: rowLayoutsList,
			variables() {
				return {
					limit: 10
				}
			},
			error(e) {
				this.error = e
			},
			prefetch: true
		}
	},
	head() {
		const metaTitle = 'Themezer Home'
		const metaDesc =
			'A customization site for Nintendo Switch Themes and Layouts.'
		const metaImg = null

		return {
			title: metaTitle,
			meta: [
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
})
</script>

<style lang="scss" scoped>
.container {
	z-index: 1;
}

.circle-1 {
	border-radius: 50%;
	position: fixed;
	min-height: 300px;
	height: 65vw;
	min-width: 300px;
	width: 65vw;
	opacity: 0.85;
	top: 80vh;
	left: -15vw;
}

.circle-2 {
	border-radius: 50%;
	position: fixed;
	min-height: 200px;
	height: 15vw;
	min-width: 200px;
	width: 15vw;
	top: -10vh;
	opacity: 0.7;
	right: -2vw;
}

.parallax {
	position: fixed;
	height: 100%;
	width: 100%;
}

.content {
	// background: linear-gradient(0deg, #b40a86, #0ab379);
	z-index: 5;
}
</style>

<style lang="scss">
.intro-title {
	animation: tracking-in-expand 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) both;
	animation-delay: 700ms;
}

@keyframes tracking-in-expand {
	0% {
		letter-spacing: -0.5em;
		opacity: 0;
	}
	40% {
		opacity: 0.6;
	}
	100% {
		opacity: 1;
	}
}
</style>
