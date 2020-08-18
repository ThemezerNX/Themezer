<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<v-sheet no-gutters class="pa-2 box_fill">
			<h1 class="box_text">
				Theme/Pack Submissions
			</h1>
			<div class="subtitle-1 box_text">
				You can submit themes here for listing on this Themezer.
			</div>
			<div class="subtitle-1 box_text">
				If you downloaded the theme from elsewhere and Themezer doesn't
				recognize the layout, you should try to find the layout in
				<nuxt-link exact to="/layouts">
					the Layouts section
				</nuxt-link>
				and select it in the dropdown. Be really sure it is the exact
				same layout, or else you might lose some features! For more
				detailed instructions,
				<v-btn
					text
					color="primary"
					style="height: 24px"
					rounded
					class="px-1"
					@click="FAQDialog = true"
					>read the FAQ</v-btn
				>
				<v-dialog v-model="FAQDialog" max-width="800" class="mx-auto">
					<v-card>
						<v-card-title
							class="title font-weight-regular justify-space-between"
						>
							<span>FAQ</span>
							<v-spacer></v-spacer>

							<v-btn rounded icon @click="FAQDialog = false">
								<v-icon>
									mdi-close
								</v-icon>
							</v-btn>
						</v-card-title>

						<v-card-text>
							<template v-for="faq in FAQ">
								<h4
									:key="faq.Q"
									class="box_text font-italic mt-1"
								>
									{{ faq.Q }}
								</h4>
								<div
									:key="faq.A"
									class="subtitle-2 box_text font-weight-light"
								>
									{{ faq.A }}
								</div>
							</template>
						</v-card-text>
					</v-card>
				</v-dialog>
			</div>

			<h2 class="box_text">
				1. Upload the theme/pack
			</h2>
			<v-row class="ma-0">
				<v-col cols="12" class="pa-2">
					<div class="subtitle-1 box_text font-italic">
						I have...
					</div>
					<v-radio-group v-model="selectedType" row class="mt-0">
						<v-radio
							v-for="type in types"
							:key="type.id"
							:label="type.label"
							:value="type.id"
							:disabled="type.disabled"
							@change="clearAll()"
						></v-radio>
					</v-radio-group>
					<v-file-input
						v-if="selectedType === 'single'"
						v-model="uploadSingleOrZip"
						rounded
						:loading="loading.uploadSingleOrZip"
						label=".NXTheme file"
						filled
						prepend-icon="mdi-file-outline"
						accept=".nxtheme"
						hide-details
						@change="onFileChange"
					/>
					<div v-if="selectedType === 'zip'">
						<div class="subtitle-1 box_text">
							Make sure the .NXThemes are in the root of the .zip
							(not in a folder)!
						</div>
						<v-file-input
							v-if="selectedType === 'zip'"
							v-model="uploadSingleOrZip"
							rounded
							:loading="loading.uploadSingleOrZip"
							label=".zip file"
							filled
							prepend-icon="mdi-folder-zip-outline"
							accept="application/zip"
							hide-details
							@change="onFileChange"
						/>
					</div>

					<div
						v-if="selectedType === 'files'"
						class="subtitle-1 box_text"
					>
						You can create NXThemes using the
						<a
							href="https://exelix11.github.io/SwitchThemeInjector/v2/"
							target="_blank"
							>WebInjector</a
						>. You may submit the created NXTheme here.
					</div>
				</v-col>
			</v-row>
			<v-form ref="submitForm" v-model="submitValid">
				<div v-if="detectedThemes">
					<h2 class="box_text">
						2. Detected Data
					</h2>
					<div v-if="detectedThemes.length === 0">
						Uhm something went wrong, please report this.
					</div>
					<v-row v-else class="ma-0">
						<v-col cols="12" class="pa-2">
							<div class="subtitle-1 box_text">
								You must upload a screenshot (NOT simply the
								background image!) or an image created using an
								overlay.png downloaded from the layout's page
								for every theme you upload. Do so by clicking
								the placeholder image.
							</div>
							<div class="subtitle-1 box_text font-italic">
								{{
									detectedThemes.length > 1
										? 'The following NXThemes were detected:'
										: 'The following NXTheme was detected:'
								}}
							</div>
							<template v-for="(theme, i) in detectedThemes">
								<v-card
									v-if="theme"
									:key="theme.info.ThemeName"
									style="border-radius: 10px;"
									class="mx-auto"
									:class="
										i === detectedThemes.length - 1
											? ''
											: 'mb-2'
									"
									outlined
								>
									<v-list-item three-line class="px-0">
										<v-list-item-content class="pa-0">
											<v-col
												cols="12"
												xs="12"
												sm="4"
												md="2"
												class="pa-2"
											>
												<v-hover
													v-slot:default="{ hover }"
												>
													<v-img
														aspect-ratio="1.7778"
														class="placeholder"
														:src="
															uploadedScreenshotsUrls[
																i
															] || ''
														"
														contain
													>
														<v-expand-transition>
															<div
																v-if="
																	!uploadedScreenshots[
																		i
																	] || hover
																"
																class="d-flex display-3 transition-fast-in-fast-out v-card--reveal"
																style="height: 100%; background: rgba(0, 0, 0, 0.5);"
															>
																<v-file-input
																	v-model="
																		uploadedScreenshots[
																			i
																		]
																	"
																	full-width
																	height="100%"
																	label="Upload Screenshot* (jpg, 1280x720)"
																	class="screenshot_upload"
																	filled
																	color="black"
																	accept="image/jpeg"
																	hide-details
																	:rules="[
																		rules.required
																	]"
																	style="cursor: pointer;"
																	@change="
																		onScreenshotChange(
																			$event,
																			i
																		)
																	"
																/>
															</div>
														</v-expand-transition>
													</v-img>
												</v-hover>
											</v-col>
											<v-col
												cols="12"
												xs="12"
												sm="8"
												md="10"
												class="pa-2"
												style="position: relative;"
											>
												<h1>
													{{ theme.info.ThemeName }}
												</h1>
												<div
													v-if="theme.info.Author"
													class="subtitle-1"
												>
													By {{ theme.info.Author }}
													<i class="subtitle-2">
														(this will be replaced
														with YOUR username)
													</i>
												</div>
												<v-list-item-subtitle
													v-if="theme.layout"
												>
													Layout:
													<nuxt-link
														exact
														:to="
															`/layouts/${fileNameToWebName(
																theme.layout
																	.target
															)}/${createUrlString(
																theme.layout.id,
																theme.layout
																	.details
																	.name
															)}`
														"
														target="_blank"
													>
														{{
															theme.layout.details
																.name
														}}
													</nuxt-link>
													<div
														v-if="
															theme.used_pieces &&
																theme
																	.used_pieces
																	.length > 0
														"
													>
														Options:
														{{
															optionsString(
																theme.used_pieces
															)
														}}
													</div>
												</v-list-item-subtitle>
												<v-list-item-subtitle v-else>
													The layout was not found on
													Themezer
												</v-list-item-subtitle>
												<v-list-item-subtitle
													v-if="
														theme.layout &&
															theme.layout
																.has_commonlayout
													"
												>
													Common layout: ✅
												</v-list-item-subtitle>
											</v-col>
											<v-col class="pb-0">
												<v-autocomplete
													v-if="!theme.layout"
													v-model="
														detectedThemes[i]
															.layout_id
													"
													:items="layoutList"
													auto-select-first
													label="Manual layout selection"
													prepend-icon="mdi-code-json"
													outlined
													rounded
													allow-overflow
													@mouseover="
														currentThemeTarget =
															theme.target
													"
												>
												</v-autocomplete>
												<v-text-field
													v-model="
														detectedThemes[i]
															.description
													"
													rounded
													label="Theme description"
													minlength="10"
													maxlength="500"
													counter="500"
													outlined
													:rules="[
														rules.description_length
													]"
													prepend-icon="mdi-pencil-outline"
													@change="forceUpdate++"
												></v-text-field>
												<v-combobox
													v-model="
														detectedThemes[i]
															.categories
													"
													:items="
														categories &&
														categories.length > 0
															? categories.filter(
																	(c) =>
																		c !==
																		'NSFW'
															  )
															: []
													"
													outlined
													rounded
													allow-overflow
													chips
													small-chips
													deletable-chips
													:rules="[
														rules.category_length,
														rules.min_category_amount,
														rules.max_category_amount,
														rules.required
													]"
													prepend-icon="mdi-shape-outline"
													label="Categories*"
													multiple
												></v-combobox>
												<v-text-field
													v-if="
														selectedSubmitType ===
															'separate'
													"
													v-model="
														detectedThemes[i]
															.version
													"
													rounded
													maxlength="10"
													counter="10"
													label="Theme version*"
													outlined
													:rules="[rules.required]"
													prepend-icon="mdi-update"
													@change="forceUpdate++"
												></v-text-field>
												<v-checkbox
													v-model="
														detectedThemes[i].nsfw
													"
													label="NSFW"
													class="mt-0"
												/>
											</v-col>
										</v-list-item-content>
									</v-list-item>
								</v-card>
								<div
									v-else
									:key="theme"
									class="subtitle-1 box_text font-italic"
								>
									An error occuered
								</div>
							</template>
						</v-col>
					</v-row>
				</div>
				<!-- <div
				v-if="
					detectedThemes &&
						uploadedScreenshots.length === detectedThemes.length
				"
			> -->
				<div v-if="detectedThemes">
					<h2 class="box_text">
						3. Submission Details
					</h2>
					<v-row class="ma-0">
						<v-col cols="12" class="pa-2">
							<v-radio-group
								v-model="selectedSubmitType"
								row
								mandatory
								class="mt-0"
							>
								<v-radio
									v-for="type in submitTypes"
									:key="type.id"
									:label="type.label"
									:disabled="
										(type.id === 'pack' &&
											detectedThemes.length === 1) ||
											type.disabled
									"
									:value="type.id"
									@change="clearSwitchSubmitType()"
								></v-radio>
							</v-radio-group>
							<v-text-field
								v-if="selectedSubmitType === 'pack'"
								v-model="submitDetails.name"
								rounded
								minlength="3"
								maxlength="50"
								counter="50"
								label="Pack Name*"
								outlined
								prepend-icon="mdi-pencil-outline"
								:rules="[rules.required, rules.name_length]"
								@change="forceUpdate++"
							></v-text-field>
							<v-text-field
								v-if="selectedSubmitType === 'pack'"
								v-model="submitDetails.description"
								rounded
								minlength="10"
								maxlength="500"
								counter="500"
								label="Pack Description*"
								outlined
								:rules="[
									rules.required,
									rules.description_length
								]"
								prepend-icon="mdi-pencil-outline"
								@change="forceUpdate++"
							></v-text-field>
							<v-combobox
								v-if="detectedThemes.length > 1"
								v-model="packCategories"
								rounded
								:items="
									categories && categories.length > 0
										? categories
										: []
								"
								outlined
								allow-overflow
								chips
								small-chips
								deletable-chips
								:rules="[
									rules.category_length,
									rules.max_category_amount
								]"
								prepend-icon="mdi-shape-outline"
								label="Shared categories (this will remove the current set)"
								multiple
							></v-combobox>
							<v-text-field
								v-if="selectedSubmitType === 'pack'"
								v-model="submitDetails.version"
								rounded
								label="Pack version*"
								maxlength="10"
								counter="10"
								outlined
								:rules="[rules.required]"
								prepend-icon="mdi-update"
								@change="forceUpdate++"
							></v-text-field>
							<v-btn
								color="secondary"
								rounded
								type="submit"
								:loading="loading.submit"
								:disabled="!submitValid"
								@click.prevent="submit()"
							>
								Submit <v-icon right>mdi-cube-send</v-icon>
							</v-btn>
						</v-col>
					</v-row>
				</div>
			</v-form>
		</v-sheet>
	</v-container>
