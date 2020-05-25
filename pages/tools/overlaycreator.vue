<template>
	<div no-gutters class="pa-2 box">
		<h1 class="boxt_text">
			Overlay Creator
		</h1>
		<div class="subtitle-1 boxt_text">
			Create a transparent overlay from two screenshots: one of the layout
			with a pure black background and one with a pure white background.
			An overlay is required for layouts on this website.
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
					:loading="loading"
					@click.prevent="upload"
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
		<h1 v-if="resultImage" class="boxt_text">
			Result
		</h1>
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
import UploadQueries from '@/graphql/UploadQueries.gql'

export default Vue.extend({
	data() {
		return {
			blackImg: null,
			screenshotBlackUrl: null,
			whiteImg: null,
			screenshotWhiteUrl: null,
			resultImage: null,
			loading: false
		}
	},
	apollo: {},
	methods: {
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
		upload() {
			if (!(this.blackImg && this.whiteImg)) return
			this.loading = true
			this.$apollo
				.mutate({
					mutation: UploadQueries.createOverlay,
					variables: {
						blackImg: this.blackImg,
						whiteImg: this.whiteImg
					}
				})
				.then(({ data }) => {
					this.resultImage = data.createOverlay
					this.loading = false
				})
		}
	}
})
</script>
