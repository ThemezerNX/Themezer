<template>
	<v-hover v-if="background" v-slot:default="{ hover }">
		<v-card
			:elevation="hover ? 16 : null"
			class="mb-4 card"
			:class="hover ? 'hover' : ''"
			router
			exact
			@click="setBackground()"
		>
			<v-img
				aspect-ratio="1.7778"
				:src="background.url"
				:lazy-src="'/logo-256.jpg'"
				contain
			/>

			<v-card-title class="title py-1 px-3" v-text="background.name" />
		</v-card>
	</v-hover>
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
	height: 100%;
	border: rgba(255, 255, 255, 0.12) solid 1px;
	transition: cubic-bezier(0.165, 0.84, 0.44, 1) 1s;
}
.card.hover {
	background: lighten(#1e1e1e, 4%) !important;
	transform: translateY(-2px);
}

.title {
	font-size: 1rem !important;
}
</style>
