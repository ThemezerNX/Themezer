<template>
	<v-row>
		<v-col cols="12" xs="12" sm="4" md="3" xl="2">
			<Filters ref="filter" :unsupported-filters="unsupportedFilters" />
		</v-col>
		<v-col cols="12" xs="12" sm="8" md="9" xl="10">
			<h3 v-if="filteredItems">{{ filteredItems.length }} results</h3>
			<v-row v-if="paginatedData && paginatedData.length > 0">
				<v-col
					v-for="theme in paginatedData"
					:key="theme.uuid"
					cols="12"
					xs="12"
					sm="6"
					md="4"
					xl="3"
				>
					<ItemCard :item="theme" :type="type" />
				</v-col>
			</v-row>

			<LoadingOverlay v-else-if="$apollo.loading || filterLoading" />
			<span v-else-if="!(layoutsList && layoutsList.length > 0)"
				>There are no themes here yet :(</span
			>
			<span v-else-if="filteredItems && filteredItems.length === 0"
				>There were no results matching your filters :(</span
			>
			<paginate
				v-model="currentPageNumber"
				container-class="pagination-container"
				:no-li-surround="true"
				break-view-link-class="hidden"
				page-link-class="button--pagination"
				:page-count="pageCount"
				:page-range="5"
				:click-handler="paginationEvent"
				prev-text
				next-text
				page-class="page-item"
			>
				<span slot="breakViewContent"></span>
			</paginate>
		</v-col>
	</v-row>
</template>

<script>
import Vue from 'vue'
import { layoutsList } from '@/graphql/Layout.gql'
import ItemCard from '@/components/ItemCard.vue'
import targetParser from '@/components/mixins/targetParser'
import filter from '@/components/mixins/filter'
import Filters from '@/components/Filters.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default Vue.extend({
	components: {
		ItemCard,
		Filters,
		LoadingOverlay
	},
	mixins: [targetParser, filter],
	data() {
		return {
			type: 'layouts',
			list: 'layoutsList',
			unsupportedFilters: ['nsfw']
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

<style lang="scss">
@import '@/assets/paginate.scss';
</style>
