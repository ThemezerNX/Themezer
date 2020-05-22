<template>
	<div v-if="layout && layout.details" no-gutters class="pa-2 box">
		<v-row class="ma-0">
			<v-col cols="12" xs="12" sm="8" md="10" class="pa-2">
				<h1>
					{{ layout.details.name }}
				</h1>
				<div class="subtitle-1">
					By {{ layout.details.author.name }}
				</div>
			</v-col>
			<v-col
				cols="12"
				xs="12"
				sm="4"
				md="2"
				class="pa-2"
				style="position: relative;"
			>
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
		</v-row>
	</div>
	<LoadingOverlay v-else />
</template>

<script>
import Vue from 'vue'
import LayoutQueries from '@/graphql/Layout.gql'
// import FloatingPreview from '@/components/FloatingPreview.vue'

export default Vue.extend({
	components: {
		// FloatingPreview
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
			prefetch: true
		}
	}
})
</script>
