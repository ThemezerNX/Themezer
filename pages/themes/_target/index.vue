<template>
	<v-row>
		<v-col cols="12" xs="12" sm="4" md="3" xl="2">
			<Filters ref="filter" />
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
			<span v-else-if="!(themesList && themesList.length > 0)"
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

<script lang="js">
import Vue from 'vue'
import { themesList } from '@/graphql/Theme.gql'
import targetParser from '@/components/mixins/targetParser'
import ItemCard from '@/components/ItemCard.vue'
import Filters from '@/components/Filters.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default Vue.extend({
	components: {
		ItemCard,
		Filters,
		LoadingOverlay
	},
	mixins: [targetParser],
	data() {
		return {
			type: 'themes',
			filteredItems: null,
			filterLoading: true,
			itemsPerPage: 12
		}
	},
	apollo: {
		themesList: {
			query: themesList,
			variables() {
				return {
					target: this.$route.params.target
				}
			},
			prefetch: true
		}
	},
	computed: {
		pageCount() {
			if (this.filteredItems) {
				const length = this.filteredItems.length;
				const size = this.$data.itemsPerPage;

				return Math.ceil(length / size);
			} else return null
		},
		currentPageNumber() {
			return this.$route.query.page &&
				parseInt(this.$route.query.page) > 0
				? parseInt(this.$route.query.page)
				: undefined || 1
		},
		paginatedData() {
			if (this.filteredItems) {
				const start = (this.currentPageNumber - 1) * this.itemsPerPage;
				const end = start + this.itemsPerPage;

				return this.filteredItems.slice(start, end);
			} else return null
		}
	},
	mounted() {
		if (parseInt(this.currentPageNumber) > this.pageCount) {
			this.$router.push({
				query: {
					page: undefined,
					query: this.$route.query.query,
					sort: this.$route.query.sort,
					order: this.$route.query.order
				}
			});
		}
	},
	methods: {
		paginationEvent(n){
			this.$router.push({
				query: {
					page: n,
					query: this.$route.query.query,
					sort: this.$route.query.sort,
					order: this.$route.query.order
				}
			});
		}
	},
	head() {
		const title = `${this.targetName} | Themes`
		const desc = 'All Themes on Themezer'

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
