<template>
	<error v-if="error" :error="error" />
	<v-container
		v-else
		:fluid="$vuetify.breakpoint.smAndDown"
		style="height: 100%;"
	>
		<v-row>
			<v-col cols="12" xs="12" sm="4" md="3" xl="2">
				<h2 class="text-center">{{ targetName() }} Layouts</h2>
				<Filters
					ref="filter"
					:unsupported-filters="unsupportedFilters"
				/>
			</v-col>
			<v-col ref="top" cols="12" xs="12" sm="8" md="9" xl="10">
				<LoadingOverlay :loading="$apollo.loading">
					<div v-if="itemList && itemList.pagination">
						<h3>
							{{ itemList.pagination.item_count }}
							{{
								itemList.pagination.item_count === 1
									? 'result'
									: 'results'
							}}
						</h3>
						<v-divider />
					</div>

					<v-row
						v-if="
							itemList &&
								itemList.layoutList &&
								itemList.layoutList.length > 0
						"
					>
						<v-col
							v-for="layout in itemList.layoutList"
							:key="layout.id"
							cols="12"
							xs="12"
							sm="6"
							md="4"
							xl="3"
						>
							<ItemCard
								:item="layout"
								:type="type"
								:show-props="['creator', 'description']"
							/>
						</v-col>
					</v-row>

					<span v-else>There were no results</span>
					<paginate
						v-model="pageNumber"
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
				</LoadingOverlay>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import Vue from 'vue'
import errorHandler from '@/components/mixins/errorHandler'
import { layoutList, allCreators } from '@/graphql/Layout.gql'
import targetParser from '@/components/mixins/targetParser'
import filter from '@/components/mixins/filter'
import allowedTargets from '@/components/mixins/allowedTargets'

export default Vue.extend({
	components: {
		Filters: () => import('@/components/Filters.vue'),
		ItemCard: () => import('@/components/ItemCard.vue'),
		LoadingOverlay: () => import('@/components/LoadingOverlay.vue')
	},
	mixins: [errorHandler, targetParser, filter],
	data() {
		return {
			type: 'layouts',
			list: 'layoutList',
			unsupportedFilters: ['nsfw', 'withLayouts'],
			allCreatorsQuery: allCreators
		}
	},
	apollo: {
		itemList: {
			query: layoutList,
			variables() {
				const vars = {
					q: 'layoutList',
					target: this.targetFile(),
					limit: 18,
					page: this.currentPage,
					query: this.currentSearch,
					sort: this.currentSort,
					order: this.currentOrder,
					creators: this.currentCreators
				}
				vars.hash = this.$hashString(vars)
				return vars
			},
			update(data) {
				return data
			},
			error(e) {
				this.error = e
			},
			prefetch: true
		}
	},
	beforeRouteEnter(to, _from, next) {
		if (allowedTargets.includes(to.params.target)) {
			next()
		} else {
			next('/')
		}
	},
	head() {
		// eslint-disable-next-line camelcase
		const resultAmount = this.itemList?.pagination?.item_count

		const metaTitle =
			resultAmount !== undefined
				? `${resultAmount} ${
						resultAmount === 1 ? 'result' : 'results'
				  } | ${this.targetName()} | Layouts`
				: `${this.targetName()} | Layouts`

		const metaDesc = 'Layouts on Themezer'

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
