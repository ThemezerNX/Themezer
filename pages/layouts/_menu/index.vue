<template>
	<v-row v-if="layoutsList && layoutsList.length > 0">
		<v-col
			v-for="layout in layoutsList"
			:key="layout.uuid"
			class=""
			cols="12"
			xs="12"
			sm="6"
			md="4"
			xl="3"
		>
			<LayoutCard :layout-details="layout.details" />
		</v-col>
	</v-row>
	<LoadingOverlay v-else-if="$apollo.loading" />
	<span v-else="">There's nothing here :(</span>
</template>

<script>
import Vue from 'vue'
import LayoutQueries from '@/graphql/Layout.gql'
import LayoutCard from '@/components/LayoutCard.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default Vue.extend({
	components: {
		LayoutCard,
		LoadingOverlay
	},
	apollo: {
		layoutsList: {
			query: LayoutQueries.layoutsList,
			variables() {
				return {
					menu: this.$route.params.menu
				}
			},
			prefetch: true
		}
	}
})
</script>
