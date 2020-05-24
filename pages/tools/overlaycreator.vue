<template>
	<div no-gutters class="pa-2 box">
		<h1 class="boxt_text">
			Create Overlay
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
					@change="onScreenshotWhiteChange"
				/>
			</v-col>
			<v-flex v-if="blackImg && whiteImg" class="d-flex justify-center">
				<v-btn color="secondary" append @click.prevent="upload">
					Create <v-icon right>mdi-download-box-outline</v-icon>
				</v-btn>
			</v-flex>
		</v-row>
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
			screenshotWhiteUrl: null
		}
	},
	apollo: {},
	methods: {
		onScreenshotBlackChange(file) {
			if (file) {
				console.log(file)
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
			this.$apollo.mutate({
				mutation: UploadQueries.createOverlay,
				variables: { blackImg: this.blackImg, whiteImg: this.whiteImg },
				onCompleted: (data) => {
					console.log(data)
				},
				onError: (data) => {
					console.error(data)
				}
			})
		}
	}
})
</script>
