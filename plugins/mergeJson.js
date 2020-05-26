import Vue from 'vue'
const { patch } = require('@tromkom/aurora-strategic-json-merge-patch')

Vue.mixin({
	methods: {
		mergeJson(original, array) {
			const fArray = array
			if (original.Files)
				while (fArray.length > 0) {
					original.Files = patch(
						original.Files,
						fArray.shift().Files,
						['FileName', 'PaneName', 'PropName', 'GroupName']
					)
				}

			const aArray = array
			if (original.Anims)
				while (aArray.length > 0) {
					original.Anims = patch(
						original.Anims,
						aArray.shift().Anims,
						['FileName', 'PaneName', 'PropName', 'GroupName']
					)
				}

			return original
		}
	}
})
