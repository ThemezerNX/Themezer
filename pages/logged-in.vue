<template>
	<div v-show="isCallback">
		<v-alert color="info">
			You are now logged in!
		</v-alert>
		<LoadingOverlay />
	</div>
</template>

<script>
import Vue from 'vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default Vue.extend({
	components: {
		LoadingOverlay
	},
	computed: {
		isCallback() {
			return Boolean(this.$route.hash)
		}
	},
	mounted() {
		if (!this.isCallback) {
			this.$router.push('/')
		}
	}
})
</script>
