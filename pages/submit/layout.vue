<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<v-sheet no-gutters class="pa-2 box">
			<h1 class="box_text">
				Layout Submissions
			</h1>
			<div class="subtitle-1 box_text">
				You can submit layouts to the Themezer Layouts GitHub
				repository. See the
				<a
					href="https://github.com/ThemezerNX/Layouts/blob/master/README.md"
				>
					README.md
				</a>
				for instructions.
			</div>
			<v-flex class="d-flex justify-center my-3">
				<v-btn
					color="primary"
					rounded
					class="mx-2"
					router
					href="https://github.com/ThemezerNX/Layouts"
					target="_blank"
				>
					Go to GitHub <v-icon right>mdi-github</v-icon>
				</v-btn>
			</v-flex>
		</v-sheet>
	</v-container>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	head() {
		const metaTitle = 'Layout | Submit'
		const metaDesc =
			'You can submit layouts to the Themezer Layouts GitHub repository.'
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
