<template>
	<div>
		<v-alert color="info">
			You have been logged out!
		</v-alert>
	</div>
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
