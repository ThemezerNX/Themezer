<template>
	<CreatorPage
		:id="$route.params.id"
		ref="CreatorPage"
		:is-page-owner="true"
	/>
</template>

<script>
import Vue from 'vue'
import CreatorPage from '@/components/CreatorPage'

export default Vue.extend({
	components: {
		CreatorPage
	},
	beforeRouteEnter(to, _from, next) {
		if (to.params.id) {
			next()
		} else {
			next('/')
		}
	},
	beforeRouteLeave(_to, _from, next) {
		if (this.$refs.CreatorPage && this.$refs.CreatorPage.changes) {
			const answer = window.confirm(
				'Do you really want to leave? you have unsaved changes!'
			)
			if (answer) {
				next()
			} else {
				next(false)
			}
		} else next()
	}
})
</script>
