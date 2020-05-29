import Vue from 'vue'
import { stringifyThemeID } from '@themezernx/layout-id-parser'
const { patch } = require('@tromkom/aurora-strategic-json-merge-patch')

Vue.mixin({
	methods: {
		mergeJson(uuid, original, array) {
			const usedPieces = []
			for (const piece in array) usedPieces.push(array[piece].uuid)

			const fArray = array
			if (original.Files)
				while (fArray.length > 0)
					original.Files = patch(
						original.Files,
						fArray.shift().Files,
						[
							'FileName',
							'PaneName',
							'PropName',
							'GroupName',
							'name',
							'unknown'
						]
					)

			const aArray = array
			if (original.Anims)
				while (aArray.length > 0)
					original.Anims = patch(
						original.Anims,
						aArray.shift().Anims,
						['FileName']
					)

			console.log(original)

			const ordered = {
				PatchName: original.PatchName,
				AuthorName: original.AuthorName,
				TargetName: original.TargetName,
				ID: stringifyThemeID({
					service: 'Themezer',
					uuid,
					piece_uuids: usedPieces
				}),
				Ready8X: original.Ready8X,
				Files: original.Files,
				Anims: original.Anims
			}

			return JSON.stringify(ordered, null, 2)
		}
	}
})
