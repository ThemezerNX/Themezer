<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<div v-if="theme && theme.details" no-gutters class="pa-2 box">
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
							`//api.themezer.ga/storage/themes/${theme.uuid}/screenshot.jpg`
						"
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
						{{ theme.details.name }}
					</h1>
					<div class="subtitle-1">
						By
						<a
							class="font-weight-bold"
							:href="`/creators/${theme.creator.id}`"
						>
							{{ theme.creator.discord_user.username }}
						</a>
					</div>
					<div
						v-if="theme.details.description"
						v-linkified:options="{
							className: 'font-weight-medium'
						}"
						class="font-weight-thin subtitle-1"
						v-html="theme.details.description"
					/>

					<div>
						<v-chip
							v-for="(category, i) in theme.categories"
							:key="i"
							class="ma-2"
							pill
							small
						>
							{{ category }}
						</v-chip>
					</div>
					<v-divider class="my-3" />
					<h3>
						Details
					</h3>
					<div class="font-weight-light body-2">
						<span class="font-weight-medium">Version: </span>
						{{ theme.details.version }}
					</div>
					<div class="font-weight-light body-2">
						<span class="font-weight-medium">Last Updated:</span>
						{{ niceDate(theme.last_updated) }}
					</div>
					<div v-if="theme.layout" class="font-weight-light body-2">
						<span class="font-weight-medium">Layout: </span>
						<a
							class="font-weight-bold"
							:href="
								`/layouts/${fileNameToWebName(
									theme.layout.target
								)}/${createUrlString(
									theme.layout.id,
									theme.layout.details.name
								)}`
							"
						>
							{{ theme.layout.details.name }}
						</a>
					</div>
					<div
						v-if="
							theme.layout &&
								theme.pieces &&
								theme.pieces.length > 0
						"
						class="font-weight-light body-2"
					>
						<span class="font-weight-medium">Options: </span>
						{{ optionsString(theme.pieces) }}
					</div>
					<div v-if="theme.bg_type" class="font-weight-light body-2">
						<span class="font-weight-medium">Background: </span>
						<a
							class="font-weight-bold"
							:href="
								`//api.themezer.ga/storage/themes/${theme.uuid}/image.${theme.bg_type}`
							"
						>
							{{ theme.bg_type === 'jpg' ? 'JPG' : 'DDS' }}
						</a>
					</div>
					<div class="font-weight-light body-2">
						<span class="font-weight-medium">Downloads: </span>
						{{ theme.dl_count }}
					</div>
					<!-- <div style="position: absolute; bottom: 0;"> -->
					<v-flex class="d-flex justify-center mt-3">
						<!-- <v-btn
						v-if="theme.has_pieces"
						class="mx-2"
						color="primary"
						to="customize"
						append
					>
						Customize <v-icon right>mdi-square-edit-outline</v-icon>
					</v-btn> -->
						<v-btn
							class="mx-2"
							color="secondary"
							append
							:loading="loadingDownload"
							@click.prevent="downloadTheme()"
						>
							Get <v-icon right>mdi-download-box-outline</v-icon>
						</v-btn>
					</v-flex>
					<div v-if="theme.pack">
						<v-divider class="my-3" />
						<h3 style="position: relative;">
							Theme Pack
							<v-tooltip v-model="showPackInfo" top>
								<template v-slot:activator="{ on }">
									<v-btn
										icon
										style="position: absolute; top: 0; color: black;"
										class="ml-1 pa-0 grey lighten-1"
										width="14"
										height="14"
										v-on="on"
										@click="packDialog = true"
									>
										?
									</v-btn>
								</template>
								<span>What is this?</span>
							</v-tooltip>
						</h3>
						<div class="subtitle-1">
							This Theme is part of the the following Theme Pack:
						</div>
						<a
							:href="
								`/packs/${createUrlString(
									theme.pack.id,
									theme.pack.details.name
								)}`
							"
							class="subtitle-1 font-weight-bold"
						>
							{{ theme.pack.details.name }}
						</a>
					</div>
				</v-col>
			</v-row>
			<v-dialog v-model="packDialog" max-width="400">
				<v-card>
					<v-card-title class="headline"
						>What is a Theme Pack?</v-card-title
					>

					<v-card-text>
						Theme Packs are just zips with multiple themes created
						by the same user.
					</v-card-text>

					<v-card-actions>
						<v-spacer></v-spacer>

						<v-btn color="primary" text @click="packDialog = false">
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
import targetParser from '@/components/mixins/targetParser'
import urlParser from '@/components/mixins/urlParser'
import { theme, downloadTheme } from '@/graphql/Theme.gql'
import LoadingOverlay from '@/components/LoadingOverlay'

export default Vue.extend({
	components: {
		LoadingOverlay
	},
	mixins: [shared, targetParser, urlParser],
	data() {
		return {
			showPackInfo: false,
			packDialog: false,
			loadingDownload: false
		}
	},
	computed: {
		backgroundStyle() {
			return ''
			// if (this.theme.details.color) {
			// 	return `background: ${this.theme.details.color};`
			// } else {
			// 	return `background: #e2e2e2;`
			// }
		}
	},
	apollo: {
		theme: {
			query: theme,
			variables() {
				return {
					id: this.id,
					target: this.targetFile()
				}
			},
			result({ data }) {
				if (data && data.theme) {
					this.updateUrlString(this.id, data.theme.details.name)
				}
			},
			// fetchPolicy: 'no-cache',
			prefetch: true
		}
	},
	methods: {
		optionsString(usedPieces) {
			const values = []
			if (usedPieces && usedPieces.length > 0) {
				usedPieces.forEach((piece) => {
					if (piece.value.value === 'true') {
						values.push(piece.name)
					} else {
						values.push(`${piece.name}: ${piece.value.value}`)
					}
				})
			}
			return values.join(', ')
		},
		downloadTheme() {
			this.loadingDownload = true
			const usedPieces = []

			if (this.theme.pieces) {
				for (let i = 0; i < this.theme.pieces.length; i++) {
					usedPieces.push(this.theme.pieces[i].value.uuid)
				}
			}

			this.$apollo
				.mutate({
					mutation: downloadTheme,
					variables: {
						uuid: this.theme.uuid,
						piece_uuids: usedPieces
					}
				})
				.then(({ data }) => {
					this.loadingDownload = false

					this.downloadFileB64(
						data.downloadTheme.data,
						data.downloadTheme.mimetype,
						data.downloadTheme.filename
					)
				})
		}
	},
	head() {
		if (this.theme) {
			const metaTitle = `${
				this.theme.details.name
			} | ${this.targetName()} | Themes`
			const metaDesc = this.theme.details.description
			const metaImg = `//api.themezer.ga/storage/themes/${this.theme.uuid}/screenshot.jpg`

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
