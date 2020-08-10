<template>
	<error v-if="error" :error="error" />
	<v-container
		v-else
		:fluid="$vuetify.breakpoint.smAndDown"
		style="height: 100%;"
	>
		<v-sheet v-if="pack && pack.details" no-gutters class="pa-2 box">
			<v-row class="ma-0">
				<v-col
					cols="12"
					xs="12"
					:sm="landscape ? 8 : 12"
					md="9"
					class="pa-2"
				>
					<v-carousel
						class="overlay-image"
						continuous
						hide-delimiters
						hide-delimiter-background
						cycle
						height="auto"
					>
						<v-carousel-item
							v-for="(theme, i) in pack.themes"
							:key="i"
							height="auto"
							aspect-ratio="1.7778"
							:src="
								`//api.themezer.ga/cdn/themes/${theme.id}/screenshot.jpg`
							"
						>
						</v-carousel-item>
					</v-carousel>
				</v-col>
				<v-col
					cols="12"
					xs="12"
					:sm="landscape ? 4 : 12"
					md="3"
					class="pa-2"
					style="position: relative;"
				>
					<h1>
						{{ pack.details.name }}
					</h1>
					<div class="subtitle-1">
						By
						<nuxt-link
							class="font-weight-bold"
							:to="`/creators/${pack.creator.id}`"
						>
							{{ pack.creator.display_name }}
						</nuxt-link>
					</div>
					<div
						v-if="pack.details.description"
						v-linkified:options="{
							className: 'font-weight-medium'
						}"
						class="font-weight-thin subtitle-1"
						v-html="pack.details.description"
					/>

					<div>
						<v-chip
							v-for="(category, i) in categories"
							:key="i"
							class="ma-2"
							pill
							small
						>
							{{ category }}
						</v-chip>
					</div>

					<ButtonDivider>
						<LikeButton
							v-if="$auth.loggedIn"
							:id="pack.id"
							type="packs"
							:count="pack.like_count"
							:value="
								$auth.user.liked.packs
									.map((p) => p.id)
									.includes(pack.id)
							"
						/>
						<ShareButton
							type="pack"
							:name="pack.details.name"
							:creator="pack.creator.display_name"
						/>
						<EditButton
							v-if="$auth.loggedIn"
							type="pack"
							:creator-id="pack.creator.id"
						/>
					</ButtonDivider>

					<h3>
						Details
					</h3>
					<div
						class="font-weight-light text-body-1 font-weight-medium"
					>
						<span class="font-weight-bold"
							>Theme Installer ID:
						</span>
						P{{ pack.id }}
					</div>
					<div class="font-weight-light body-2">
						<span class="font-weight-medium">ID: </span>
						{{ pack.id }}
					</div>
					<div class="font-weight-light body-2">
						<span class="font-weight-medium">Version: </span>
						{{ pack.details.version }}
					</div>
					<div class="font-weight-light body-2">
						<span class="font-weight-medium">Last Updated:</span>
						{{ niceDate(pack.last_updated) }}
					</div>
					<div class="font-weight-light body-2">
						<span class="font-weight-medium">Downloads: </span>
						{{ pack.dl_count }}
					</div>

					<ButtonDivider>
						<DownloadButton
							tooltip="Download pack"
							:download-function="downloadPack"
							:loading="loadingDownload"
						/>
					</ButtonDivider>
				</v-col>
			</v-row>
			<v-row class="ma-0">
				<v-col
					:class="
						$vuetify.breakpoint.smAndDown ? 'px-0 py-2' : 'pa-2'
					"
				>
					<h2 class="px-2">
						Themes in this Pack
					</h2>
					<v-divider />
					<ThemesSlideGroup :items="pack.themes" sort-by="name" />
				</v-col>
			</v-row>
		</v-sheet>
		<LoadingOverlay v-else-if="$apollo.loading" />
	</v-container>
</template>

<script>
import Vue from 'vue'
import errorHandler from '@/components/mixins/errorHandler'
import shared from '@/layouts/details/SharedScript'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '@/components/mixins/urlParser'
import { pack, downloadPack } from '@/graphql/Pack.gql'

export default Vue.extend({
	components: {
		ButtonDivider: () => import('@/components/buttons/ButtonDivider.vue'),
		DownloadButton: () => import('@/components/buttons/DownloadButton.vue'),
		LikeButton: () => import('@/components/buttons/LikeButton.vue'),
		ShareButton: () => import('@/components/buttons/ShareButton.vue'),
		ThemesSlideGroup: () => import('@/components/ThemesSlideGroup.vue'),
		EditButton: () => import('@/components/buttons/EditButton.vue')
	},
	mixins: [errorHandler, shared, targetParser, urlParser],
	data() {
		return {
			packDialog: false,
			loadingDownload: false
		}
	},
	computed: {
		backgroundStyle() {
			return ''
			// if (this.pack.details.color) {
			// 	return `background: ${this.pack.details.color};`
			// } else {
			// 	return `background: #e2e2e2;`
			// }
		},
		categories() {
			const c = []
			for (const i in this.pack.themes) {
				if (this.pack.themes[i].categories)
					c.concat(
						this.pack.themes[i].categories.filter(
							(item) => !c.includes(item)
						)
					)
			}
			return c
		}
	},
	apollo: {
		pack: {
			query: pack,
			variables() {
				return {
					id: this.id
				}
			},
			result({ data }) {
				if (data && data.pack) {
					this.updateUrlString(data.pack.id, data.pack.details.name)
				}
			},
			error(e) {
				this.error = e
			},
			// fetchPolicy: 'no-cache',
			prefetch: true
		}
	},
	methods: {
		downloadPack() {
			this.loadingDownload = true

			this.$apollo
				.mutate({
					mutation: downloadPack,
					variables: {
						id: this.pack.id
					}
				})
				.then(({ data }) => {
					this.loadingDownload = false

					this.downloadFileUrl(
						data.downloadPack.url,
						data.downloadPack.filename
					)
				})
				.catch((err) => {
					this.$snackbar.error(err)
					this.loadingDownload = false
				})
		}
	},
	head() {
		if (this.pack) {
			const metaTitle = `${this.pack.details.name} | Packs`
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