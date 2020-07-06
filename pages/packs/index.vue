<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<v-row>
			<v-col cols="12" xs="12" sm="4" md="3" xl="2">
				<Filters
					ref="filter"
					:unsupported-filters="unsupportedFilters"
				/>
			</v-col>
			<v-col cols="12" xs="12" sm="8" md="9" xl="10">
				<div v-if="filteredItems">
					<h3>{{ filteredItems.length }} results</h3>
					<v-divider />
				</div>

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
				<span v-else-if="!packsList || packsList.length === 0"
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
	</v-container>
</template>

<script>
import Vue from 'vue'
import { packsList } from '@/graphql/Pack.gql'
import targetParser from '@/components/mixins/targetParser'
import filter from '@/components/mixins/filter'

export default Vue.extend({
	mixins: [targetParser, filter],
	data() {
		return {
			list: 'packsList',
			unsupportedFilters: []
		}
	},
	apollo: {
		packsList: {
			query: packsList,
			prefetch: true
		}
	},
	head() {
		const metaTitle = this.filteredItems
			? `${this.filteredItems.length} ${
					this.filteredItems.length === 1 ? 'result' : 'results'
			  } | Packs`
			: `Packs`

		const metaDesc =
			this.packsList &&
			this.filteredItems &&
			this.filteredItems.length !== this.packsList.length
				? 'Filtered Packs on Themezer'
				: 'All Packs on Themezer'

		const metaImg = null

		return {
			title: metaTitle,
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: metaDesc
				},
				{
					hid: 'og:title',
					name: 'og:title',
					property: 'og:title',
					content: metaTitle
				},
				{
					hid: 'og:description',
					name: 'og:description',
					property: 'og:description',
					content: metaDesc
				},
				{
					hid: 'og:image',
					name: 'og:image',
					property: 'og:image',
					content: metaImg
				}
			]
		}
	}
})
</script>

<style lang="scss">
@import '@/assets/paginate.scss';
</style>
