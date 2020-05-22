<template>
	<v-card
		class="card"
		:width="
			background.url ? null : $vuetify.breakpoint.smAndDown ? 80 : 100
		"
		router
		exact
		@click="setBackground()"
	>
		<v-img
			v-if="background.url"
			aspect-ratio="1.7778"
			:src="background.url"
			:width="$vuetify.breakpoint.smAndDown ? 200 : 300"
			:lazy-src="'/logo_16-9-256.jpg'"
			contain
		/>

		<v-card-title
			v-if="background.url"
			class="py-1 px-3"
			:class="$vuetify.breakpoint.smAndDown ? 'body-2' : 'subtitle-1'"
			v-text="background.name"
		/>

		<v-row v-else class="fill-height" align="center" justify="center">
			<v-icon
				color="white"
				size="48"
				v-text="'mdi-close-circle-outline'"
			/>
		</v-row>
	</v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		background: {
			type: Object,
			default: null
		}
	},
	methods: {
		setBackground() {
			this.$store.commit('SET_BACKGROUND', this.background.url)
		}
	}
})
</script>

<style lang="scss" scoped>
.card {
	border: rgba(255, 255, 255, 0.12) solid 1px;
	transition: cubic-bezier(0.165, 0.84, 0.44, 1) 1s;
}
.card.hover {
	background: lighten(#1e1e1e, 4%) !important;
	transform: translateY(-2px);
}
</style>
