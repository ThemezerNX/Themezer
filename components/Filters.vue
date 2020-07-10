<template>
	<v-card
		class="ma-auto"
		router
		exact
		:style="
			`border: rgba(255, 255, 255, 0.12) solid 2px; border-radius: 10px;`
		"
	>
		<div class="group">
			<v-card-title class="title">
				Search
			</v-card-title>

			<v-card-actions class="mx-2">
				<v-text-field
					v-model="query"
					rounded
					label="Search in everything"
					dense
					single-line
					outlined
					hide-details
				></v-text-field>
			</v-card-actions>
		</div>

		<div class="group">
			<v-card-title class="title">
				Sort by
			</v-card-title>

			<v-card-actions class="link-group mx-2">
				<nuxt-link
					v-for="(option, i) in sortOptions"
					:key="i"
					class="sort-item"
					:class="{
						'nuxt-link-exact-active': currentSort === option.id,
						asc: currentSortOrder === 'asc',
						desc: currentSortOrder === 'desc'
					}"
					:to="{
						query: {
							page: '1',
							query: currentSearch,
							sort: option.id,
							order: nextSortOrder(option.id)
						}
					}"
				>
					<v-icon
						:color="
							currentSortOrder === 'asc' &&
							currentSort === option.id
								? '#1e1e1e'
								: 'white'
						"
					>
						{{ option.icon }}
					</v-icon>
					{{ option.title }}
					<span v-show="currentSort === option.id" class="order">
						<v-icon
							:color="
								currentSortOrder === 'asc' ? '#1e1e1e' : 'white'
							"
						>
							mdi-arrow-up
						</v-icon>
					</span>
				</nuxt-link>
			</v-card-actions>
		</div>

		<div v-if="!unsupportedFilters.includes('filters')" class="group">
			<v-card-title class="title">
				Filters
			</v-card-title>

			<v-card-actions v-if="!unsupportedFilters.includes('nsfw')">
				<v-checkbox
					v-model="nsfw"
					class="ma-0 mx-2"
					label="Show NSFW"
					color="red"
					hide-details
				></v-checkbox>
			</v-card-actions>
		</div>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import MiniSearch from 'minisearch'

