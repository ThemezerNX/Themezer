<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<v-sheet ref="sheet" no-gutters class="pa-2 box_fill">
			<h1 class="box_text">
				Overlay Creator
			</h1>
			<div class="subtitle-1 box_text">
				Create a transparent overlay for your layout and customizations.
				You may use the tool here, or manually create an overlay if you
				can. Either way, an overlay is required for layouts on this
				website.
			</div>
			<h2 class="box_text">
				1. Upload Layout
			</h2>
			<div class="subtitle-1 box_text">
				Upload your layout here. You will get two NXThemes: one with a
				black background and one with a white one (be sure to allow the
				site to download multiple files). For each do the following:
				install it on your Switch and take a screenshot. Set the system
				theme to white(!) and have the cursor in the same position when
				taking the screenshots. Transfer the screenshots to your PC
				afterwards. Have you done that? Go to step 2.
				<a
					href="https://github.com/ThemezerNX/Layouts#3-creating-overlays"
					rel="noopener"
					target="_blank"
				>
					More detailed instructions
				</a>
			</div>
			<v-row class="ma-0">
				<v-col cols="12" class="pa-2">
					<v-file-input
						v-model="layoutJson"
						rounded
						label=".json layout"
						filled
						prepend-icon="mdi-code-json"
						accept="application/json"
						hide-details
					/>
				</v-col>
				<v-col cols="12" class="pa-2">
					<v-file-input
						v-model="pieceJson"
						rounded
						label=".json piece file (optional)"
						filled
						prepend-icon="mdi-code-json"
						accept="application/json"
						hide-details
					/>
				</v-col>
				<v-col cols="12" class="pa-2">
					<v-file-input
						v-model="commonJson"
						rounded
						label=".json common layout (optional)"
						filled
						prepend-icon="mdi-code-json"
						accept="application/json"
						hide-details
					/>
				</v-col>

				<ButtonDivider>
					<v-btn
						rounded
						color="primary"
						append
						:loading="loadingUploadLayout"
						:disabled="!layoutJson"
						@click.prevent="uploadLayout()"
					>
						Get
						<v-icon right class="mt-1"
							>mdi-format-color-fill</v-icon
						>
					</v-btn>
				</ButtonDivider>
			</v-row>

			<h2 class="box_text">
				2. Upload Screenshots
			</h2>
			<div class="subtitle-1 box_text">
				Here you will upload the two screenshots you took at step 1.
				Upload them to their own field below.
			</div>
			<v-row class="ma-0">
				<v-col
					v-if="screenshotWhiteUrl"
					cols="12"
					xs="12"
					sm="2"
					class="pa-2"
					style="position: relative;"
				>
					<v-img
						aspect-ratio="1.7778"
						class="placeholder"
						:src="screenshotWhiteUrl"
						contain
						alt="Screenshot with white background"
					/>
				</v-col>
				<v-col
					cols="12"
					xs="12"
					:sm="screenshotWhiteUrl ? 10 : 12"
					class="pa-2"
				>
					<v-file-input
						v-model="whiteImg"
						rounded
						label="Screenshot with white background"
						filled
						prepend-icon="mdi-monitor-screenshot"
						accept="image/jpeg"
						hide-details
						@change="onScreenshotWhiteChange"
					/>
				</v-col>

				<v-col
					v-if="screenshotBlackUrl"
					cols="12"
					xs="12"
					sm="2"
					class="pa-2"
					style="position: relative;"
				>
					<v-img
						aspect-ratio="1.7778"
						class="placeholder"
						:src="screenshotBlackUrl"
						contain
						alt="Screenshot with black background"
					/>
				</v-col>
				<v-col
					cols="12"
					xs="12"
					:sm="screenshotBlackUrl ? 10 : 12"
					class="pa-2"
				>
					<v-file-input
						v-model="blackImg"
						rounded
						label="Screenshot with black background"
						filled
						prepend-icon="mdi-monitor-screenshot"
						accept="image/jpeg"
						hide-details
						@change="onScreenshotBlackChange"
					/>
				</v-col>

				<ButtonDivider>
					<v-btn
						rounded
						color="primary"
						append
						:loading="loadingUploadScreenshots"
						:disabled="!(blackImg && whiteImg)"
						@click.prevent="uploadScreenshots"
					>
						Create overlay
						<v-icon right>mdi-image-edit-outline</v-icon>
					</v-btn>
				</ButtonDivider>
			</v-row>

			<v-row v-if="!!resultImage" class="ma-0">
				<v-col cols="12" xs="12" class="pa-0">
					<h2 class="box_text">
						3. Result
					</h2>
				</v-col>
				<v-col cols="12" xs="12" sm="4" class="pa-2">
					<v-img
						aspect-ratio="1.7778"
						class="placeholder"
						:src="
							`data:${resultImage.mimetype};base64,${resultImage.data}`
						"
						contain
						alt="Created overlay image"
						style="background: rgba(255, 255, 255, 0.20);"
						@click="download"
					/>
				</v-col>

				<v-col cols="12" xs="12" class="pa-0">
					<ButtonDivider>
						<DownloadButton
							tooltip="Download image"
							:download-function="download"
						>
							Save
						</DownloadButton>
					</ButtonDivider>
				</v-col>
			</v-row>
		</v-sheet>
	</v-container>
