<template>
	<v-card
		class="ma-auto"
		router
		exact
		:style="`border: rgba(255, 255, 255, 0.12) solid 2px;`"
	>
		<div class="group">
			<v-card-title class="title">
				Search
			</v-card-title>

			<v-card-actions>
				<v-text-field
					v-model="query"
					label="Query"
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

			<v-card-actions class="link-group">
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
							page:
								currentSort === option.id
									? $route.query.page
									: undefined,
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

		<div class="group">
			<v-card-title class="title">
				Filters
			</v-card-title>

			<v-card-actions>
				<v-checkbox
					v-model="nsfw"
					class="ma-0"
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

export default Vue.extend({
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
					title: 'Updated',
					id: 'updated',
					key: 'last_modified',
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
			let items = null
			if (!this.filterCooldownActive) {
				// eslint-disable-next-line vue/no-side-effects-in-computed-properties
				this.filterCooldownActive = true
				;(this.$parent as any).filterLoading = true

				items = (this.$parent as any).themesList

				if (items) {
					items = items
						.filter((item: any): boolean => {
							if (this.query) {
								return this.containsQuery(item)
							} else return true
						})
						.filter((item: any): boolean =>
							this.nsfw ? true : !item.nsfw
						)
						.sort((a: any, b: any) => {
							const sortOption = this.sortOptions.find(
								(o) => o.id === this.currentSort
							)
							if (sortOption)
								return a[sortOption.key] - b[sortOption.key]
						})

					if (this.currentSortOrder === 'desc') {
						items = items.reverse()
					}
				}
				// eslint-disable-next-line vue/no-async-in-computed-properties
				setTimeout(() => {
					this.filterCooldownActive = false
				}, 200)
				;(this.$parent as any).filterLoading = false
			}

			return items || (this.$parent as any).filteredItems
		}
	},
	watch: {
		filteredItems() {
			this.updateParentFiltered()
		}
	},
	mounted() {
		this.updateParentFiltered()
	},
	methods: {
		containsQuery(item: any) {
			const parsedQuery =
				this.query.toLowerCase().match(/['"][^"]*['"]|\S+/gm) || []
			const string = [
				item.details.name,
				item.details.description,
				item.details.author.name,
				item.details.author.discord_tag,
				item.categories.join(' ')
			].join(' ')

			const found = parsedQuery.filter((w) =>
				string.toLowerCase().includes(w.replace(/['"]+/g, ''))
			)
			if (found.length === parsedQuery.length) return true
			else return false
		},
		updateParentFiltered() {
			;(this.$parent as any).filteredItems = this.filteredItems
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
	font-weight: 600;
	font-size: 0.95em;
	text-decoration: none;
	padding: 6px 12px;
	margin: 4px 0;
	border-radius: 2px;
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
		border: 1px solid darken($themezer-aqua, 5%);
		background-color: darken($themezer-aqua, 2%);
		color: #1e1e1e;
		.order {
			transform: unset;
		}
	}

	&.nuxt-link-exact-active.desc,
	&.router-link-exact-active.desc {
		border: 1px solid darken($themezer-magenta, 5%);
		background-color: darken($themezer-magenta, 2%);
		color: white;
		.order {
			transform: rotateZ(180deg);
		}
	}
	.order {
		right: 0;
		transition: transform 200ms ease;
		position: absolute;
		margin-right: 12px;
	}
}
</style>
