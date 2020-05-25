<template>
	<div v-if="layout && layout.details" no-gutters class="pa-2 box">
		<v-row class="ma-0">
			<v-col cols="12" xs="12" sm="8" md="9" class="pa-2">
				<v-img
					aspect-ratio="1.7778"
					:src="
						`//api.themezer.ga/storage/layouts/${layout.details.uuid}/overlay.png`
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
				sm="4"
				md="3"
				class="pa-2"
				style="position: relative;"
			>
				<h1>
					{{ layout.details.name }}
				</h1>
				<div class="subtitle-1">
					By {{ layout.details.author.name }}
				</div>
				<div class="font-weight-thin subtitle-1">
					{{ layout.details.description }}
				</div>

				<v-divider class="my-3" />
				<h3>
					Details
				</h3>
				<div
					v-if="layout.details.author.discordTag"
					class="font-weight-light body-2"
				>
					<span class="font-weight-medium">
						Author's Discord:
					</span>
					{{ layout.details.author.discordTag }}
				</div>
				<div class="font-weight-light body-2">
					<span class="font-weight-medium">Version: </span>
					{{ layout.details.version }}
				</div>
				<div class="font-weight-light body-2">
					<span class="font-weight-medium">Last Updated:</span>
					{{ niceDate(layout.last_updated) }}
				</div>
				<div class="font-weight-light body-2">
					<span class="font-weight-medium">Target File: </span>
					{{ layout.menu }}.szs
				</div>
				<!-- <div style="position: absolute; bottom: 0;"> -->
				<v-flex class="d-flex justify-center mt-3">
					<v-btn
						v-if="layout.has_pieces"
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
								layout.baselayout,
								'application/json',
								layout.details.name
							)
						"
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
				<BackgroundsSlideGroup />
			</v-col>
		</v-row>
	</div>
	<LoadingOverlay v-else-if="$apollo.loading" />
	<span v-else>There's nothing here :(</span>
</template>

<script>
import LayoutQueries from '@/graphql/Layout.gql'
import BackgroundsSlideGroup from '@/components/BackgroundsSlideGroup.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default {
	components: {
		BackgroundsSlideGroup,
		LoadingOverlay
	},
	apollo: {
		layout: {
			query: LayoutQueries.layoutDetails,
			variables() {
				return {
					name: this.$route.params.layout,
					menu: this.$route.params.menu
				}
			},
			// fetchPolicy: 'no-cache',
			prefetch: true
		}
	},
	computed: {
		backgroundStyle() {
			if (this.$store.state.background)
				return `background-image: url(${this.$store.state.background});`
			else if (this.$route.params.menu === 'playerselect') {
				return `background-image: url(/images/blurredhome.jpg);`
			} else if (this.layout.details.color) {
				return `background: ${this.layout.details.color};`
			} else {
				return `background: #e2e2e2;`
			}
		}
	},
	methods: {
		niceDate(unix) {
			const monthNames = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
			]

			const DateTime = new Date(parseInt(unix))
			return (
				monthNames[DateTime.getMonth()] +
				' ' +
				DateTime.getDate() +
				', ' +
				DateTime.getFullYear()
			)
		}
	}
}
</script>

<style lang="scss" scoped>
.overlay_image {
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	transition: cubic-bezier(0.165, 0.84, 0.44, 1) 400ms;
	border-radius: 4px;
	// max-height: 50vh;
}

.box {
	background-color: #1e1e1e;
	border-radius: 4px;
	box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
		0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
	min-height: 100%;
}
</style>
