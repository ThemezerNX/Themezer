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
			<ItemCard :item="layout" :type="type" />
		</v-col>
	</v-row>
	<LoadingOverlay v-else-if="$apollo.loading" />
	<span v-else>There are no layouts here yet :(</span>
</template>

<script>
import Vue from 'vue'
import { layoutsList } from '@/graphql/Layout.gql'
import ItemCard from '@/components/ItemCard.vue'
import targetParser from '@/layouts/mixins/targetParser'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default Vue.extend({
	components: {
		ItemCard,
		LoadingOverlay
	},
	mixins: [targetParser],
	data() {
		return {
			type: 'layouts'
		}
	},
	apollo: {
		layoutsList: {
			query: layoutsList,
			variables() {
				return {
					target: this.$route.params.target
				}
			},
			prefetch: true
		}
	},
	head() {
		return {
			title: `${this.targetName} | Layouts`
		}
	}
})
</script>
