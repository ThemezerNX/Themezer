<template>
	<error v-if="error" :error="error" />
	<v-container
		v-else
		:fluid="$vuetify.breakpoint.smAndDown"
		style="height: 100%;"
	>
		<LoadingOverlay :loading="$apollo.loading">
			<v-sheet v-if="theme" no-gutters class="pa-2 box_fill">
				<h1 class="box_text">Edit Theme</h1>
				<nuxt-link
					class="font-weight-bold"
					:to="
						`/themes/${fileNameToWebName(
							theme.target
						)}/${createUrlString(theme.id, theme.details.name)}`
					"
				>
					<h2 class="box_text mt-0">{{ theme.details.name }}</h2>
				</nuxt-link>
				<div v-if="theme.pack" class="subtitle-1 box_text">
					Part of
					<nuxt-link
						class="font-weight-bold"
						:to="
							`/packs/${createUrlString(
								theme.pack.id,
								theme.pack.details.name
							)}`
						"
					>
						{{ theme.pack.details.name }}
					</nuxt-link>
				</div>

				<v-form ref="submitForm" v-model="submitValid">
					<v-col cols="12" xs="12" sm="4" md="2" class="pa-2">
						<v-hover v-slot:default="{ hover }">
							<v-img
								aspect-ratio="1.7778"
								style="border-radius: 10px;"
								:src="
									uploadedScreenshotUrl || theme.preview.thumb
								"
								contain
							>
								<!-- <v-expand-transition>
								<div
									v-if="!uploadedScreenshot || hover"
									class="d-flex display-3 transition-fast-in-fast-out v-card--reveal"
									style="height: 100%; background: rgba(0, 0, 0, 0.5);"
								>
									<v-file-input
										v-model="uploadedScreenshot"
										full-width
										height="100%"
										label="Upload Screenshot* (.jpg)"
										class="screenshot_upload"
										filled
										color="black"
										accept="image/jpeg"
										hide-details
										:rules="[rules.required]"
										style="cursor: pointer;"
										@change="onScreenshotChange($event)"
									/>
								</div>
							</v-expand-transition> -->
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
					</v-col>
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
					<!-- <v-btn
					rounded
					:disabled="!changes || loading.submit"
					color="red"
					@click.prevent="discard()"
				>
					Discard
					<v-icon right>mdi-delete-sweep-outline</v-icon>
				</v-btn>
				<v-btn
					rounded
					:disabled="!submitValid || !changes"
					color="secondary"
					type="submit"
					:loading="loading.submit"
					@click.prevent="submit()"
				>
					Save <v-icon right>mdi-cube-send</v-icon>
				</v-btn> -->
				</ButtonDivider>
			</v-sheet>
		</LoadingOverlay>
	</v-container>
</template>

<script>
import Vue from 'vue'
import errorHandler from '@/components/mixins/errorHandler'
import targetParser from '@/components/mixins/targetParser'
import { theme, deleteTheme } from '@/graphql/Theme.gql'
import urlParser from '~/components/mixins/urlParser'

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
	mixins: [errorHandler, urlParser, targetParser],
	data() {
		return {
			fromRoute: null,
			isPageOwner: true,
			isAdmin: true,
			loading: {
				submit: false
			},
			deleteQuery: deleteTheme,
			submitValid: false,
			rules: {
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
			uploadedScreenshot: null,
			uploadedScreenshotUrl: null
		}
	},
	computed: {},
	watch: {
		isPageOwner(n) {
			if (!n && !this.isAdmin) {
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
						data.theme.creator.id === this.$auth.user.id
					this.isAdmin = this.$auth.user.role === 'admin'

					this.updateUrlString(
						data.theme.id,
						data.theme.details.name,
						this.fileNameToWebName(data.theme.target)
					)
				}
			},
			error(e) {
				this.error = e
			},
			prefetch: true
		}
	},
	methods: {
		onScreenshotChange(file) {
			if (file) {
				this.uploadedScreenshotUrl = URL.createObjectURL(file)

				this.forceUpdate++
			}
		}
	},
	head() {
		if (this.theme) {
			const metaTitle = `Edit | ${
				this.theme.details.name
			} | ${this.targetName()} | Themes`
			const metaDesc = this.theme.details.description
			const metaImg = this.theme.preview.thumb

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

.v-menu__content {
	border-radius: 10px !important;
}
</style>
