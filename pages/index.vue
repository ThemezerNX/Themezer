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
				<v-img
					class="d-block my-1"
					height="200"
					width="auto"
					src="/icon-256.png"
					contain
				/>
				<h1 v-if="$auth.loggedIn" class="text-center intro-title">
					Welcome back {{ $auth.user.username }}!
				</h1>
				<h1 v-else class="text-center intro-title">
					Welcome to Themezer!
				</h1>
				<v-container class="pt-0" style="height: 100%;" fluid>
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
								Latest Layouts
							</h2>
							<v-divider />
							<LayoutsSlideGroup
								:items="layoutsList"
								:show-props="['creator']"
							/>
						</v-col>
					</v-row>
				</v-container>
			</v-layout>
		</div>
	</v-container>
</template>

<script>
import Vue from 'vue'
import { rowPacksList } from '@/graphql/Pack.gql'
import { rowThemesList } from '@/graphql/Theme.gql'
import { rowLayoutsList } from '@/graphql/Layout.gql'
import PacksSlideGroup from '@/components/PacksSlideGroup'
import ThemesSlideGroup from '@/components/ThemesSlideGroup'
import LayoutsSlideGroup from '@/components/LayoutsSlideGroup'
import error from '@/layouts/error'

export default Vue.extend({
	components: {
		PacksSlideGroup,
		ThemesSlideGroup,
		LayoutsSlideGroup,
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
.parallax {
	position: fixed;
	height: 100%;
	width: 100%;
}

.content {
	background: linear-gradient(135deg, #b40a86, #0ab379);
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
