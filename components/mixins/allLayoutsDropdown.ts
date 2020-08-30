import Vue from 'vue'
import { allLayouts } from '@/graphql/Filtering.gql'

export default Vue.extend({
	data() {
		return {
			currentThemeTarget: null,
			layouts: {
				ResidentMenu: [],
				Entrance: [],
				MyPage: [],
				Flaunch: [],
				Set: [],
				Notification: [],
				Psl: []
			}
		}
	},
	// @ts-ignore
	apollo: {
		layoutList: {
			query: allLayouts,
			variables() {
				return {
					target: (this as any).currentThemeTarget
				}
			},
			update(data: any) {
				if (data?.layoutList) {
					const layouts = data.layoutList.map((l: any) => {
						return {
							text: `'${l.details.name}' by ${l.creator.display_name}`,
							value: l.id
						}
					})

					// Add some extra very common layouts
					if ((this as any).currentThemeTarget === 'ResidentMenu') {
						layouts.push({
							text: `'Doge Layout Rounded' by ${
								data.layoutList.find(
									(l: any) =>
										l.creator.id === '249186838592487425'
								).creator.display_name
							}`,
							value: 'e|7638bb49-7475-4d11-a76a-ec9d63b12b94'
						})
						layouts.push({
							text: `'DogeLayout - M-Edition Rounded' by ${
								data.layoutList.find(
									(l: any) =>
										l.creator.id === '123859829453357056'
								).creator.display_name
							}`,
							value: '4|c4c1239e-a3ec-43b9-835a-49f6220aa222'
						})
						layouts.push({
							text: `'Small Compact Homescreen Rounded' by ${
								data.layoutList.find(
									(l: any) =>
										l.creator.id === '155500696693768202'
								).creator.display_name
							}`,
							value: 'f|e818c9af-ca39-48cd-8ed1-a979b69ea142'
						})
					} else if ((this as any).currentThemeTarget === 'Flaunch') {
						layouts.push({
							text: `'All Apps 90% Scale Rounded' by ${
								data.layoutList.find(
									(l: any) =>
										l.creator.id === '249186838592487425'
								).creator.display_name
							}`,
							value: 'b|2ee3f0bc-9140-402e-bdfc-d50042c4d45e'
						})
					} else if ((this as any).currentThemeTarget === 'Psl') {
						layouts.push({
							text: `'Transparent Playerselect 90% Scale Centered' by ${
								data.layoutList.find(
									(l: any) =>
										l.creator.id === '123859829453357056'
								).creator.display_name
							}`,
							value:
								'3|b77b434f-5811-42fc-bd5e-ab44d7f24b61,d22d7557-99da-4710-a2d8-0bb3c7bfac14'
						})
						layouts.push({
							text: `'Transparent Playerselect 90% Scale' by ${
								data.layoutList.find(
									(l: any) =>
										l.creator.id === '123859829453357056'
								).creator.display_name
							}`,
							value: '3|b77b434f-5811-42fc-bd5e-ab44d7f24b61'
						})
						layouts.push({
							text: `'Transparent Playerselect Centered' by ${
								data.layoutList.find(
									(l: any) =>
										l.creator.id === '123859829453357056'
								).creator.display_name
							}`,
							value: '3|d22d7557-99da-4710-a2d8-0bb3c7bfac14'
						})
					}

					const final = layouts.sort((a: any, b: any) => {
						if (b.text.includes("'Default'")) return 1
						else
							return a.text
								.toLowerCase()
								.localeCompare(b.text.toLowerCase())
					})
					;(this as any).$set(
						(this as any).layouts,
						(this as any).currentThemeTarget as string,
						final
					)

					return final
				} else return []
			},
			error(e: any) {
				;(this as any).$nuxt.error(e)
			},
			prefetch: false,
			skip: true
		}
	}
})
