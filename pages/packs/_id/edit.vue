<template>
	<error v-if="error" :error="error" />
	<v-container
		v-else
		:fluid="$vuetify.breakpoint.smAndDown"
		style="height: 100%;"
	>
		<LoadingOverlay :loading="$apollo.loading">
			<v-sheet v-if="pack" no-gutters class="pa-2 box_fill">
				<h1 class="box_text">Edit Pack</h1>
				<nuxt-link
					class="font-weight-bold"
					:to="
						`/packs/${createUrlString(pack.id, pack.details.name)}`
					"
				>
					<h2 class="box_text mt-0">{{ pack.details.name }}</h2>
				</nuxt-link>

				<v-form ref="submitForm" v-model="submitValid"> </v-form>

				<v-divider class="my-3 mx-2" />

				<h3 class="box_text mt-0">Themes in this pack:</h3>
				<h3 class="box_text mt-0 subtitle-1 font-italic">
					(Click any to edit)
				</h3>
				<v-list rounded>
					<v-list-item
						v-for="theme in pack.themes"
						:key="theme.id"
						:to="
							`/themes/${fileNameToWebName(
								theme.target
							)}/${createUrlString(
								theme.id,
								theme.details.name
							)}/edit`
						"
					>
						<v-list-item-avatar width="140" height="auto" tile>
							<v-img
								aspect-ratio="1.7778"
								style="border-radius: 10px;"
								:src="
									`//api.themezer.ga/cdn/themes/${theme.id}/screenshot.jpg`
								"
								contain
							/>
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title
								v-text="theme.details.name"
							></v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list>

				<ButtonDivider>
					<DeleteButton
						:id="pack.id"
						type="pack"
						:query="deleteQuery"
						return-url="/packs"
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
import { pack, deletePack } from '@/graphql/Pack.gql'
import urlParser from '~/components/mixins/urlParser'

export default Vue.extend({
	beforeRouteEnter(_to, _from, next) {
		next((vm) => {
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
			isPageOwner: true,
			loading: {
				submit: false
			},
			deleteQuery: deletePack,
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
			if (!n) {
				this.$router.push('/')
			}
		}
	},
	apollo: {
		pack: {
			query: pack,
			fetchPolicy: 'cache-and-network',
			variables() {
				return {
					id: this.id
				}
			},
			result({ data }) {
				if (data && data.pack) {
					this.isPageOwner =
						this.$auth.loggedIn &&
						data.pack.creator.id === this.$auth.user.id

					this.updateUrlString(
						data.pack.id,
						data.pack.details.name,
						this.fileNameToWebName(data.pack.target)
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
		if (this.pack) {
			const metaTitle = `Edit | ${this.pack.details.name} | Packs`
			const metaDesc = this.pack.details.description
			const metaImg = `//api.themezer.ga/cdn/themes/${this.pack.themes[0].id}/screenshot.jpg`

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
.v-menu__content {
	border-radius: 10px !important;
}
</style>
