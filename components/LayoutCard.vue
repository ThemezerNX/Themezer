<template>
	<v-hover v-if="layoutDetails" v-slot:default="{ hover }">
		<v-card
			:elevation="hover ? 16 : null"
			class="mx-auto"
			max-width="400"
			router
			exact
			:to="`/${$parent.menu}/${layoutDetails.title}`"
		>
			<v-img
				aspect-ratio="1.7778"
				:src="layoutDetails.overlay"
				:lazy-src="'/icon.png'"
				contain
			/>

			<v-card-title
				v-if="layoutDetails.title"
				v-text="layoutDetails.title"
			/>

			<v-card-subtitle
				v-if="layoutDetails.author"
				class="pb-0"
				v-text="layoutDetails.author"
			/>

			<v-card-text v-if="layoutDetails.description" class="text--primary">
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
	},
	data() {
		return {}
	}
})
</script>
