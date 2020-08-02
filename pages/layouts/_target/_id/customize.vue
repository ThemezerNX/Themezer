<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<v-sheet
			v-if="layout && layout.has_pieces"
			no-gutters
			class="pa-2 box_fill"
		>
			<h1 class="box_text">Customize Layout</h1>
			<h2 class="box_text mt-0">{{ layout.details.name }}</h2>
			<div class="subtitle-1 box_text">
				By
				<nuxt-link
					class="font-weight-bold"
					:to="`/creators/${layout.creator.id}`"
				>
					{{ layout.creator.discord_user.username }}
				</nuxt-link>
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
								`//api.themezer.ga/cdn/layouts/${layout.uuid}/overlay.png`
						"
						cover
						class="overlay-image"
						:style="backgroundStyle"
						style="background-size: cover;"
					/>
				</v-col>
				<v-col
					v-show="restoredActivePieces"
					cols="12"
					xs="12"
					sm="8"
					class="pa-2"
				>
					<v-list
						subheader
						flat
						style="background: rgba(255,255,255,0.12); border-radius: 10px;"
						class="my-3"
					>
						<v-subheader>Layout Modifications</v-subheader>
						<div
							v-for="(piece, i) in layout.pieces"
							:key="piece.name"
						>
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
										<v-list-item-title
											style="white-space: inherit;"
										>
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
											:input-value="data[i]"
											class="ma-0 pa-0 d-flex align-self-center"
											style="position: absolute; right: 0;"
											hide-details
											width="auto"
											@change="
												valueChange(
													$event,
													piece.values
												)
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
										<v-list-item-title
											style="white-space: inherit;"
										>
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
											rounded
											:input-value="data[i]"
											class="soloSelectGrey"
											:items="dropdownKeys(piece.values)"
											:menu-props="{ offsetY: true }"
											label="Default"
											hide-details
											solo
											@change="
												valueChange(
													data[i],
													piece.values
												)
												setPreview(
													piece,
													piece.values.find(
														(v) =>
															v.value === data[i]
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
					<ButtonDivider>
						<DownloadButton
							tooltip="Download layout"
							:download-function="download"
							:loading="loadingMerge"
						/>
						<ShareButton
							type="customized layout"
							tooltip="Permalink"
							:name="layout.details.name"
							:creator="layout.creator.discord_user.username"
						/>
					</ButtonDivider>
				</v-col>
			</v-row>
		</v-sheet>
		<LoadingOverlay v-else-if="$apollo.loading" />
		<span v-else>There's nothing here :(</span>
	</v-container>
</template>

<script>
import Vue from 'vue'
import { layout, downloadLayout } from '@/graphql/Layout.gql'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '~/components/mixins/urlParser'

export default Vue.extend({
	beforeRouteEnter(to, _from, next) {
		if (to.params.id) {
			next()
		} else {
			next('/')
		}
	},
	components: {
		ButtonDivider: () => import('@/components/buttons/ButtonDivider.vue'),
		DownloadButton: () => import('@/components/buttons/DownloadButton.vue'),
		ShareButton: () => import('@/components/buttons/ShareButton.vue')
	},
	mixins: [urlParser, targetParser],
	data() {
		return {
			data: [],
			preview: null,
			loadingMerge: false,
			activePieces: [],
			restoredActivePieces: false
		}
	},
	computed: {
		backgroundStyle() {
			if (this.$store.state.background) {
				return (
					'background-image: url(' +
					(this.$store.state.background.startsWith('blob')
						? this.$store.state.background
						: require(`@/assets/backgrounds/${this.$store.state.background}`)) +
					')'
				)
			} else if (this.$route.params.target === 'playerselect') {
				return `background-image: url(/images/blurredhome.jpg);`
			} else if (this.layout.details.color) {
				return `background: ${this.layout.details.color};`
			} else {
				return `background: #2d2d2d;`
			}
		},
		activePiecesComputed() {
			return this.activePieces
		}
	},
	watch: {
		activePiecesComputed(n) {
			this.$router.replace({
				query: { pieces: n.length > 0 ? n.join() : undefined }
			})
		}
	},
	mounted() {
		if (this.$route.query.pieces) {
			this.activePieces = this.$route.query.pieces
				.toLowerCase()
				.split(',')
				.filter((uuid) =>
					this.layout.pieces.some((p) =>
						p.values.some((v) => v.uuid === uuid)
					)
				)

			if (this.activePieces.length > 0) {
				this.activePieces.forEach((aP) => {
					let index
					let value
					for (let i = 0; i < this.layout.pieces.length; i++) {
						this.layout.pieces[i].values.find((v) => {
							if (v.uuid === aP) {
								index = i
								if (this.layout.pieces[i].values.length > 1) {
									// Dropdown
									value = v.value
								} else {
									// Checkbox
									value = true
								}
								return true
							}
						})
					}

					this.data[index] = value
				})
			}
		}
		this.restoredActivePieces = true
	},
	apollo: {
		layout: {
			query: layout,
			variables() {
				return {
					id: this.id
				}
			},
			result({ data }) {
				if (data && data.layout) {
					this.updateUrlString(
						data.layout.id,
						data.layout.details.name,
						this.fileNameToWebName(data.layout.target)
					)
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
						`//api.themezer.ga/cdn/layouts/${this.layout.uuid}/pieces/${option.name}/${value.image}`
					)
				}
			} else this.preview = null
		},
		valueChange(value, pieces) {
			if (value === true) {
				// Checkbox
				this.activePieces.push(pieces[0].uuid)
			} else if (value === false) {
				// Unchecked checkbox
				this.activePieces = this.activePieces.filter(
					(u) => u !== pieces[0].uuid
				)
			} else if (typeof value === 'string') {
				// Dropdown
				const newPiece = pieces.find((v) => v.value === value)
				const removePieces = pieces
					.filter((v) => v.value !== value)
					.map((v) => v.uuid)

				this.activePieces = this.activePieces.filter(
					(uuid) => !removePieces.includes(uuid)
				)

				if (newPiece) {
					// If not 'Default'
					this.activePieces.push(newPiece.uuid)
				}
			}
		},
		combineLayouts() {
			const usedPieces = []

			for (let i = 0; i < this.data.length; i++) {
				if (this.data[i] === true) {
					// Checkbox
					usedPieces.push(this.layout.pieces[i].values[0].uuid)
				} else if (
					typeof this.data[i] === 'string' &&
					this.data[i] !== 'Default'
				) {
					// Dropdown
					const selected = this.layout.pieces[i].values.find(
						(v) => v.value === this.data[i]
					)
					usedPieces.push(selected.uuid)
				}
			}

			this.loadingMerge = true
			this.$apollo
				.mutate({
					mutation: downloadLayout,
					variables: {
						id: this.layout.id,
						piece_uuids: usedPieces
					}
				})
				.then(({ data }) => {
					this.loadingMerge = false

					this.downloadFile(
						data.downloadLayout,
						'application/json',
						this.layout.details.name
					)
				})
				.catch((err) => {
					this.$snackbar.error(err)
					this.loadingMerge = false
				})
		},
		download() {
			this.combineLayouts(
				this.layout.baselayout,
				this.layout.details.name
			)
		}
	},
	head() {
		if (this.layout) {
			const metaTitle = `${
				this.layout.details.name
			} | ${this.targetName()} | Layouts`
			const metaDesc = this.layout.details.description
			const metaImg = `//api.themezer.ga/cdn/layouts/${this.layout.uuid}/overlay.png`

			return {
				title: metaTitle,
				meta: [
					{
						hid: 'description',
						name: 'description',
						content: metaDesc
					},
					{
						hid: 'og:title',
						name: 'og:title',
						property: 'og:title',
						content: metaTitle
					},
					{
						hid: 'og:description',
						name: 'og:description',
						property: 'og:description',
						content: metaDesc
					},
					{
						hid: 'og:image',
						name: 'og:image',
						property: 'og:image',
						content: metaImg
					}
				]
			}
		}
	}
})
</script>

<style lang="scss">
.v-menu__content {
	border-radius: 10px !important;
}
</style>
