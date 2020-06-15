<template>
	<div no-gutters class="pa-2 box_fit">
		<h1 class="box_text">
			Layout Submissions
		</h1>
		<div class="subtitle-1 box_text">
			You can submit layouts to the Themezer Layouts GitHub repository.
			See the
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
				class="mx-2"
				append
				router
				href="https://github.com/ThemezerNX/Layouts"
				target="_blank"
			>
				Go to GitHub <v-icon right>mdi-github</v-icon>
			</v-btn>
		</v-flex>
	</div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	data() {
		return {
			metaTitle: 'Layout | Submit',
			metaDesc:
				'You can submit layouts to the Themezer Layouts GitHub repository.'
		}
	}
})
</script>
