<template>
	<div v-if="theme && theme.details" no-gutters class="pa-2 box_fit">
		<v-row class="ma-0">
			<v-col
				cols="12"
				xs="12"
				:sm="landscape ? 8 : 12"
				md="9"
				class="pa-2"
			>
				<v-img
					aspect-ratio="1.7778"
					:src="
						`//api.themezer.ga/storage/themes/${theme.uuid}/screenshot.jpg`
					"
					:lazy-src="'/logo_16-9-256.jpg'"
					contain
					class="overlay_image"
					:style="backgroundStyle"
				/>
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
					{{ theme.details.name }}
				</h1>
				<div class="subtitle-1">By {{ theme.details.author.name }}</div>
				<div class="font-weight-thin subtitle-1">
					{{ theme.details.description }}
				</div>

				<v-divider class="my-3" />
				<h3>
					Details
				</h3>
				<div
					v-if="theme.details.author.discord_tag"
					class="font-weight-light body-2"
				>
					<span class="font-weight-medium">
						Author's Discord:
					</span>
					{{ theme.details.author.discord_tag }}
				</div>
				<div class="font-weight-light body-2">
					<span class="font-weight-medium">Version: </span>
					{{ theme.details.version }}
				</div>
				<div class="font-weight-light body-2">
					<span class="font-weight-medium">Last Updated:</span>
					{{ niceDate(theme.last_updated) }}
				</div>
				<div v-if="theme.layout" class="font-weight-light body-2">
					<span class="font-weight-medium">Layout: </span>
					<a
						class="font-weight-bold"
						:href="
							`/layouts/${theme.layout.webtarget}/${theme.layout.details.name}`
						"
					>
						{{ theme.layout.details.name }}
					</a>
				</div>
				<!-- <div style="position: absolute; bottom: 0;"> -->
				<!-- <v-flex class="d-flex justify-center mt-3">
					<v-btn
						v-if="theme.has_pieces"
						class="mx-2"
						color="primary"
						to="customize"
						append
					>
						Customize <v-icon right>mdi-square-edit-outline</v-icon>
					</v-btn>
					<v-btn
						class="mx-2"
						color="secondary"
						append
						@click.prevent="
							downloadFile(
								mergeJson(
									layout.uuid,
									layout.baselayout,
									[]
								),
								'application/json',
								layout.details.name
							)
						"
					>
						Get <v-icon right>mdi-download-box-outline</v-icon>
					</v-btn>
				</v-flex> -->
				<div v-if="theme.pack">
					<v-divider class="my-3" />
					<h3 style="position: relative;">
						Theme Pack
						<v-tooltip v-model="show" top>
							<template v-slot:activator="{ on }">
								<v-btn
									icon
									style="position: absolute; top: 0; color: black;"
									class="ml-1 pa-0 grey lighten-1"
									width="14"
									height="14"
									v-on="on"
									@click="packDialog = true"
								>
									?
								</v-btn>
							</template>
							<span>What is this?</span>
						</v-tooltip>
					</h3>
					<div class="subtitle-1">
						This Theme is part of the the following Theme Pack:
					</div>
					<a
						:href="theme.pack.url"
						class="subtitle-1 font-weight-bold"
					>
						{{ theme.pack.details.name }}
					</a>
				</div>
			</v-col>
		</v-row>
		<v-dialog v-model="packDialog" max-width="400">
			<v-card>
				<v-card-title class="headline"
					>What is a Theme Pack?</v-card-title
				>

				<v-card-text>
					Theme Packs are just zips with multiple themes created by
					the same user.
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn color="primary" text @click="packDialog = false">
						Close
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
	<LoadingOverlay v-else-if="$apollo.loading" />
	<span v-else>There's nothing here :(</span>
</template>

<script>
import Vue from 'vue'
import shared from '@/layouts/details/SharedScript'
import { theme } from '@/graphql/Theme.gql'

export default Vue.extend({
	mixins: [shared],
	data() {
		return {
			packDialog: false
		}
	},
	computed: {
		backgroundStyle() {
			return ''
			// if (this.theme.details.color) {
			// 	return `background: ${this.theme.details.color};`
			// } else {
			// 	return `background: #e2e2e2;`
			// }
		}
	},
	apollo: {
		theme: {
			query: theme,
			variables() {
				return {
					id: this.id,
					target: this.$route.params.target
				}
			},
			result({ data }) {
				if (data && data.theme) {
					this.updateUrlString(this.id, data.theme.details.name)
				}
			},
			// fetchPolicy: 'no-cache',
			prefetch: true
		}
	}
})
</script>

<style lang="scss" scoped>
@import '@/layouts/details/SharedCss.scss';
</style>
