<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<div>
			<v-alert color="info">
				You have been logged out!
			</v-alert>
		</div>
	</v-container>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	mounted() {
		setTimeout(() => {
			this.$router.push('/')
		}, 2000)
	}
})
</script>