</template>

<script>
import Vue from 'vue'
import {
	createOverlayNXThemes,
	createOverlay
} from '@/graphql/CreateOverlay.gql'

export default Vue.extend({
	components: {
		ButtonDivider: () => import('@/components/buttons/ButtonDivider.vue'),
		DownloadButton: () => import('@/components/buttons/DownloadButton.vue')
	},
	data() {
		return {
			layoutJson: null,
			pieceJson: null,
			commonJson: null,
			loadingUploadLayout: false,
			blackImg: null,
			screenshotBlackUrl: null,
			whiteImg: null,
			screenshotWhiteUrl: null,
			resultImage: null,
			loadingUploadScreenshots: false
		}
	},
	methods: {
		uploadLayout() {
			this.loadingUploadLayout = true
			this.blackImg = null
			this.whiteImg = null

			this.$apollo
				.mutate({
					mutation: createOverlayNXThemes,
					variables: {
						layout: this.layoutJson,
						piece: this.pieceJson,
						common: this.commonJson
					}
				})
				.then(({ data }) => {
					this.loadingUploadLayout = false
					data.createOverlayNXThemes.forEach((file) => {
						this.downloadFileB64(
							file.data,
							file.mimetype,
							file.filename
						)
					})
				})
				.catch((err) => {
					this.$snackbar.error(err)
					this.loadingUploadLayout = false
				})
		},
		onScreenshotBlackChange(file) {
			if (file) {
				this.resultImage = null
				this.screenshotBlackUrl = URL.createObjectURL(file)
			}
		},
		onScreenshotWhiteChange(file) {
			if (file) {
				this.resultImage = null
				this.screenshotWhiteUrl = URL.createObjectURL(file)
			}
		},
		uploadScreenshots() {
			if (!(this.blackImg && this.whiteImg)) return

			this.resultImage = null
			this.loadingUploadScreenshots = true
			this.$apollo
				.mutate({
					mutation: createOverlay,
					variables: {
						blackImg: this.blackImg,
						whiteImg: this.whiteImg
					}
				})
				.then(({ data }) => {
					this.loadingUploadScreenshots = false
					this.resultImage = data.createOverlay

					const button = this.$refs.sheet
					const position = button.getBoundingClientRect().bottom
					window.scrollTo({ top: position, behavior: 'smooth' })
				})
				.catch((err) => {
					this.$snackbar.error(err)
					this.loadingUploadScreenshots = false
				})
		},
		download() {
			this.downloadFileB64(
				this.resultImage.data,
				'image/png',
				this.resultImage.filename
			)
		}
	},
	head() {
		const metaTitle = 'Overlay Creator | Tools'
		const metaDesc =
			'Create a transparent overlay for your layout and customizations.'
		const metaImg = null

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
})
</script>
