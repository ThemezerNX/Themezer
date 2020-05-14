<template>
	<v-app dark>
		<h1 v-if="error.statusCode === 404">
			{{ pageNotFound }}
		</h1>
		<h1 v-else>
			{{ otherError }}
		</h1>
		<a @click="$router.go(-1)">
			Go Back
		</a>
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

<style scoped>
h1 {
	font-size: 20px;
}
</style>
