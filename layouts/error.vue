<template>
	<v-app style="background: transparent;">
		<v-container
			:fluid="$vuetify.breakpoint.smAndDown"
			style="height: 100%;"
		>
			<h2>
				Uh oh!
			</h2>
			<h1 v-if="error.statusCode === 404">
				{{ pageNotFound }}
			</h1>
			<h1 v-else>
				{{ otherError }}
			</h1>
			<v-btn color="secondary" @click="$router.go(-1)">
				Go Back
			</v-btn>
		</v-container>
	</v-app>
</template>

<script>
export default {
	layout: 'empty',
	props: {
		error: {
			type: Object,
			default: null
		}
	},
	data() {
		return {
			pageNotFound: '404 Not Found',
			otherError: 'An error occurred'
		}
	},
	head() {
		const title =
			this.error.statusCode === 404 ? this.pageNotFound : this.otherError
		return {
			title
		}
	}
}
</script>
