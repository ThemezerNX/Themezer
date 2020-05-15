<template v-for="folder in folders">
	<div>
		<FloatingPreview />
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import LayoutQueries from '@/graphql/Layout.gql'
import FloatingPreview from '@/components/FloatingPreview.vue'

interface response {
	data: {
		title: String
		author: String
		description: String
		overlayUrl: String
	}
}

export default Vue.extend({
	components: {
		FloatingPreview
	},
	data() {
		return {
			folders: [{}],
			menu: this.$route.params.menu,
			layoutDetails
		}
	},
	created() {
		this.$apollo
			.query({
				query: queries.movie,
				variables: {
					traktID: this.traktID
				}
			})
			.then((response: response) => {
				this.layoutDetails = response.data
			})
			.catch((error: String) => this.parseError(error))
	},
	methods: {
		parseError(error: String) {
			const parsedError = JSON.parse(JSON.stringify(error))
			if (
				parsedError.graphQLErrors &&
				parsedError.graphQLErrors.length > 0 &&
				parsedError.graphQLErrors[0].message
			) {
				this.error = parsedError.graphQLErrors[0].message
			} else {
				this.error = error.message
					.toString()
					.replace('GraphQL error: ', '')
			}
		}
	}
})
</script>
