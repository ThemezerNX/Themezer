import Vue from 'vue'

const nameREGEX = /[^a-zA-Z0-9_.]+/gm

export default Vue.extend({
	computed: {
		id(): number {
			const array = this.$route.params.id.split('-')
			const last = parseInt(array[array.length - 1])
			return isNaN(last) ? 0 : last
		}
	},
	methods: {
		createUrlString(id: number, name: string) {
			return `${name.replace(nameREGEX, '-')}-${id}`
		},
		updateUrlString(id: number, name: string) {
			this.$router.push(
				this.$route.path.replace(
					this.$route.params.id,
					this.createUrlString(id, name)
				)
			)
		}
	}
})
