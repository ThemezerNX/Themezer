import Vue from 'vue'

Vue.mixin({
	methods: {
		downloadJson(string, label) {
			const blob = new Blob([string], {
				type: 'application/json'
			})
			const link = document.createElement('a')
			link.href = URL.createObjectURL(blob)
			link.download = label
			link.click()
			URL.revokeObjectURL(link.href)
		}
	}
})
