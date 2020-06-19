<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<v-layout column justify-center align-center>
			<v-flex xs12 sm8 md6>
				<v-card>
					<v-card-title class="headline">
						Welcome to the Vuetify + Nuxt.js
					</v-card-title>
					<v-card-text>
						<p>
							Vuetify is a progressive Material Design component
							framework for Vue.js. It was designed to empower
							developers to create amazing applications.
						</p>
						<p>
							For more information on Vuetify, check out the
							<a href="https://vuetifyjs.com" target="_blank">
								documentation </a
							>.
						</p>
						<p>
							If you have questions, please join the official
							<a
								href="https://chat.vuetifyjs.com/"
								target="_blank"
								title="chat"
							>
								discord </a
							>.
						</p>
						<p>
							Find a bug? Report it on the github
							<a
								href="https://github.com/vuetifyjs/vuetify/issues"
								target="_blank"
								title="contribute"
							>
								issue board </a
							>.
						</p>
						<p>
							Thank you for developing with Vuetify and I look
							forward to bringing more exciting features in the
							future.
						</p>
						<div class="text-xs-right">
							<em><small>&mdash; John Leider</small></em>
						</div>
						<hr class="my-3" />
						<a href="https://nuxtjs.org/" target="_blank">
							Nuxt Documentation
						</a>
						<br />
						<a
							href="https://github.com/nuxt/nuxt.js"
							target="_blank"
						>
							Nuxt GitHub
						</a>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
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