</template>

<script>
import Vue from 'vue'
import { allCategories } from '@/graphql/Filtering.gql'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '@/components/mixins/urlParser'
import {
	allLayouts,
	uploadSingleOrZip,
	submitThemes
} from '@/graphql/SubmitTheme.gql'

export default Vue.extend({
	middleware: ['auth'],
	options: {
		auth: true
	},
	mixins: [targetParser, urlParser],
	apollo: {
		categories: {
			query: allCategories,
			prefetch: false,
			skip: true,
			error(e) {
				this.$nuxt.error(e)
			},
			update(res) {
				return res?.categories.sort((a, b) =>
					a.toLowerCase().localeCompare(b.toLowerCase())
				)
			}
		},
		layoutList: {
			query: allLayouts,
			variables() {
				return {
					target: this.currentThemeTarget
				}
			},
			update(data) {
				if (data?.layoutList) {
					return data.layoutList
						.map((l) => {
							return {
								text: `'${l.details.name}' by ${l.creator.display_name}`,
								value: l.id
							}
						})
						.sort((a, b) =>
							a.text
								.toLowerCase()
								.localeCompare(b.text.toLowerCase())
						)
				} else return []
			},
			error(e) {
				this.$nuxt.error(e)
			},
			prefetch: false,
			skip: true
		}
	},
	data() {
		return {
			forceUpdate: 0,
			types: [
				{
					id: 'single',
					label: 'A single .NXTheme'
				},
				{
					id: 'zip',
					label: 'A .zip with .NXThemes (max 25MB)'
				},
				{
					id: 'files',
					label: 'An image'
				}
			],
			submitTypes: [
				{
					id: 'pack',
					label: 'Theme Pack'
				},
				{
					id: 'separate',
					label: 'Separate Themes'
				}
			],
			FAQ: [
				{
					Q: 'I am not the original author of this theme/pack',
					A:
						'Unfortunately you may not submit it, because it will be linked to your account'
				},
				{
					Q: "I couldn't find the layout/I made the layout myself",
					A:
						'Consider uploading it to the Layouts GitHub repository or asking the original Creator to do so.'
				},
				{
					Q: 'I have modified another layout a bit',
					A:
						'Consider adding a customization option to the original in the Layouts GitHub repository.'
				},
				{
					Q: 'My layout differs a bit',
					A:
						'Try recreating your theme and see if it is fine after testing it on your Switch.'
				},
				{
					Q: 'It looks different',
					A:
						'Consider adding a customization option to the original in the Layouts GitHub repository.'
				},
				{
					Q: "I don't know how to 'GitHub'",
					A:
						'First read the instructions in the GitHub repository. If you are still unsure on how to contribute, ask someone else for help or Google it.'
				},
				{
					Q:
						"I am really sure don't want my theme to receive automatic updates",
					A:
						"Uhm... why not? It's frii. Anyway, feel free to submit it."
				}
			],
			FAQDialog: false,
			selectedType: null,
			uploadSingleOrZip: null,
			loading: {
				uploadSingleOrZip: false,
				submit: false
			},
			currentThemeTarget: null,
			detectedThemes: null,
			uploadedScreenshots: [],
			uploadedScreenshotsUrls: [],
			selectedSubmitType: null,
			submitValid: false,
			rules: {
				description_length: (value) =>
					!value ||
					(value.length >= 10 && value.length <= 500) ||
					'A description must be between 9 and 501 characters long',
				name_length: (value) =>
					!value ||
					(value.length >= 3 && value.length <= 50) ||
					'A name must be between 2 and 51 characters long',
				required: (value) => !!value || 'Required',
				category_length: (values) =>
					!values ||
					!values.some((v) => v.length <= 2) ||
					'A category must be longer than 2 characters',
				min_category_amount: (values) =>
					!values ||
					values.length > 0 ||
					'At least 1 category is required',
				max_category_amount: (values) =>
					!values ||
					values.length <= 10 ||
					'A maximum of 10 categories is allowed',
				hex: (value) =>
					!value ||
					(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
						? true
						: 'Invalid HEX color')
			},
			packCategories: [],
			submitDetails: {
				name: null,
				description: null,
				color: null,
				version: null
			}
		}
	},
	watch: {
		packCategories() {
			this.detectedThemes.forEach((t) => {
				t.categories = this.packCategories
			})
		}
	},
	methods: {
		clearAll() {
			this.uploadSingleOrZip = null
			this.loading.uploadSingleOrZip = false
			this.loading.submit = false
			this.detectedThemes = null
			this.uploadedScreenshots = []
			this.uploadedScreenshotsUrls = []
			this.selectedSubmitType = null
			this.submitValid = false
			this.submitDetails = {
				name: null,
				description: null,
				color: null,
				version: null
			}
		},
		clearSwitchSubmitType() {
			for (const i in this.detectedThemes) {
				this.detectedThemes[i].version = null
			}
		},
		onFileChange(file) {
			if (file) {
				this.loading.uploadSingleOrZip = true

				this.$apollo
					.mutate({
						mutation: uploadSingleOrZip,
						variables: {
							file
						}
					})
					.then(({ data }) => {
						this.loading.uploadSingleOrZip = false

						this.detectedThemes = data.uploadSingleOrZip

						this.$apollo.queries.categories.skip = false
						this.$apollo.queries.categories.refetch()
						this.$apollo.queries.layoutList.skip = false
						this.$apollo.queries.layoutList.refetch()
					})
					.catch((err) => {
						this.$snackbar.error(err)
						this.loading.uploadSingleOrZip = false
					})
			}
		},
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
		onScreenshotChange(file, i) {
			if (file) {
				this.uploadedScreenshotsUrls[i] = URL.createObjectURL(file)

				this.forceUpdate++
			}
		},
		submit() {
			if (
				this.uploadedScreenshots.length === this.detectedThemes.length
			) {
				const themeInput = this.detectedThemes.map((t) => {
					return {
						info: t.info,
						tmp: t.tmp,
						layout_id: t.layout ? t.layout.id : t.layout_id || null,
						used_pieces: t.used_pieces,
						target: t.target,
						color: t.color,
						description: t.description,
						version: t.version,
						categories: t.categories,
						nsfw: t.nsfw
					}
				})

				this.$apollo
					.mutate({
						mutation: submitThemes,
						variables: {
							files: this.uploadedScreenshots,
							themes: themeInput,
							details: this.submitDetails,
							type: this.selectedSubmitType
						}
					})
					.then(({ data }) => {
						if (data.submitThemes === true) {
							let message
							if (this.selectedSubmitType === 'pack') {
								message = 'Pack submitted successfully!'
							} else {
								message = 'Themes submitted successfully!'
							}
							this.loading.submit = false
							this.clearAll()
							this.$snackbar.message(message)
						} else {
							this.$snackbar.error(new Error('Unknown error'))
						}
					})
					.catch((err) => {
						this.$snackbar.error(err)
						this.loading.submit = false
					})
			}
		}
	},
	head() {
		const metaTitle = 'Theme | Submit'
		const metaDesc =
			'You can submit themes here for listing on this website.'
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

<style lang="scss">
.screenshot_upload .v-input__control {
	height: 100%;
}

.screenshot_upload .v-input__slot {
	cursor: pointer !important;
}

.screenshot_upload .v-text-field__slot label,
.screenshot_upload .v-text-field__slot .v-file-input__text {
	width: 100%;
	max-width: unset;
	text-align: center;
}

.screenshot_upload .v-input__append-inner,
.screenshot_upload .v-input__prepend-outer {
	display: none;
}
</style>
