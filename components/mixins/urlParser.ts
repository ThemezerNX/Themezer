import Vue from 'vue'

const nameREGEX = /[^a-zA-Z0-9_.]+/gm

export default Vue.extend({
	computed: {
		id(): string | null {
			const array = this.$route.params.id.split('-')
			const last = array[array.length - 1]
			return last || null
		}
	},
	methods: {
		createUrlString(id: string, name: string) {
			return `${name.replace(nameREGEX, '-')}-${id}`
		},
		updateUrlString(id: string, name: string, target?: string) {
			let newPath = this.$route.path.replace(
				this.$route.params.id,
				this.createUrlString(id, name)
			)

			if (target) {
				newPath = newPath.replace(
					new RegExp(this.$route.params.target),
					target
				)
			}

			this.$router
				.replace({
					path: newPath,
					query: this.$route.query
				})
				// Don't throw 'redundant navigation'
				.catch(() => {})
		}
	}
})
