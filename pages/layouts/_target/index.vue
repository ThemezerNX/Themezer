<template>
	<v-row>
		<v-col class="py-0">
			<v-row v-if="layoutsList && layoutsList.length > 0">
				<v-col
					v-for="layout in layoutsList"
					:key="layout.uuid"
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
			<span v-else-if="!(themesList && themesList.length > 0)"
				>There are no themes here yet :(</span
			>
		</v-col>
	</v-row>
</template>

<script>
import Vue from 'vue'
import { layoutsList } from '@/graphql/Layout.gql'
import ItemCard from '@/components/ItemCard.vue'
import targetParser from '@/components/mixins/targetParser'
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
		const title = `${this.targetName} | Layouts`
		const desc = 'All Layouts on Themezer'

		return {
			title,
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: desc
				},
				{
					hid: 'og:title',
					name: 'og:title',
					property: 'og:title',
					content: title
				},
				{
					hid: 'og:description',
					name: 'og:description',
					property: 'og:description',
					content: desc
				}
			]
		}
	}
})
</script>
