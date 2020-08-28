<template>
	<v-card
		class="ma-auto"
		router
		exact
		:style="
			`border: rgba(255, 255, 255, 0.12) solid 2px; border-radius: 10px;`
		"
	>
		<div class="group" @mouseleave="searchHover = false">
			<v-card-title class="title">
				Search
				<v-spacer />
				<v-btn
					rounded
					class="px-1"
					style="height: 24px"
					text
					color="secondary"
					:disabled="$route.path === $route.fullPath"
					@click="$router.push($route.path)"
				>
					Clear all
				</v-btn>
			</v-card-title>

			<v-card-actions class="mx-2" @mousedown="searchHover = true">
				<v-text-field
					v-model="query"
					rounded
					label="Search in everything"
					dense
					single-line
					outlined
					hide-details
					@blur="focussed = false"
					@focus="focussed = true"
				></v-text-field>
			</v-card-actions>
			<v-expand-transition name="card-animation" mode="out-in">
				<div
					v-show="
						focussed ||
							searchHover ||
							withCreators.length > 0 ||
							withLayouts.length > 0
					"
					class="mx-2 search-in"
					@mousedown="searchHover = true"
				>
					<v-card-subtitle class="pa-0 mx-2">
						With
					</v-card-subtitle>
					<v-card-actions>
						<v-autocomplete
							v-model="withCreators"
							:items="allCreators || []"
							label="Creators"
							outlined
							hide-details
							chips
							dense
							rounded
							multiple
							small-chips
							deletable-chips
							auto-select-first
							single-line
							:disabled="onlybyme"
							:menu-props="{ bottom: true, offsetY: true }"
							:loading="loading.allCreators"
							@mouseover.once="getParentAllCreators()"
							@click="focussed = true"
							@blur="focussed = false"
						></v-autocomplete>
					</v-card-actions>
					<v-card-actions>
						<v-autocomplete
							v-if="!unsupportedFilters.includes('withLayouts')"
							v-model="withLayouts"
							label="Layout name"
							:items="allLayouts || []"
							multiple
							outlined
							rounded
							single-line
							dense
							:menu-props="{ bottom: true, offsetY: true }"
							hide-details
							chips
							small-chips
							deletable-chips
							auto-select-first
							:loading="loading.allLayouts"
							@mouseover.once="getParentAllLayouts()"
							@click="focussed = true"
							@focus="focussed = true"
							@blur="focussed = false"
						></v-autocomplete>
					</v-card-actions>
				</div>
			</v-expand-transition>
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
						asc: currentOrder === 'asc',
						desc: currentOrder === 'desc'
					}"
					:to="{
						query: {
							page: undefined,
							query: $parent.currentSearch,
							sort: option.id,
							order:
								currentSort === option.id
									? nextSortOrder
									: 'desc',
							creators:
								withCreators.length > 0
									? withCreators.join(',')
									: undefined,
							layouts:
								withLayouts.length > 0
									? withLayouts.join(',')
									: undefined
						}
					}"
				>
					<v-icon
						:color="
							currentSort === option.id && currentOrder === 'asc'
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
								currentOrder === 'asc' ? '#1e1e1e' : 'white'
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

			<v-card-actions v-if="!unsupportedFilters.includes('my')">
				<v-checkbox
					v-model="onlybyme"
					class="ma-0 mx-2"
					label="Made by me"
					hide-details
					@change.once="getParentAllCreators()"
					@change="
						$event
							? (withCreators = [$auth.user.id])
							: (withCreators = [])
					"
				></v-checkbox>
			</v-card-actions>

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
					icon: 'mdi-download-outline'
				},
				{
					title: 'Likes',
					id: 'likes',
					icon: 'mdi-heart'
				},
				{
					title: 'Updated',
					id: 'updated',
					icon: 'mdi-calendar-edit'
				},
				{
					title: 'Added',
					id: 'id',
					icon: 'mdi-calendar-clock'
				}
			],
			loading: {
				allCreators: false,
				allLayouts: false
			},
			allCreators: null,
			allLayouts: null,
			// Search with
			query: '',
			typingQueryTimer: null,
			focussed: false,
			searchHover: false,
			withCreators: [],
			typingWithCreatorsTimer: null,
			withLayouts: [],
			typingWithLayoutsTimer: null,
			// Filters
			onlybyme: false,
			nsfw: false
		}
	},
	computed: {
		currentSort(): string {
			return this.$route.query.sort
				? (this.$route.query.sort as string)
				: 'downloads'
		},
		currentOrder(): string {
			return this.$route.query.order
				? (this.$route.query.order as string)
				: 'desc'
		},
		nextSortOrder(): string | null {
			if (this.currentOrder === 'asc') {
				return 'desc'
			} else {
				return 'asc'
			}
		}
	},
	watch: {
		nsfw(n) {
			this.$parent.$data.nsfw = n
		},
		query(n) {
			clearTimeout(this.$data.typingQueryTimer)
			this.$data.typingQueryTimer = setTimeout(() => {
				const query = Object.assign({}, this.$route.query)
				delete query.page
				if (n === '') delete query.query
				else query.query = n
				this.$router.push({
					query
				})
			}, 400)
		},
		withCreators(n, o) {
			if (
				(this.$data.allCreators || this.$data.loading.allCreators) &&
				n.length !== o.length
			) {
				clearTimeout(this.$data.typingWithCreatorsTimer)
				this.$data.typingWithCreatorsTimer = setTimeout(() => {
					const query = Object.assign({}, this.$route.query)
					delete query.page
					if (n.length === 0) delete query.creators
					else query.creators = n.join(',')
					this.$router.push({
						query
					})
				}, 400)
			}
		},
		withLayouts(n, o) {
			if (
				(this.$data.allLayouts || this.$data.loading.allLayouts) &&
				n.length !== o.length
			) {
				clearTimeout(this.$data.typingWithLayoutsTimer)
				this.$data.typingWithLayoutsTimer = setTimeout(() => {
					const query = Object.assign({}, this.$route.query)
					delete query.page
					if (n.length === 0) delete query.layouts
					else query.layouts = n.join(',')
					this.$router.push({
						query
					})
				}, 400)
			}
		}
	},
	mounted() {
		this.$data.query = this.$route.query.query || ''
		if ((this.$parent as any).currentCreators) {
			this.$data.withCreators = (this.$parent as any).currentCreators
			this.getParentAllCreators()
		}
		if ((this.$parent as any).currentLayouts) {
			this.$data.withLayouts = (this.$parent as any).currentLayouts
			this.getParentAllLayouts()
		}
	},
	methods: {
		getParentAllCreators() {
			this.$data.loading.allCreators = true
			;(this.$parent as any).getAllCreators().then((res: Array<any>) => {
				this.$data.allCreators = res
					.map((item) => {
						return {
							text: item.creator.display_name,
							value: item.creator.id
						}
					})
					.sort((a, b) =>
						a.text.toLowerCase().localeCompare(b.text.toLowerCase())
					)
				this.$data.loading.allCreators = false
			})
		},
		getParentAllLayouts() {
			this.$data.loading.allLayouts = true
			;(this.$parent as any).getAllLayouts().then((res: Array<any>) => {
				const all: Array<any> = []
				if (this.$parent.$data.type === 'themes') {
					res.forEach((item) => {
						if (item.layout) {
							all.push({
								text: item.layout.details.name,
								value: item.layout.id
							})
						}
					})
				} else {
					res.forEach((pack) => {
						pack.themes.forEach((theme: any) => {
							if (theme.layout)
								all.push({
									text: theme.layout.details.name,
									value: theme.layout.id
								})
						})
					})
				}

				this.$data.allLayouts = all.sort((a, b) =>
					a.text.toLowerCase().localeCompare(b.text.toLowerCase())
				)

				this.$data.loading.allLayouts = false
			})
		}
	}
})
</script>

<style lang="scss" scoped>
@import '~assets/variables.scss';

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
