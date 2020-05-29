<template>
	<v-hover v-if="layoutDetails" v-slot:default="{ hover }">
		<v-card
			:elevation="hover ? 16 : null"
			:class="hover ? 'hover' : ''"
			class="ma-auto card"
			router
			exact
			:to="`${$route.params.target}/${layoutDetails.name}`"
			:style="`border: rgba(255, 255, 255, 0.12) solid 1px;`"
		>
			<v-img
				aspect-ratio="1.7778"
				:src="
					`//api.themezer.ga/storage/layouts/${layoutDetails.uuid}/overlay.png`
				"
				:lazy-src="'/logo_16-9-256.jpg'"
				contain
				:style="`background-color: ${layoutDetails.color};`"
				class="overlay_image"
			/>

			<v-card-title v-text="layoutDetails.name" />

			<v-card-subtitle>
				{{ layoutDetails.author.name }} • v{{ layoutDetails.version }}
			</v-card-subtitle>

			<v-divider v-if="layoutDetails.description" />

			<v-card-text v-if="layoutDetails.description">
				<div>{{ layoutDetails.description }}</div>
			</v-card-text>
		</v-card>
	</v-hover>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		layoutDetails: {
			type: Object,
			default: null
		}
	}
})
</script>

<style lang="scss" scoped>
.card {
	height: 100%;
	transition: cubic-bezier(0.165, 0.84, 0.44, 1) 1s;
}
.card.hover {
	background: lighten(#1e1e1e, 4%) !important;
	transform: translateY(-2px);
}

.overlay_image {
	transition: background-image 200ms;
	background: #2d2d2d;
}
</style>
