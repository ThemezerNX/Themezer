<template>
	<div v-if="pack && pack.details" no-gutters class="pa-2 box_fit">
		<v-row class="ma-0">
			<v-col
				cols="12"
				xs="12"
				:sm="landscape ? 8 : 12"
				md="9"
				class="pa-2"
			>
				<v-carousel
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
						:lazy-src="'/logo_16-9-256.jpg'"
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
				<div class="subtitle-1">By {{ pack.details.author.name }}</div>
				<div class="font-weight-thin subtitle-1">
					{{ pack.details.description }}
				</div>

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

				<v-divider class="my-3" />
				<h3>
					Details
				</h3>
				<div
					v-if="pack.details.author.discord_tag"
					class="font-weight-light body-2"
				>
					<span class="font-weight-medium">
						Author's Discord:
					</span>
					{{ pack.details.author.discord_tag }}
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
				<!-- <div style="position: absolute; bottom: 0;"> -->
				<v-flex class="d-flex justify-center mt-3">
					<!-- <v-btn
						v-if="pack.has_pieces"
						class="mx-2"
						color="primary"
						to="customize"
						append
					>
						Customize <v-icon right>mdi-square-edit-outline</v-icon>
					</v-btn> -->
					<v-btn
						class="mx-2"
						color="secondary"
						append
						:loading="loadingDownload"
						@click.prevent="downloadPack()"
					>
						Get <v-icon right>mdi-download-box-outline</v-icon>
					</v-btn>
				</v-flex>
			</v-col>
		</v-row>
		<v-row class="ma-0">
			<v-col
				:class="$vuetify.breakpoint.smAndDown ? 'px-0 py-2' : 'pa-2'"
			>
				<ThemesSlideGroup :items="pack.themes" />
			</v-col>
		</v-row>
	</div>
	<LoadingOverlay v-else-if="$apollo.loading" />
	<span v-else>There's nothing here :(</span>
</template>

<script>
import Vue from 'vue'
import shared from '@/layouts/details/SharedScript'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '@/components/mixins/urlParser'
import { pack, downloadPack } from '@/graphql/Pack.gql'
import ThemesSlideGroup from '@/components/ThemesSlideGroup.vue'

export default Vue.extend({
	components: {
		ThemesSlideGroup
	},
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
		const title =
			this.pack && this.pack.details
				? `${this.pack.details.name} | Packs`
				: null
		const desc =
			this.pack && this.pack.details && this.pack.details.description
				? this.pack.details.description
				: null

		return {
			title,
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: desc
				},
				{
					hid: 'og:title',
					name: 'og:title',
					property: 'og:title',
					content: title
				},
				{
					hid: 'og:description',
					name: 'og:description',
					property: 'og:description',
					content: desc
				}
			]
		}
	}
})
</script>

<style lang="scss" scoped>
@import '@/layouts/details/SharedCss.scss';
</style>
