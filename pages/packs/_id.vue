<template>
	<v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
		<div v-if="pack && pack.details" no-gutters class="pa-2 box">
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
								`//api.themezer.ga/storage/themes/${theme.uuid}/screenshot.jpg`
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
						<a
							class="font-weight-bold"
							:href="`/creators/${pack.creator.id}`"
						>
							{{ pack.creator.discord_user.username }}
						</a>
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

					<v-flex class="d-flex justify-center">
						<v-divider class="mx-3 my-auto" />
						<LikeButton
							v-if="$auth.loggedIn"
							:id="pack.uuid"
							type="packs"
							:count="pack.like_count"
							:value="
								$auth.user.liked.packs
									.map((p) => p.uuid)
									.includes(pack.uuid)
							"
						/>
						<v-divider class="mx-3 my-auto" />
					</v-flex>

					<h3>
						Details
					</h3>
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

					<v-flex class="d-flex justify-center mt-3">
						<v-divider class="mx-3 my-auto" />
						<v-btn
							class="mx-2"
							color="secondary"
							rounded
							append
							:loading="loadingDownload"
							@click.prevent="downloadPack()"
						>
							<v-icon>mdi-download</v-icon>
						</v-btn>
						<v-divider class="mx-3 my-auto" />
					</v-flex>
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
					<ThemesSlideGroup :items="pack.themes" />
				</v-col>
			</v-row>
		</div>
		<LoadingOverlay v-else-if="$apollo.loading" />
		<span v-else>There's nothing here :(</span>
	</v-container>
</template>

<script>
import Vue from 'vue'
import shared from '@/layouts/details/SharedScript'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '@/components/mixins/urlParser'
import { pack, downloadPack } from '@/graphql/Pack.gql'

export default Vue.extend({
	mixins: [shared, targetParser, urlParser],
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
					this.updateUrlString(this.id, data.pack.details.name)
				}
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
						uuid: this.pack.uuid
					}
				})
				.then(({ data }) => {
					this.loadingDownload = false

					this.downloadFileB64(
						data.downloadPack.data,
						data.downloadPack.mimetype,
						data.downloadPack.filename
					)
				})
		}
	},
	head() {
		if (this.pack) {
			const metaTitle = `${this.pack.details.name} | Packs`
			const metaDesc = this.pack.details.description
			const metaImg = `//api.themezer.ga/storage/themes/${this.pack.themes[0].uuid}/screenshot.jpg`

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
