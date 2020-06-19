<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<div v-show="isCallback">
			<v-alert color="info">
				You are now logged in!
			</v-alert>
			<LoadingOverlay />
		</div>
	</v-container>
</template>

<script>
import Vue from 'vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default Vue.extend({
	middleware: ['auth'],
	options: {
		auth: true
	},
	components: {
		LoadingOverlay
	},
	computed: {
		isCallback() {
			return Boolean(this.$route.hash)
		}
	},
	created() {
		if (!this.isCallback) {
			this.$router.push('/')
		}
	}
})
</script>
