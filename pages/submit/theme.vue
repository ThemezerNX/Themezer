<template>
	<div no-gutters class="pa-2 box">
		<h1 class="box_text">
			Theme Submissions
		</h1>
		<div class="subtitle-1 box_text">
			You can submit themes here for listing on this website. The
			following questions will guide you through the process.
		</div>
		<div class="subtitle-1 box_text">
			If you downloaded a layout from this website it included a Themezer
			'ID' key in the .json file. You must never edit these values! These
			are used to indicate which layout was used so that when people
			download your theme, they also get the most up-to-date version of
			the layout and customization options. If you downloaded the layout
			from elsewhere and it doesn't include the two entries, you should
			try to find the layout in
			<nuxt-link exact to="/layouts">
				the Layouts section.
			</nuxt-link>
			Be really sure it is the exact same layout, or else you might lose
			some features!
		</div>
		<template v-for="QnA in QnAs">
			<h4 :key="QnA.Q" class="box_text font-italic mt-1">
				{{ QnA.Q }}
			</h4>
			<div :key="QnA.A" class="subtitle-2 box_text font-weight-light">
				{{ QnA.A }}
			</div>
		</template>

		<h2 class="box_text">
			1. Upload the theme
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
					:loading="loading.uploadSingleOrZip"
					label=".NXTheme file"
					filled
					prepend-icon="mdi-file-outline"
					accept=".nxtheme"
					hide-details
					:rules="[rules.required]"
					@change="onFileChange"
				/>
				<div v-if="selectedType === 'zip'">
					<div class="subtitle-1 box_text">
						Make sure the .NXThemes are in the root of the .zip (not
						in a folder)!
					</div>
					<v-file-input
						v-if="selectedType === 'zip'"
						v-model="uploadSingleOrZip"
						:loading="loading.uploadSingleOrZip"
						label=".zip file"
						filled
						:rules="[rules.required]"
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
					<nuxt-link to="/tools/create-nxtheme"
						>creation tool on this website
					</nuxt-link>
					or using the
					<a
						href="https://github.com/exelix11/SwitchThemeInjector"
						target="_blank"
						>Switch Theme Injector</a
					>. You may return after creating an NXTheme/NXThemes.
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
							You must upload a screenshot or an image created
							using an overlay.png (NOT simply the background
							image!) for every theme you upload. Do so by
							clicking the placeholder image.
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
											<v-hover v-slot:default="{ hover }">
												<v-img
													aspect-ratio="1.7778"
													:src="
														uploadedScreenshotsUrls[
															i
														]
															? uploadedScreenshotsUrls[
																	i
															  ]
															: ''
													"
													:lazy-src="
														'/logo_16-9-256.jpg'
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
																label="Upload Screenshot* (.jpg)"
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
											</div>
											<v-list-item-subtitle
												v-if="theme.layout"
											>
												Layout:
												<a
													exact
													:href="
														`/layouts/${fileNameToWebName(
															theme.layout.target
														)}/${createUrlString(
															theme.layout.id,
															theme.layout.details
																.name
														)}`
													"
													target="_blank"
												>
													{{
														theme.layout.details
															.name
													}}
												</a>
											</v-list-item-subtitle>
											<v-list-item-subtitle
												v-if="
													theme.layout &&
														theme.used_pieces &&
														theme.used_pieces
															.length > 0
												"
											>
												Options:
												{{
													optionsString(
														theme.used_pieces
													)
												}}
											</v-list-item-subtitle>
											<v-list-item-subtitle v-else>
												The layout was not found in the
												database. Please read the
												information at the top of this
												page.
											</v-list-item-subtitle>
											<v-list-item-subtitle
												v-if="
													theme.layout &&
														theme.layout
															.has_commonlayout
												"
											>
												Has a modified Common layout
											</v-list-item-subtitle>
										</v-col>
										<v-col class="pb-0">
											<v-text-field
												v-model="
													detectedThemes[i]
														.description
												"
												label="Theme description"
												outlined
												prepend-icon="mdi-pencil-outline"
												@change="forceUpdate++"
											></v-text-field>
											<v-text-field
												v-if="!theme.info.Author"
												v-model="
													detectedThemes[i].authorname
												"
												label="Author Name*"
												outlined
												:rules="[rules.required]"
												prepend-icon="mdi-account-outline"
												@change="forceUpdate++"
											></v-text-field>
											<v-combobox
												v-model="
													detectedThemes[i].categories
												"
												:items="
													categories &&
													categories.length > 0
														? categories
														: []
												"
												outlined
												allow-overflow
												chips
												small-chips
												deletable-chips
												:rules="[rules.category_length]"
												prepend-icon="mdi-shape-outline"
												label="Categories*"
												multiple
											></v-combobox>
											<!-- <v-text-field
												v-model="
													detectedThemes[i].color
												"
												label="Theme card color on Themezer"
												:color="detectedThemes[i].color"
												outlined
												:rules="[rules.hex]"
												prepend-icon="mdi-format-color-fill"
												@change="
													forceUpdate++
													detectedThemes[i].color ===
													''
														? (detectedThemes[
																i
														  ].color = null)
														: null
												"
											></v-text-field> -->
											<v-text-field
												v-if="
													selectedSubmitType ===
														'separate'
												"
												v-model="
													detectedThemes[i].version
												"
												label="Theme version*"
												outlined
												:rules="[rules.required]"
												prepend-icon="mdi-update"
												@change="forceUpdate++"
											></v-text-field>
											<v-checkbox
												v-model="detectedThemes[i].nsfw"
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
							label="Pack Name*"
							outlined
							prepend-icon="mdi-pencil-outline"
							:rules="[rules.required]"
							@change="forceUpdate++"
						></v-text-field>
						<v-row>
							<v-col
								v-if="selectedSubmitType === 'pack'"
								class="py-0"
								cols="12"
								xs="12"
								sm="6"
								md="6"
								lg="6"
								xl="6"
							>
								<v-text-field
									v-model="submitDetails.author.name"
									label="Author Name*"
									outlined
									:rules="[rules.required]"
									prepend-icon="mdi-account-outline"
									@change="forceUpdate++"
								></v-text-field>
							</v-col>

							<v-col
								class="py-0"
								cols="12"
								xs="12"
								:sm="selectedSubmitType === 'pack' ? 6 : 12"
								:md="selectedSubmitType === 'pack' ? 6 : 12"
								:lg="selectedSubmitType === 'pack' ? 6 : 12"
								:xl="selectedSubmitType === 'pack' ? 6 : 12"
							>
								<v-text-field
									v-model="submitDetails.author.discord_tag"
									label="Author's Discord (Username#1234)"
									outlined
									prepend-icon="mdi-discord"
									:rules="[rules.discord]"
									@change="
										forceUpdate++
										submitDetails.author.discord_tag === ''
											? (submitDetails.author.discord_tag = null)
											: null
									"
								></v-text-field>
							</v-col>
						</v-row>
						<v-text-field
							v-if="selectedSubmitType === 'pack'"
							v-model="submitDetails.description"
							label="Pack Description*"
							outlined
							:rules="[rules.required]"
							prepend-icon="mdi-pencil-outline"
							@change="forceUpdate++"
						></v-text-field>
						<v-combobox
							v-if="detectedThemes.length > 1"
							v-model="packCategories"
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
							:rules="[rules.category_length]"
							prepend-icon="mdi-shape-outline"
							label="Shared categories (this will remove the current set)"
							multiple
						></v-combobox>
						<!-- <v-text-field
							v-if="selectedSubmitType === 'pack'"
							v-model="submitDetails.color"
							label="Pack card color on Themezer"
							:color="submitDetails.color"
							outlined
							:rules="[rules.hex]"
							prepend-icon="mdi-format-color-fill"
							@change="
								forceUpdate++
								submitDetails.color === ''
									? (submitDetails.color = null)
									: null
							"
						></v-text-field> -->
						<v-text-field
							v-if="selectedSubmitType === 'pack'"
							v-model="submitDetails.version"
							label="Pack version*"
							outlined
							:rules="[rules.required]"
							prepend-icon="mdi-update"
							@change="forceUpdate++"
						></v-text-field>
						<v-btn
							color="secondary"
							type="submit"
							:loading="loading.submit"
							:disabled="!submitValid"
							@click.prevent="submit()"
						>
							Submit
						</v-btn>
					</v-col>
				</v-row>
			</div>
		</v-form>
		<v-snackbar
			v-model="snackbar"
			bottom
			:timeout="8000"
			:color="error ? 'error' : 'green'"
		>
			{{ error || message }}
		</v-snackbar>
	</div>
