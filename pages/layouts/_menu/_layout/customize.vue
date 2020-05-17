<template>
	<div><FloatingPreview /></div>
</template>

<script>
import Vue from 'vue'
import LayoutQueries from '@/graphql/Layout.gql'
import FloatingPreview from '@/components/FloatingPreview.vue'

export default Vue.extend({
	components: {
		FloatingPreview
	},
	apollo: {
		layout: {
			query: LayoutQueries.layout,
			variables() {
				return {
					name: this.$route.params.layout,
					menu: this.$route.params.menu
				}
			},
			prefetch: true
		}
	}
})
</script>
