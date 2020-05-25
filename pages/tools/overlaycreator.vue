<template>
	<div no-gutters class="pa-2 box">
		<h1 class="boxt_text">
			Overlay Creator
		</h1>
		<div class="subtitle-1 boxt_text">
			Create a transparent overlay for your layout and customizations.
			This is required for layouts on this website.
		</div>
		<h2 class="boxt_text">
			1. Upload Layout
		</h2>
		<div class="subtitle-1 boxt_text">
			Upload your layout here. You will get two NXThemes: one with a black
			background and one with a white one (be sure to allow the site to
			download multiple files). For each do the following: install it on
			your Switch and take a screenshot of the menu the layout is for.
			Transfer them to your PC afterwards. Have you done that? Go to step
			2.
		</div>
		<v-row class="ma-0">
			<v-col cols="12" class="pa-2">
				<v-file-input
					label="Layout json"
					filled
					prepend-icon="mdi-code-json"
					accept="application/json"
					hide-details
					@change="onLayoutChange"
				/>
			</v-col>
		</v-row>
		<h2 class="boxt_text">
			2. Upload Screenshots
		</h2>
		<div class="subtitle-1 boxt_text">
			Here you will upload the two screenshots you took at step 1. Upload
			them to their own field below.
		</div>
		<v-row class="ma-0">
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
					:src="screenshotBlackUrl"
					:lazy-src="'/logo_16-9-256.jpg'"
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
					label="Screenshot with black background"
					filled
					prepend-icon="mdi-monitor-screenshot"
					accept="image/jpeg"
					hide-details
					@change="onScreenshotBlackChange"
				/>
			</v-col>
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
					:src="screenshotWhiteUrl"
					:lazy-src="'/logo_16-9-256.jpg'"
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
					label="Screenshot with white background"
					filled
					prepend-icon="mdi-monitor-screenshot"
					accept="image/jpeg"
					hide-details
					@change="onScreenshotWhiteChange"
				/>
			</v-col>
			<v-flex
				v-if="blackImg && whiteImg"
				class="d-flex justify-center  mt-3"
			>
				<v-btn
					color="primary"
					class="mx-2"
					append
					:loading="loadingUploadScreenshots"
					@click.prevent="uploadScreenshots"
				>
					Create <v-icon right>mdi-image-edit-outline</v-icon>
				</v-btn>
				<v-btn
					v-if="resultImage"
					class="mx-2"
					color="secondary"
					append
					@click.prevent="
						downloadFileB64(
							resultImage.data,
							'image/png',
							resultImage.filename
						)
					"
				>
					Download <v-icon right>mdi-download-box-outline</v-icon>
				</v-btn>
			</v-flex>
		</v-row>
		<h2 v-if="resultImage" class="boxt_text">
			Result
		</h2>
		<v-col v-if="resultImage" cols="12" xs="12" sm="4" class="pa-2">
			<v-img
				aspect-ratio="1.7778"
				:src="`data:${resultImage.mimetype};base64,${resultImage.data}`"
				:lazy-src="'/logo_16-9-256.jpg'"
				contain
				alt="Created overlay image"
				style="background: rgba(255, 255, 255, 0.20);"
			/>
		</v-col>
	</div>
</template>

<script>
import Vue from 'vue'
import CreateOverlay from '@/graphql/CreateOverlay.gql'

export default Vue.extend({
	data() {
		return {
			layoutJson: null,
			loadingUploadLayout: false,
			blackImg: null,
			screenshotBlackUrl: null,
			whiteImg: null,
			screenshotWhiteUrl: null,
			resultImage: null,
			loadingUploadScreenshots: false
		}
	},
	apollo: {},
	methods: {
		onLayoutChange(file) {
			if (file) {
				this.layoutJson = file
				this.uploadLayout()
			}
		},
		uploadLayout() {
			if (!this.layoutJson) return

			this.loadingUploadLayout = true
			this.$apollo
				.mutate({
					mutation: CreateOverlay.createOverlaysNXTheme,
					variables: {
						layout: this.layoutJson
					}
				})
				.then(({ data }) => {
					this.loadingUploadLayout = false
					data.createOverlaysNXTheme.forEach((file) => {
						this.downloadFileB64(
							file.data,
							'application/nxtheme',
							file.filename
						)
					})
				})
		},
		onScreenshotBlackChange(file) {
			if (file) {
				this.blackImg = file
				this.screenshotBlackUrl = URL.createObjectURL(file)
			}
		},
		onScreenshotWhiteChange(file) {
			if (file) {
				this.whiteImg = file
				this.screenshotWhiteUrl = URL.createObjectURL(file)
			}
		},
		uploadScreenshots() {
			if (!(this.blackImg && this.whiteImg)) return

			this.loadingUploadScreenshots = true
			this.$apollo
				.mutate({
					mutation: CreateOverlay.createOverlay,
					variables: {
						blackImg: this.blackImg,
						whiteImg: this.whiteImg
					}
				})
				.then(({ data }) => {
					this.resultImage = data.createOverlay
					this.loadingUploadScreenshots = false
				})
		}
	}
})
</script>