</template>

<script>
import Vue from 'vue'
import { allCategories } from '@/graphql/Filtering.gql'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '@/components/mixins/urlParser'
import { uploadSingleOrZip, submitThemes } from '@/graphql/SubmitTheme.gql'

export default Vue.extend({
	mixins: [targetParser, urlParser],
	apollo: {
		categories: {
			query: allCategories,
			prefetch: false,
			skip: true
		}
	},
	data() {
		return {
			metaTitle: 'Theme | Submit',
			metaDesc: 'You can submit themes here for listing on this website.',
			forceUpdate: 0,
			snackbar: false,
			error: null,
			message: null,
			QnAs: [
				{
					Q:
						"I couldn't find the layout in the Layouts GitHub repository/I made the layout myself (not just edited another one)",
					A:
						'Consider uploading it to the Layouts GitHub repository or asking the Author to do so.'
				},
				{
					Q: 'My layout .json differs only by a bit',
					A:
						'Try recreating your theme via the layouts section on this website and see if it your theme is fine after testing it on your Switch.'
				},
				{
					Q: 'It looks different',
					A:
						'Consider adding a customization option to the Layouts GitHub repository.'
				},
				{
					Q: "I don't know how to 'GitHub'",
					A:
						'First read the instructions in the GitHub repository. If you are still unsure on how to contribute, ask someone else for help or Google it.'
				},
				{
					Q:
						"I am really sure don't want my theme to receive automatic layout updates",
					A: 'Ok. Why not? But okay go ahead submit it...'
				}
			],
			types: [
				{
					id: 'single',
					label: 'A single .NXTheme'
				},
				{
					id: 'zip',
					label: 'A .zip with .NXThemes (max 25MB)'
				}
				// {
				// 	id: 'files',
				// 	label: 'Separate files',
				// 	disabled: true
				// }
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
			selectedType: null,
			uploadSingleOrZip: null,
			loading: {
				uploadSingleOrZip: false,
				submit: false
			},
			detectedThemes: null,
			uploadedScreenshots: [],
			uploadedScreenshotsUrls: [],
			selectedSubmitType: null,
			submitValid: false,
			rules: {
				required: (value) => !!value || 'Required',
				category_length: (values) =>
					!values ||
					!values.some((v) => v.length <= 2) ||
					'A category must be longer than 2 characters',
				hex: (value) =>
					!value ||
					(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
						? true
						: 'Invalid HEX color'),
				discord: (value) =>
					!value ||
					(/^((.+?)#\d{4})/.test(value)
						? true
						: 'Invalid Discord Username#tag')
			},
			packCategories: [],
			submitDetails: {
				name: null,
				author: {
					name: null,
					discord_tag: null
				},
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
				author: {
					name: null,
					discord_tag: null
				},
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
					})
					.catch((error) => {
						// eslint-disable-next-line no-console
						console.error(error)
						const parsedError = JSON.parse(JSON.stringify(error))
						if (
							parsedError.graphQLErrors &&
							parsedError.graphQLErrors.length > 0 &&
							parsedError.graphQLErrors[0].message
						) {
							this.error = parsedError.graphQLErrors[0].message
						} else {
							this.error = error.message
								.toString()
								.replace('GraphQL error: ', '')
						}
						this.loading.uploadSingleOrZip = false
						this.snackbar = true
						setTimeout(() => {
							this.error = null
						}, 8100)
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
						layout_uuid: t.layout ? t.layout.uuid : null,
						used_pieces: t.used_pieces,
						target: t.target,
						color: t.color,
						description: t.description,
						version: t.version,
						authorname: t.authorname,
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
							if (this.selectedSubmitType === 'pack') {
								this.message = 'Pack submitted successfully!'
							} else {
								this.message = 'Themes submitted successfully!'
							}
							this.loading.submit = false
							this.clearAll()
						} else {
							this.error = 'Unknown error'
							setTimeout(() => {
								this.error = null
							}, 8100)
						}
						this.snackbar = true
					})
					.catch((error) => {
						// eslint-disable-next-line no-console
						console.error(error)
						const parsedError = JSON.parse(JSON.stringify(error))
						if (
							parsedError.graphQLErrors &&
							parsedError.graphQLErrors.length > 0 &&
							parsedError.graphQLErrors[0].message
						) {
							this.error = parsedError.graphQLErrors[0].message
						} else {
							this.error = error.message
								.toString()
								.replace('GraphQL error: ', '')
						}
						this.loading.submit = false
						this.snackbar = true
						setTimeout(() => {
							this.error = null
						}, 8100)
					})
			}
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

.v-autocomplete__content.v-menu__content {
	box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
		0px 8px 10px 1px rgba(0, 0, 0, 0.14),
		0px 3px 14px 2px rgba(0, 0, 0, 0.12);
}
</style>
