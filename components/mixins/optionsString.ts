import Vue from 'vue'

export default Vue.extend({
	methods: {
		optionsString(usedPieces: any) {
			const values: Array<string> = []
			if (usedPieces) {
				usedPieces.forEach((piece: any) => {
					if (piece.value.value === 'true') {
						values.push(piece.name)
					} else {
						values.push(`${piece.name}: ${piece.value.value}`)
					}
				})
			}
			return values.join(', ')
		}
	}
})
