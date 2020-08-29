import Vue from 'vue'

export default Vue.extend({
	data() {
		return {
			pageNumber:
				this.$route.query.page && Number(this.$route.query.page) > 0
					? Number(this.$route.query.page)
					: 1,
			loading: {
				fetching: false
			}
		}
	},
	computed: {
		urlPageNr() {
			return Number(this.$route.query.page)
		},
		currentPage() {
			if (
				this.$data.pageNumber <= this.pageCount ||
				!(this as any).itemList
			) {
				return this.$data.pageNumber
			} else {
				const query = Object.assign({}, this.$route.query)
				delete query.page
				// eslint-disable-next-line vue/no-side-effects-in-computed-properties
				this.$router.push({
					query
				})
				// eslint-disable-next-line vue/no-side-effects-in-computed-properties
				return 1
			}
		},
		pageCount(): number {
			// eslint-disable-next-line camelcase
			return this.$data.itemList?.pagination?.page_count || 0
		},
		currentSearch(): string | undefined {
			return this.$route.query.query
				? (this.$route.query.query as string)
				: undefined
		},
		currentCreators(): Array<string> | undefined {
			return this.$route.query.creators
				? (this.$route.query.creators as string).split(',')
				: undefined
		},
		currentLayouts(): Array<string> | undefined {
			return this.$route.query.layouts
				? (this.$route.query.layouts as string).split(',')
				: undefined
		},
		currentSort(): string {
			return this.$route.query.sort
				? (this.$route.query.sort as string)
				: 'downloads'
		},
		currentOrder(): string {
			return this.$route.query.order
				? (this.$route.query.order as string)
				: 'desc'
		}
	},
	watch: {
		urlPageNr(n) {
			if (n) {
				this.$data.pageNumber = n
			}
		},
		currentSearch(n, o) {
			// This is needed to ensure the query is updated on the browser back button
			if (n && o) {
				this.$data.query = n
			}
		}
	},
	methods: {
		paginationEvent(n: string) {
			const top: any = this.$refs.top
			const position =
				top.getBoundingClientRect().top + window.pageYOffset - 64
			window.scrollTo({ top: position, behavior: 'smooth' })
			const query = Object.assign({}, this.$route.query)
			query.page = n
			this.$router.push({ query })
		},
		getAllCreators() {
			this.$data.loading.fetching = true
			return new Promise((resolve, reject) => {
				;(this as any).$apollo
					.query({
						query: this.$data.allCreatorsQuery,
						variables: {
							target: (this as any).targetFile(),
							nsfw: true
						}
					})
					.then((res: any) => {
						this.$data.loading.fetching = false
						resolve(res?.data?.[this.$data.list])
					})
					.catch((err: any) => {
						this.$data.loading.fetching = false
						reject(err)
					})
			})
		},
		getAllLayouts() {
			this.$data.loading.fetching = true
			return new Promise((resolve, reject) => {
				;(this as any).$apollo
					.query({
						query: this.$data.allLayoutsQuery,
						variables: {
							target: (this as any).targetFile(),
							nsfw: true
						}
					})
					.then((res: any) => {
						this.$data.loading.fetching = false
						resolve(res?.data?.[this.$data.list])
					})
					.catch((err: any) => {
						this.$data.loading.fetching = false
						reject(err)
					})
			})
		}
	}
})
