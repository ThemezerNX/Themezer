<template>
	<v-row v-if="layout && layout.details" no-gutters>
		<v-col cols="12" xs="12" sm="8" md="10" class="pa-2">
			<v-img
				aspect-ratio="1.7778"
				:src="
					`//api.themezer.ga/storage/layouts/${layout.details.uuid}/overlay.png`
				"
				:lazy-src="'/logo-256.jpg'"
				contain
				width="auto"
				class="overlay_image"
				:style="
					$store.state.background
						? `background-image: url(${$store.state.background});`
						: 'background: #2D2D2D;'
				"
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
		<v-col cols="12" xs="12" sm="4" md="2" class="pa-2">
			<v-expansion-panels :value="breakpoint < 400 ? undefined : 0" hover>
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
</template>

<script>
import LayoutQueries from '@/graphql/Layout.gql'
import BackgroundsColumn from '@/components/BackgroundsColumn.vue'

export default {
	components: {
		BackgroundsColumn
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
		}
	}
}
</script>

<style lang="scss" scoped>
.overlay_image {
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	transition: background-image 200ms;
	border-radius: 4px;
	// max-height: 50vh;
}
</style>
