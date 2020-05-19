<template>
	<div v-if="layout && layout.details" no-gutters class="pa-2 rowbox">
		<v-row class="ma-0">
			<v-col cols="12" xs="12" sm="8" md="10" class="pa-2">
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
			<v-col cols="12" xs="12" sm="4" md="2" class="pa-2">
				<v-flex xs-12 lg-8 min-height="40vh">
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
				</v-flex>
			</v-col>
		</v-row>
		<v-row class="ma-0">
			<v-col :class="breakpoint < 800 ? 'px-0 py-2' : 'pa-2'">
				<BackgroundsColumn />
			</v-col>
		</v-row>
	</div>
	<LoadingOverlay v-else />
</template>

<script>
import LayoutQueries from '@/graphql/Layout.gql'
import BackgroundsColumn from '@/components/BackgroundsSlideGroup.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default {
	components: {
		BackgroundsColumn,
		LoadingOverlay
	},
	apollo: {
		layout: {
			query: LayoutQueries.layout,
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
		// eslint-disable-next-line vue/return-in-computed-property
		breakpoint() {
			switch (this.$vuetify.breakpoint.name) {
				case 'xs':
					return 220
				case 'sm':
					return 400
				case 'md':
					return 500
				case 'lg':
					return 600
				case 'xl':
					return 800
			}
		},
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

.rowbox {
	background-color: #1e1e1e;
	border-radius: 4px;
	box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
		0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
</style>
