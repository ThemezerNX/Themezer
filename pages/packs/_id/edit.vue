<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<LoadingOverlay :loading="!!$apollo.loading">
			<v-sheet v-if="pack" no-gutters class="pa-2 box_fill">
				<h1 class="box_text">Edit Pack</h1>
				<h2 class="box_text mt-0">
					<nuxt-link
						class="font-weight-bold"
						:to="
							`/packs/${createUrlString(
								pack.id,
								pack.details.name
							)}`
						"
					>
						{{ pack.details.name }}
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
						<v-col cols="12" class="pa-2">
							<v-text-field
								v-model="changed.details.name"
								rounded
								minlength="3"
								maxlength="50"
								counter="50"
								label="Pack Name*"
								outlined
								prepend-icon="mdi-pencil-outline"
								:rules="[
									rules.required,
									rules.name_length,
									rules.utf8_only
								]"
							></v-text-field>
							<v-text-field
								v-model="changed.details.description"
								rounded
								minlength="10"
								maxlength="500"
								counter="500"
								label="Pack Description*"
								outlined
								:rules="[
									rules.required,
									rules.description_length,
									rules.utf8_only
								]"
								prepend-icon="mdi-pencil-outline"
							></v-text-field>
							<v-text-field
								v-model="changed.details.version"
								rounded
								label="Pack version*"
								maxlength="10"
								counter="10"
								outlined
								:rules="[rules.required, rules.utf8_only]"
								prepend-icon="mdi-update"
							></v-text-field>

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
									:disabled="!submitValid || !changes"
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

				<h3 class="box_text">Themes in this pack:</h3>
				<h3 class="box_text subtitle-1 font-italic">
					Click any to edit
				</h3>
				<v-list class="box_text" rounded>
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
								:src="theme.preview.thumb"
								contain
							/>
						</v-list-item-avatar>

						<v-list-item-content>
							<v-list-item-title
								v-text="theme.details.name"
							></v-list-item-title>
							<v-list-item-subtitle>
								Target:
								{{ fileNameToNiceWebName(theme.target) }}
							</v-list-item-subtitle>
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
				</ButtonDivider>
			</v-sheet>
		</LoadingOverlay>
	</v-container>
</template>

<script>
import Vue from 'vue'
import rules from '@/assets/rules'
import targetParser from '@/components/mixins/targetParser'
import { pack, deletePack, updatePack } from '@/graphql/Pack.gql'
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
	mixins: [urlParser, targetParser],
	data() {
		return {
			isPageOwner: true,
			loading: {
				submit: false
			},
			changed: null,

			deleteQuery: deletePack,
			submitValid: false,
			rules,
			uploadedScreenshot: null,
			uploadedScreenshotUrl: null
		}
	},
	computed: {
		changes() {
			return JSON.stringify(this.pack) !== JSON.stringify(this.changed)
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
						(data.pack.creator.id === this.$auth.user.id ||
							this.$auth.user.isAdmin)

					this.updateUrlString(
						data.pack.id,
						data.pack.details.name,
						this.fileNameToWebName(data.pack.target)
					)
					this.changed = JSON.parse(JSON.stringify(data.pack))
				}
			},
			prefetch: true
		}
	},
	methods: {
		discard() {
			this.changed = JSON.parse(JSON.stringify(this.pack))
		},
		submit() {
			this.loading.submit = true

			this.$apollo
				.mutate({
					mutation: updatePack,
					variables: {
						id: this.id,
						name: this.changed.details.name,
						description: this.changed.details.description,
						version: this.changed.details.version
					}
				})
				.then(({ data }) => {
					this.loading.submit = false
					if (data && data.updatePack) {
						this.$apollo.queries.pack.refetch()
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
		if (this.pack) {
			const metaTitle = `Edit | ${this.pack.details.name}${
				this.pack.themes.some((t) => t.categories?.includes('NSFW'))
					? ' (NSFW!)'
					: ''
			} | Packs`
			const metaDesc = this.pack.details.description
			const metaImg = !this.pack.themes.some((t) =>
				t.categories?.includes('NSFW')
			)
				? this.pack.themes[0].preview.thumb
				: null

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
