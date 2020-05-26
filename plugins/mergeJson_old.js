import Vue from 'vue'
import merge from 'array-object-merge'

Vue.mixin({
	methods: {
		mergeJson(original, array) {
			console.log(JSON.stringify(array, null, 2))
			while (array.length > 0) {
				console.log(JSON.stringify(original, null, 2))
				original = merge(original, array.shift(), [
					'FileName',
					'PaneName',
					'PropName',
					'GroupName'
				])
			}
			console.log(JSON.stringify(original, null, 2))

			return original
		}
	}
})
