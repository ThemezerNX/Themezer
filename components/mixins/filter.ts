import Vue from 'vue'

export default Vue.extend({
	data() {
		return {
			filteredItems: null,
			filterLoading: true,
			itemsPerPage: 12,
			currentPageNumber:
				this.$route.query.page &&
				parseInt(this.$route.query.page as string) > 0
					? parseInt(this.$route.query.page as string)
					: 1
		}
	},
	computed: {
		currentQueryPageNumber() {
			return this.$route.query.page &&
				parseInt(this.$route.query.page as string) > 0
				? parseInt(this.$route.query.page as string)
				: 1
		},
		pageCount(): number {
			if (this.$data.filteredItems) {
				const length = this.$data.filteredItems.length
				const size = this.$data.itemsPerPage
				return Math.ceil(length / size)
			} else return 0
		},
		paginatedData(): Array<object> | null {
			if (this.$data.filteredItems) {
				const start =
					(this.currentPageNumber - 1) * this.$data.itemsPerPage
				const end = start + this.$data.itemsPerPage

				return this.$data.filteredItems.slice(start, end)
			} else return null
		}
	},
	watch: {
		currentQueryPageNumber(n) {
			this.currentPageNumber = n
		},
		pageCount(n) {
			if (this.currentPageNumber > n) {
				const query = Object.assign({}, this.$route.query)
				delete query.page
				this.$router.push({ query })
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
		}
	}
})
