<template>
	<v-snackbar
		v-model="snackbar"
		bottom
		:timeout="8000"
		:color="error ? 'error' : 'green darken-1'"
	>
		{{ error || message }}
	</v-snackbar>
</template>

<script>
export default {
	data() {
		return {
			snackbar: false
		}
	},
	computed: {
		message() {
			return this.$store.state.snackbar
				? this.$store.state.snackbar.message
				: null
		},
		error() {
			return this.$store.state.snackbar
				? this.$store.state.snackbar.error
				: null
		}
	},
	watch: {
		message(n) {
			if (n && n !== '') this.snackbar = true
		},
		error(n) {
			if (n && n !== '') this.snackbar = true
		}
	}
}
</script>
