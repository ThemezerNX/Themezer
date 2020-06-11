<template>
	<div v-if="layout && layout.has_pieces" no-gutters class="pa-2 box">
		<h1 class="box_text">
			{{ layout.details.name }}
		</h1>
		<div class="subtitle-1 box_text">
			By {{ layout.details.author.name }}
		</div>
		<v-row class="ma-0">
			<v-col
				cols="12"
				xs="12"
				sm="4"
				class="pa-2"
				style="position: relative;"
			>
				<v-img
					aspect-ratio="1.7778"
					:src="
						preview ||
							`//api.themezer.ga/storage/layouts/${layout.details.uuid}/overlay.png`
					"
					:lazy-src="'/logo_16-9-256.jpg'"
					contain
					class="overlay_image"
					:style="backgroundStyle"
				/>
			</v-col>
			<v-col cols="12" xs="12" sm="8" class="pa-2">
				<v-list
					subheader
					flat
					style="background: rgba(255,255,255,0.12);"
					class="my-3"
				>
					<v-subheader>Layout Modifications</v-subheader>
					<div v-for="(piece, i) in layout.pieces" :key="piece.name">
						<v-list-item v-if="piece.values.length === 1">
							<v-list-item-content
								class="pa-0"
								style="overflow: visible;"
							>
								<v-col
									class="pa-0"
									cols="12"
									sm="6"
									md="8"
									lg="8"
									xl="10"
								>
									<v-list-item-title>
										{{ piece.name }}
									</v-list-item-title>
									<v-list-item-subtitle>
										{{ piece.description }}
									</v-list-item-subtitle>
								</v-col>
								<v-col
									class="pa-0 d-flex"
									cols="12"
									sm="6"
									md="4"
									lg="4"
									xl="2"
									style="position: relative;"
								>
									<v-checkbox
										v-model="data[i]"
										class="ma-0 pa-0 d-flex align-self-center"
										style="position: absolute; right: 0;"
										hide-details
										width="auto"
										@change="
											setPreview(
												piece,
												piece.values[0],
												data[i]
											)
										"
									></v-checkbox>
								</v-col>
							</v-list-item-content>
						</v-list-item>

						<v-list-item v-else-if="piece.values.length > 0">
							<v-list-item-content class="pa-0">
								<v-col
									class="pa-0"
									cols="12"
									sm="6"
									md="8"
									lg="8"
									xl="10"
								>
									<v-list-item-title>
										{{ piece.name }}
									</v-list-item-title>
									<v-list-item-subtitle
										style="-webkit-line-clamp: unset;"
									>
										{{ piece.description }}
									</v-list-item-subtitle>
								</v-col>
								<v-col
									class="pa-0"
									cols="12"
									sm="6"
									md="4"
									lg="4"
									xl="2"
								>
									<v-select
										v-model="data[i]"
										class="soloSelectGrey"
										:items="dropdownKeys(piece.values)"
										:menu-props="{ offsetY: true }"
										label="Default"
										hide-details
										solo
										@change="
											setPreview(
												piece,
												piece.values.find(
													(v) => v.value === data[i]
												),
												data[i]
											)
										"
									></v-select>
								</v-col>
							</v-list-item-content>
						</v-list-item>
					</div>
				</v-list>
				<v-flex class="d-flex justify-center">
					<v-btn
						color="secondary"
						append
						@click.prevent="
							combineLayouts(
								layout.baselayout,
								layout.details.name
							)
						"
					>
						Get <v-icon right>mdi-download-box-outline</v-icon>
					</v-btn>
				</v-flex>
			</v-col>
		</v-row>
	</div>
	<LoadingOverlay v-else-if="$apollo.loading" />
	<span v-else>There's nothing here :(</span>
</template>

<script>
import Vue from 'vue'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '~/components/mixins/urlParser'
import { layout } from '@/graphql/Layout.gql'

// import FloatingPreview from '@/components/FloatingPreview.vue'

export default Vue.extend({
	components: {
		// FloatingPreview
	},
	mixins: [urlParser, targetParser],
	data() {
		return {
			data: [],
			preview: null
		}
	},
	computed: {
		backgroundStyle() {
			if (this.$store.state.background)
				return `background-image: url(${this.$store.state.background});`
			else if (this.$route.params.target === 'playerselect') {
				return `background-image: url(/images/blurredhome.jpg);`
			} else if (this.layout.details.color) {
				return `background: ${this.layout.details.color};`
			} else {
				return `background: #e2e2e2;`
			}
		}
	},
	apollo: {
		layout: {
			query: layout,
			variables() {
				return {
					id: this.id,
					target: this.$route.params.target
				}
			},
			result({ data }) {
				if (data && data.theme) {
					this.updateUrlString(this.id, data.theme.details.name)
				}
			},
			prefetch: true
		}
	},
	methods: {
		dropdownKeys(items) {
			const values = items.map((item) => item.value)
			values.unshift('Default')
			return values
		},
		setPreview(option, value, data) {
			if (data && data !== 'Default') {
				if (value.image) {
					this.preview = encodeURI(
						`//api.themezer.ga/storage/layouts/${this.layout.details.uuid}/pieces/${option.name}/${value.image}`
					)
				}
			} else this.preview = null
		},
		combineLayouts() {
			const allModifications = []

			for (let i = 0; i < this.data.length; i++) {
				if (this.data[i] === true) {
					allModifications.push({
						uuid: this.layout.pieces[i].values[0].uuid,
						json: JSON.parse(this.layout.pieces[i].values[0].json)
					})
				} else if (
					typeof this.data[i] === 'string' &&
					this.data[i] !== 'Default'
				) {
					const selected = this.layout.pieces[i].values.find(
						(v) => v.value === this.data[i]
					)
					allModifications.push({
						uuid: selected.uuid,
						json: JSON.parse(selected.json)
					})
				}
			}

			this.downloadFile(
				this.mergeJson(
					this.layout.uuid,
					this.layout.baselayout,
					allModifications
				),
				'application/json',
				this.layout.details.name
			)
		}
	},
	head() {
		const title =
			this.theme && this.theme.details
				? `Customize | ${this.theme.details.name} | ${this.targetName} | Themes`
				: null
		const desc =
			this.theme && this.theme.details && this.theme.details.description
				? this.theme.details.description
				: null

		return {
			title,
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: desc
				},
				{
					hid: 'og:title',
					name: 'og:title',
					property: 'og:title',
					content: title
				},
				{
					hid: 'og:description',
					name: 'og:description',
					property: 'og:description',
					content: desc
				}
			]
		}
	}
})
</script>

<style lang="scss" scoped>
.overlay_image {
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	transition: cubic-bezier(0.165, 0.84, 0.44, 1) 400ms;
	border-radius: 4px;
	// max-height: 50vh;
}

// .v-input__slot {
// 	align-items: center;
// 	justify-content: center;
// }
</style>
