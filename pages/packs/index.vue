<template>
	<v-row>
		<v-col class="py-0">
			<v-row v-if="packsList && packsList.length > 0">
				<v-col
					v-for="pack in packsList"
					:key="pack.uuid"
					cols="12"
					xs="12"
					sm="6"
					md="4"
					xl="3"
				>
					<PackCard :item="pack" />
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
import { packsList } from '@/graphql/Pack.gql'
import targetParser from '@/components/mixins/targetParser'
import PackCard from '@/components/PackCard.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default Vue.extend({
	components: {
		PackCard,
		LoadingOverlay
	},
	mixins: [targetParser],
	apollo: {
		packsList: {
			query: packsList,
			variables() {
				return {
					target: this.$route.params.target
				}
			},
			prefetch: true
		}
	},
	head() {
		const title = 'Packs'
		const desc = 'All Packs on Themezer'

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
