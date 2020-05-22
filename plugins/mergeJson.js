import Vue from 'vue'
import merge from 'array-object-merge'

Vue.mixin({
	methods: {
		mergeJson(original, array) {
			while (array.length > 0) {
				original = merge(original, array.shift(), [
					'FileName',
					'PaneName',
					'PropName',
					'GroupName'
				])
			}

			return original
		}
	}
})