export default Vue.extend({
	props: {
		unsupportedFilters: {
			type: Array,
			required: true,
			default: null
		}
	},
	data() {
		return {
			sortOptions: [
				{
					title: 'Downloads',
					id: 'downloads',
					key: 'dl_count',
					icon: 'mdi-download-outline'
				},
				{
					title: 'Likes',
					id: 'likes',
					key: 'like_count',
					icon: 'mdi-heart'
				},
				{
					title: 'Updated',
					id: 'updated',
					key: 'last_updated',
					icon: 'mdi-calendar-clock'
				}
			],
			filterCooldownActive: false,
			query: '',
			nsfw: false
		}
	},
	computed: {
		currentSearch(): string | undefined {
			return this.$route.query.query
				? (this.$route.query.query as string)
				: undefined
		},
		currentSort(): string {
			return this.$route.query.sort
				? (this.$route.query.sort as string)
				: 'downloads'
		},
		currentSortOrder(): string {
			return this.$route.query.order
				? (this.$route.query.order as string)
				: 'desc'
		},
		filteredItems(): Array<object> {
			// eslint-disable-next-line vue/no-side-effects-in-computed-properties
			let items: any = null
			// eslint-disable-next-line vue/no-side-effects-in-computed-properties
			this.$parent.$data.filterLoading = true

			items = this.$parent.$data[this.$parent.$data.list]

			if (items) {
				if (this.$data.query) {
					const miniSearch = new MiniSearch({
						fields: [
							'name',
							'description',
							'creator_name',
							'creator_discord',
							'categories'
						],
						storeFields: ['id'],
						searchOptions: {
							boost: { name: 2 },
							fuzzy: 0.2
						}
					})
					const itms = items.map((item: any) => {
						return {
							id: item.uuid,
							name: item.details.name,
							description: item.details.name,
							creator_name: item.creator.discord_user.username,
							creator_discord:
								'#' + item.creator.discord_user.discriminator,
							categories: item.categories
								? item.categories.join('|')
								: ''
						}
					})

					miniSearch.addAll(itms)
					const rs = miniSearch.search(this.$data.query, {
						prefix: true
					})
					const resultUUIDs = rs.map((r: any) => r.id)

					items = items.filter((item: any) =>
						resultUUIDs.includes(item.uuid)
					)
				}

				items = items
					.filter((item: any): boolean => {
						if (
							!this.unsupportedFilters.includes('filters') ||
							!this.unsupportedFilters.includes('nsfw')
						) {
							return this.nsfw
								? true
								: !(
										Array.isArray(item.categories) &&
										item.categories.includes('NSFW')
								  )
						} else return true
					})
					.sort((a: any, b: any) => {
						const sortOption = this.$data.sortOptions.find(
							(o: any) => o.id === this.currentSort
						)
						if (
							sortOption.id === 'downloads' ||
							sortOption.id === 'likes'
						) {
							if (this.currentSortOrder === 'asc') {
								return a[sortOption.key] - b[sortOption.key]
							} else if (this.currentSortOrder === 'desc') {
								return b[sortOption.key] - a[sortOption.key]
							}
						} else if (sortOption.id === 'updated') {
							if (this.currentSortOrder === 'asc') {
								return (
									new Date(a[sortOption.key]).getTime() -
									new Date(b[sortOption.key]).getTime()
								)
							} else if (this.currentSortOrder === 'desc') {
								return (
									new Date(b[sortOption.key]).getTime() -
									new Date(a[sortOption.key]).getTime()
								)
							}
						}
					})
			}
			// eslint-disable-next-line vue/no-side-effects-in-computed-properties
			this.$parent.$data.filterLoading = false

			return items || this.$parent.$data.filteredItems
		}
	},
	watch: {
		filteredItems() {
			this.updateParentFiltered()
		},
		query(n) {
			const query = Object.assign({}, this.$route.query)
			delete query.page
			if (n === '') delete query.query
			else query.query = n

			this.$router.push({
				query
			})
		}
	},
	mounted() {
		this.$data.query = this.$route.query.query || ''
		this.updateParentFiltered()
	},
	methods: {
		updateParentFiltered() {
			this.$parent.$data.filteredItems = this.filteredItems
		},
		nextSortOrder(type: string): string | null {
			if (this.currentSort === type) {
				if (this.currentSortOrder === 'asc') {
					return 'desc'
				} else if (this.currentSortOrder === 'desc') {
					return 'asc'
				} else return null
			} else return 'desc'
		}
	}
})
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.group:first-of-type {
	padding-top: 16px;
}

.group:last-of-type {
	padding-bottom: 16px;
}

.group > .title {
	padding-top: 0;
	padding-bottom: 0;
}

.link-group {
	display: grid;
}

.sort-item {
	width: 100%;
	position: relative;
	font-weight: 600;
	font-size: 0.95em;
	text-decoration: none;
	padding: 6px 12px;
	margin: 4px 0;
	border-radius: 100px;
	border: 1px solid rgba(255, 255, 255, 0.08);
	color: rgba(255, 255, 255, 0.8);

	transition: all 200ms ease;

	&:hover {
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: rgba(255, 255, 255, 0.6);
		background-color: transparentize(rgba(255, 255, 255, 0.2), 0.9);
	}

	&.nuxt-link-exact-active.asc,
	&.router-link-exact-active.asc {
		border: 1px solid darken($themezer-primary, 5%);
		background-color: darken($themezer-primary, 2%);
		color: #1e1e1e;
		.order {
			transform: unset;
		}
	}

	&.nuxt-link-exact-active.desc,
	&.router-link-exact-active.desc {
		border: 1px solid darken($themezer-secondary, 5%);
		background-color: darken($themezer-secondary, 2%);
		color: white;
		.order {
			transform: rotateZ(180deg);
		}
	}
	.order {
		right: 0;
		transition: transform 200ms ease;
		position: absolute;
		margin-right: 6px;
	}
}
</style>
