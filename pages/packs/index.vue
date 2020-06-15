<template>
	<v-row>
		<v-col cols="12" xs="12" sm="4" md="3" xl="2">
			<Filters ref="filter" :unsupported-filters="unsupportedFilters" />
		</v-col>
		<v-col cols="12" xs="12" sm="8" md="9" xl="10">
			<h3 v-if="filteredItems">{{ filteredItems.length }} results</h3>
			<v-row v-if="paginatedData && paginatedData.length > 0">
				<v-col
					v-for="pack in paginatedData"
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

			<LoadingOverlay v-else-if="$apollo.loading || filterLoading" />
			<span v-else-if="!(packsList && packsList.length > 0)"
				>There are no packs here yet :(</span
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
import { packsList } from '@/graphql/Pack.gql'
import PackCard from '@/components/PackCard.vue'
import targetParser from '@/components/mixins/targetParser'
import filter from '@/components/mixins/filter'
import Filters from '@/components/Filters.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default Vue.extend({
	components: {
		PackCard,
		Filters,
		LoadingOverlay
	},
	mixins: [targetParser, filter],
	data() {
		return {
			metaTitle: 'Packs',
			metaDesc: 'All Packs on Themezer',
			list: 'packsList',
			unsupportedFilters: []
		}
	},
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
	}
})
</script>

<style lang="scss">
@import '@/assets/paginate.scss';
</style>
