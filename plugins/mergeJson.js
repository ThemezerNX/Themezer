import Vue from 'vue'
import { stringifyThemeID } from '@themezernx/layout-id-parser'
const { patch } = require('@tromkom/aurora-strategic-json-merge-patch')

Vue.mixin({
	methods: {
		mergeJson(uuid, original, array) {
			const usedPieces = []
			const baseJsonParsed = JSON.parse(original)
			for (const piece in array) usedPieces.push(array[piece].uuid)

			const fArray = [].concat(array)
			while (fArray.length > 0) {
				const shifted = fArray.shift()
				baseJsonParsed.Files = patch(
					baseJsonParsed.Files || [],
					JSON.parse(shifted.json).Files,
					[
						'FileName',
						'PaneName',
						'PropName',
						'GroupName',
						'name',
						'MaterialName',
						'unknown'
					]
				)
			}

			const aArray = [].concat(array)
			while (aArray.length > 0) {
				const shifted = aArray.shift()
				baseJsonParsed.Anims = patch(
					baseJsonParsed.Anims || [],
					JSON.parse(shifted.json).Anims,
					['FileName']
				)
			}

			const ordered = {
				PatchName: baseJsonParsed.PatchName,
				AuthorName: baseJsonParsed.AuthorName,
				TargetName: baseJsonParsed.TargetName,
				ID: stringifyThemeID({
					service: 'Themezer',
					uuid:
						uuid +
						(baseJsonParsed.TargetName === 'common.szs'
							? '-common'
							: ''),
					piece_uuids: usedPieces
				}),
				Ready8X: baseJsonParsed.Ready8X,
				Files: baseJsonParsed.Files,
				Anims: baseJsonParsed.Anims
			}

			return JSON.stringify(ordered, null, 2)
		}
	}
})
