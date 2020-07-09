import Vue from 'vue'

export default Vue.extend({
	props: {
		sortBy: {
			type: String,
			required: false,
			default: null
		}
	},
	methods: {
		sortItems(array: Array<any>) {
			if (array.length > 1 && this.sortBy) {
				array.sort((a: any, b: any) => {
					if (this.sortBy === 'name') {
						const nameA = a.details.name.toLowerCase()
						const nameB = b.details.name.toLowerCase()

						// sort string asc
						if (nameA < nameB) return -1
						else if (nameA > nameB) return 1
						else return 0
					} else {
						// sorty by default (last_modified desc)
						return 0
					}
				})
			}

			return array
		}
	}
})
