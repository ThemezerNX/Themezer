<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<LoadingOverlay :loading="!!$apollo.queries.theme.loading">
			<v-sheet v-if="theme" no-gutters class="pa-2 box_fill">
				<h1 class="box_text">Edit Theme</h1>
				<h2 class="box_text mt-0">
					<nuxt-link
						class="font-weight-bold"
						:to="
							`/themes/${fileNameToWebName(
								theme.target
							)}/${createUrlString(theme.id, theme.details.name)}`
						"
					>
						{{ theme.details.name }}
					</nuxt-link>
				</h2>

				<v-divider class="my-3 mx-2" />

				<v-form
					v-if="changed"
					ref="submitForm"
					v-model="submitValid"
					class="box_text"
				>
					<v-row class="ma-0">
						<v-col cols="12" xs="12" sm="4" class="pa-2">
							<v-hover v-slot:default="{ hover }">
								<v-img
									aspect-ratio="1.7778"
									class="placeholder display-3"
									:src="
										uploadedScreenshotUrl ||
											theme.preview.original
									"
									contain
								>
									<v-expand-transition>
										<v-file-input
											v-show="hover"
											v-model="uploadedScreenshot"
											full-width
											height="100%"
											label="SCREENSHOT* (jpg, 1280x720)"
											class="screenshot_upload transition-fast-in-fast-out v-card--reveal"
											filled
											color="black"
											accept="image/jpeg"
											hide-details
											style="cursor: pointer; height: 100%; background: rgba(0, 0, 0, 0.5);"
											@change="
												onScreenshotChange($event, i)
											"
										/>
									</v-expand-transition>
								</v-img>
							</v-hover>
						</v-col>
						<v-col cols="12" xs="12" sm="8" class="pa-2">
							<v-text-field
								v-model="changed.details.name"
								rounded
								minlength="3"
								maxlength="50"
								counter="50"
								label="Theme Name*"
								outlined
								prepend-icon="mdi-pencil-outline"
								:rules="[
									rules.required,
									rules.name_length,
									rules.utf8_only
								]"
							></v-text-field>
							<v-autocomplete
								v-model="changed.layout.id"
								:items="layouts[theme.target]"
								auto-select-first
								label="Layout"
								:loading="!!$apollo.queries.layoutList.loading"
								prepend-icon="mdi-code-json"
								outlined
								rounded
								persistent-hint
								:hint="
									changed.pieces && changed.pieces.length > 0
										? `Options: ${optionsString(
												changed.pieces
										  )}`
										: !changed.layout.id
										? 'Replaces custom layout! IRREVERSIBLE!'
										: null
								"
								allow-overflow
								@mouseover.once="
									$apollo.queries.layoutList.skip = false
								"
								@change="changed.pieces = []"
							>
							</v-autocomplete>
							<v-text-field
								v-model="changed.details.description"
								rounded
								minlength="10"
								maxlength="500"
								counter="500"
								label="Theme Description"
								outlined
								:rules="[
									rules.description_length,
									rules.utf8_only
								]"
								prepend-icon="mdi-pencil-outline"
							></v-text-field>
							<v-combobox
								v-model="changed.categories"
								rounded
								:items="
									categories && categories.length > 0
										? categories.filter((c) => c !== 'NSFW')
										: []
								"
								:loading="!!$apollo.queries.categories.loading"
								outlined
								allow-overflow
								chips
								small-chips
								deletable-chips
								:rules="[
									rules.category_length,
									rules.max_category_amount,
									rules.utf8_only
								]"
								prepend-icon="mdi-shape-outline"
								label="Categories* ([enter] for new category)"
								multiple
								@mouseover.once="
									$apollo.queries.categories.skip = false
								"
							></v-combobox>
							<v-text-field
								v-model="changed.details.version"
								rounded
								label="Theme version*"
								maxlength="10"
								counter="10"
								outlined
								:rules="[rules.required, rules.utf8_only]"
								prepend-icon="mdi-update"
							></v-text-field>
							<v-checkbox
								v-model="changed.nsfw"
								color="red"
								label="NSFW"
								class="mt-0"
							/>

							<ButtonDivider :margin="false">
								<v-btn
									rounded
									:disabled="!changes || loading.submit"
									color="red"
									@click.prevent="discard()"
								>
									Discard
									<v-icon right
										>mdi-delete-sweep-outline
									</v-icon>
								</v-btn>
								<v-btn
									rounded
									:disabled="!changes || !submitValid"
									color="secondary"
									type="submit"
									:loading="loading.submit"
									@click.prevent="submit()"
								>
									Save
									<v-icon right>mdi-cube-send</v-icon>
								</v-btn>
							</ButtonDivider>
						</v-col>
					</v-row>
				</v-form>
				<ButtonDivider>
					<DeleteButton
						:id="theme.id"
						type="theme"
						:query="deleteQuery"
						:go-back="
							!!(
								fromRoute &&
								fromRoute.name &&
								fromRoute.name.startsWith('packs')
							)
						"
						:return-url="`/themes/${this.$route.params.target}`"
					/>
				</ButtonDivider>
			</v-sheet>
		</LoadingOverlay>
	</v-container>
</template>

<script>
import Vue from 'vue'
import rules from '@/assets/rules'
import allLayoutsDropdown from '@/components/mixins/allLayoutsDropdown'
import allCategoriesDropdown from '@/components/mixins/allCategoriesDropdown'
import targetParser from '@/components/mixins/targetParser'
import { theme, deleteTheme, updateTheme } from '@/graphql/Theme.gql'
import urlParser from '~/components/mixins/urlParser'
import optionsString from '@/components/mixins/optionsString'

