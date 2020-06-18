<template>
	<div />
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	middleware: ['auth'],
	data() {
		return {
			error: null
		}
	},
	computed: {
		redirect() {
			return (
				this.$route.query.redirect &&
				decodeURIComponent(this.$route.query.redirect)
			)
		},
		isCallback() {
			return Boolean(this.$route.query.callback)
		}
	},
	mounted() {
		this.login()
	},
	methods: {
		login() {
			this.error = null
			return this.$auth.loginWith('social').catch((e) => {
				this.error = e.response.data
			})
		}
	}
})
</script>
