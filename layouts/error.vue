<template>
	<v-app style="background: transparent;">
		<v-container
			:fluid="$vuetify.breakpoint.smAndDown"
			style="height: 100%;"
		>
			<h2>
				Uh oh!
			</h2>
			<h1 class="mb-4">
				{{ title }}
			</h1>
			<v-btn rounded color="secondary" @click="$router.go(-1)">
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
	computed: {
		title() {
			return (
				this.error.message.replace('GraphQL error: ', '') ||
				(this.error.statusCode === 404
					? this.pageNotFound
					: this.otherError)
			)
		}
	},
	head() {
		return {
			title: this.title
		}
	}
}
</script>