export default Vue.extend({
	beforeRouteEnter(_to, from, next) {
		next((vm) => {
			vm.fromRoute = from
			if (vm.$auth.loggedIn) next()
			else next('/')
		})
	},
	components: {
		ButtonDivider: () => import('@/components/buttons/ButtonDivider.vue'),
		DeleteButton: () => import('@/components/buttons/DeleteButton.vue'),
		LoadingOverlay: () => import('@/components/LoadingOverlay.vue')
	},
	mixins: [
		urlParser,
		targetParser,
		allLayoutsDropdown,
		allCategoriesDropdown,
		optionsString
	],
	data() {
		return {
			fromRoute: null,
			isPageOwner: true,
			loading: {
				submit: false
			},
			changed: null,

			deleteQuery: deleteTheme,
			submitValid: false,
			rules,
			uploadedScreenshot: null,
			uploadedScreenshotUrl: null
		}
	},
	computed: {
		changes() {
			return (
				this.theme.details.name !== this.changed.details.name ||
				this.theme.details.description !==
					this.changed.details.description ||
				this.theme.details.version !== this.changed.details.version ||
				(this.theme.layout?.id &&
					this.theme.layout.id +
						(this.theme.pieces?.length > 0
							? `|${this.theme.pieces
									.map((p) => p.value.uuid)
									.join(',')}`
							: '') !==
						this.changed.layout.id) ||
				(!this.theme.layout?.id && this.changed.layout.id) ||
				JSON.stringify(this.theme.categories) !==
					JSON.stringify(this.changed.categories) ||
				!!this.uploadedScreenshot
			)
		}
	},
	beforeRouteLeave(_to, _from, next) {
		if (this.changes) {
			const answer = window.confirm(
				'Do you really want to leave? You have unsaved changes!'
			)
			if (answer) {
				next()
			} else {
				next(false)
			}
		} else next()
	},
	watch: {
		isPageOwner(n) {
			if (!n) {
				this.$router.push('/')
			}
		}
	},
	apollo: {
		theme: {
			query: theme,
			fetchPolicy: 'cache-and-network',
			variables() {
				return {
					id: this.id
				}
			},
			result({ data }) {
				if (data && data.theme) {
					this.isPageOwner =
						this.$auth.loggedIn &&
						(data.theme.creator.id === this.$auth.user.id ||
							this.$auth.user.isAdmin)

					this.updateUrlString(
						data.theme.id,
						data.theme.details.name,
						this.fileNameToWebName(data.theme.target)
					)

					this.currentThemeTarget = data.theme.target
					this.$apollo.queries.layoutList.skip = false

					if (data.theme.categories?.includes('NSFW'))
						data.theme.nsfw = true
					data.theme.categories = data.theme.categories.filter(
						(c) => c !== 'NSFW'
					)

					this.changed = JSON.parse(JSON.stringify(data.theme))
					if (!this.changed.layout) this.changed.layout = {}
					else {
						this.changed.layout.id =
							this.changed.layout.id +
							(this.changed.pieces?.length > 0
								? `|${this.changed.pieces
										.map((p) => p.value.uuid)
										.join(',')}`
								: '')
					}
				}
			},
			error(e) {
				this.$nuxt.error(e)
			},
			prefetch: true
		}
	},
	methods: {
		onScreenshotChange(file) {
			if (file) {
				this.uploadedScreenshotUrl = URL.createObjectURL(file)
			}
		},
		discard() {
			if (this.theme.categories?.includes('NSFW')) this.theme.nsfw = true
			this.theme.categories = this.theme.categories.filter(
				(c) => c !== 'NSFW'
			)
			this.changed = JSON.parse(JSON.stringify(this.theme))
			if (!this.changed.layout) this.changed.layout = {}
			else {
				this.changed.layout.id =
					this.changed.layout.id +
					(this.changed.pieces?.length > 0
						? `|${this.changed.pieces
								.map((p) => p.value.uuid)
								.join(',')}`
						: '')
			}

			this.uploadedScreenshot = null
			this.uploadedScreenshotUrl = null
		},
		submit() {
			this.loading.submit = true

			this.$apollo
				.mutate({
					mutation: updateTheme,
					variables: {
						id: this.id,
						file: this.uploadedScreenshot,
						name: this.changed.details.name,
						layout_id: this.changed.layout.id,
						description: this.changed.details.description,
						version: this.changed.details.version,
						categories: this.changed.categories,
						nsfw: this.changed.nsfw
					}
				})
				.then(({ data }) => {
					this.loading.submit = false
					if (data && data.updateTheme) {
						this.uploadedScreenshot = null
						this.$apollo.queries.theme.refetch()
						this.$snackbar.message(
							'Success! Changes might take some time to apply.'
						)
					}
				})
				.catch((err) => {
					this.$snackbar.error(err)
					this.loading.submit = false
				})
		}
	},
	head() {
		if (this.theme) {
			const metaTitle = `Edit | ${this.theme.details.name}${
				this.theme.nsfw ? ' (NSFW!)' : ''
			} | ${this.targetName()} | Themes`
			const metaDesc = this.theme.details.description
			const metaImg = !this.theme.nsfw ? this.theme.preview.thumb : null

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
@import '~assets/screenshot-upload.scss';

.v-menu__content {
	border-radius: 10px !important;
}
</style>
