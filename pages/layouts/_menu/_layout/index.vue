<template>
	<v-row v-if="layout && layout.details" no-gutters class="pa-2 rowbox">
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
			<v-layout
				class="banner banner-gradient"
				pa-4
				wrap
				align-center
				fluid
			>
				<h2>
					{{ layout.details.name }}
				</h2>
			</v-layout>
		</v-col>
		<v-col cols="12" xs="12" sm="4" md="2">
			<v-expansion-panels
				:value="breakpoint < 400 ? undefined : 0"
				hover
				flat
			>
				<v-expansion-panel>
					<v-expansion-panel-header>
						Try These Backgrounds
					</v-expansion-panel-header>
					<v-expansion-panel-content>
						<BackgroundsColumn />
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-col>
	</v-row>
	<LoadingOverlay v-else />
</template>

<script>
import LayoutQueries from '@/graphql/Layout.gql'
import BackgroundsColumn from '@/components/BackgroundsColumn.vue'
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
