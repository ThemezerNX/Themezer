<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<div v-if="layout && layout.details" no-gutters class="pa-2 box_fill">
			<v-row class="ma-0">
				<v-col
					cols="12"
					xs="12"
					:sm="landscape ? 8 : 12"
					md="9"
					class="pa-2"
				>
					<v-img
						aspect-ratio="1.7778"
						:src="
							`//api.themezer.ga/storage/layouts/${layout.uuid}/overlay.png`
						"
						:lazy-src="'/logo_16-9-256.jpg'"
						contain
						class="overlay-image"
						:style="backgroundStyle"
					/>
				</v-col>
				<v-col
					cols="12"
					xs="12"
					:sm="landscape ? 4 : 12"
					md="3"
					class="pa-2"
					style="position: relative;"
				>
					<h1>
						{{ layout.details.name }}
					</h1>
					<div class="subtitle-1">
						By {{ layout.details.author.name }}
					</div>
					<div
						v-if="layout.details.description"
						class="font-weight-thin subtitle-1"
					>
						{{ layout.details.description }}
					</div>

					<v-divider class="my-3" />
					<h3>
						Details
					</h3>
					<div
						v-if="layout.details.author.discord_tag"
						class="font-weight-light body-2"
					>
						<span class="font-weight-medium">
							Author's Discord:
						</span>
						{{ layout.details.author.discord_tag }}
					</div>
					<div class="font-weight-light body-2">
						<span class="font-weight-medium">Version: </span>
						{{ layout.details.version }}
					</div>
					<div class="font-weight-light body-2">
						<span class="font-weight-medium">Last Updated:</span>
						{{ niceDate(layout.last_updated) }}
					</div>
					<div class="font-weight-light body-2">
						<span class="font-weight-medium">Target File: </span>
						{{ layout.target }}.szs
					</div>
					<div class="font-weight-light body-2">
						<span class="font-weight-medium">Downloads: </span>
						{{ layout.dl_count }}
					</div>
					<!-- <div style="position: absolute; bottom: 0;"> -->
					<v-flex class="d-flex justify-center mt-3">
						<v-btn
							v-if="layout.has_pieces"
							class="mx-2"
							color="primary"
							to="customize"
							append
							:loading="loadingMerge"
						>
							Customize
							<v-icon right>mdi-square-edit-outline</v-icon>
						</v-btn>
						<v-btn
							class="mx-2"
							color="secondary"
							append
							:loading="loadingMerge"
							@click.prevent="download()"
						>
							Get <v-icon right>mdi-download-box-outline</v-icon>
						</v-btn>
					</v-flex>
					<div v-if="commonlayoutObject">
						<v-divider class="my-3" />
						<h3 style="position: relative;">
							Common layout
							<v-tooltip v-model="show" top>
								<template v-slot:activator="{ on }">
									<v-btn
										icon
										style="position: absolute; top: 0; color: black;"
										class="ml-1 pa-0 grey lighten-1"
										width="14"
										height="14"
										v-on="on"
										@click="commonlayoutDialog = true"
									>
										?
									</v-btn>
								</template>
								<span>What is this?</span>
							</v-tooltip>
						</h3>
						<div class="font-weight-thin subtitle-1">
							{{ commonlayoutObject.PatchName }}
						</div>
						<div
							v-if="commonlayoutObject.AuthorName"
							class="font-weight-light body-2"
						>
							<span class="font-weight-medium">
								Author:
							</span>
							{{ commonlayoutObject.AuthorName }}
						</div>
						<div class="font-weight-light body-2">
							<span class="font-weight-medium"
								>Target File:
							</span>
							{{ commonlayoutObject.TargetName }}
						</div>
						<v-flex class="d-flex justify-center mt-3">
							<v-btn
								class="mx-2"
								color="secondary"
								append
								:loading="loadingMergeCommon"
								@click.prevent="downloadCommon()"
							>
								Get
								<v-icon right>mdi-download-box-outline</v-icon>
							</v-btn>
						</v-flex>
					</div>
				</v-col>
			</v-row>
			<v-row class="ma-0">
				<v-col
					:class="
						$vuetify.breakpoint.smAndDown ? 'px-0 py-2' : 'pa-2'
					"
				>
					<BackgroundsSlideGroup />
				</v-col>
			</v-row>
			<v-dialog v-model="commonlayoutDialog" max-width="400">
				<v-card>
					<v-card-title class="headline"
						>What is the Common layout?</v-card-title
					>

					<v-card-text>
						The Common layout is the footer seen in and shared
						across the Home Menu, All Apps, Settings and News. The
						stock version contains the currently active controller
						on the left, the divider line and the button actions on
						the right. Some layouts include a Common layout to hide
						the line or make other minor modifications. Modifying
						the Common layout for Player Select and User Page is
						unsupported by the Switch Theme Injector. It is always
						recommended to download and use this layout as well!
					</v-card-text>

					<v-card-actions>
						<v-spacer></v-spacer>

						<v-btn
							color="primary"
							text
							@click="commonlayoutDialog = false"
						>
							Close
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</div>
		<LoadingOverlay v-else-if="$apollo.loading" />
		<span v-else>There's nothing here :(</span>
	</v-container>
</template>

<script>
import Vue from 'vue'
import shared from '@/layouts/details/SharedScript'
import { mergeJson } from '@/graphql/Merging.gql'
import targetParser from '@/components/mixins/targetParser'
import BackgroundsSlideGroup from '@/components/BackgroundsSlideGroup.vue'
import { layout } from '@/graphql/Layout.gql'
import LoadingOverlay from '@/components/LoadingOverlay'

export default Vue.extend({
	components: {
		LoadingOverlay,
		BackgroundsSlideGroup
	},
	ixins: [shared, targetParser],
	data() {
		return {
			commonlayoutDialog: false,
			loadingMerge: false,
			loadingMergeCommon: false
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
		},
		commonlayoutObject() {
			if (this.layout.commonlayout) {
				return JSON.parse(this.layout.commonlayout)
			} else return null
		}
	},
	methods: {
		download() {
			this.loadingMerge = true
			this.$apollo
				.mutate({
					mutation: mergeJson,
					variables: {
						uuid: this.layout.uuid,
						piece_uuids: []
					}
				})
				.then(({ data }) => {
					this.loadingMerge = false

					this.downloadFile(
						data.mergeJson,
						'application/json',
						this.layout.details.name
					)
				})
		},
		downloadCommon() {
			this.loadingMergeCommon = true
			this.$apollo
				.mutate({
					mutation: mergeJson,
					variables: {
						uuid: this.layout.uuid,
						common: true
					}
				})
				.then(({ data }) => {
					this.loadingMergeCommon = false

					this.downloadFile(
						data.mergeJson,
						'application/json',
						`${this.layout.details.name} - Common layout`
					)
				})
		}
	},
	apollo: {
		layout: {
			query: layout,
			variables() {
				return {
					id: this.id,
					target: this.targetFile()
				}
			},
			result({ data }) {
				if (data && data.layout) {
					this.updateUrlString(this.id, data.layout.details.name)
				}
			},
			// fetchPolicy: 'no-cache',
			prefetch: true
		}
	},
	head() {
		if (this.layout) {
			const metaTitle = `${
				this.layout.details.name
			} | ${this.targetName()} | Layouts`
			const metaDesc = this.layout.details.description
			const metaImg = `//api.themezer.ga/storage/layouts/${this.layout.uuid}/overlay.png`

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
