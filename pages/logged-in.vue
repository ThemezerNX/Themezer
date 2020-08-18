<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<LoadingOverlay :shadow="false">
			<div v-show="!isCallback">
				<v-alert style="z-index: 5;" color="info">
					You are now logged in!
				</v-alert>
			</div>
		</LoadingOverlay>
	</v-container>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	components: {
		LoadingOverlay: () => import('@/components/LoadingOverlay.vue')
	},
	middleware: ['auth'],
	options: {
		auth: true
	},
	computed: {
		isCallback() {
			return Boolean(
				this.$route.hash && this.$route.hash.includes('access_token')
			)
		}
	},
	created() {
		if (!this.isCallback) {
			this.$router.push('/')
		}
	}
})
</script>
