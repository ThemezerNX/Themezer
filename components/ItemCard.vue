<template>
	<v-hover v-if="item && item.details" v-slot:default="{ hover }">
		<v-card
			:elevation="hover ? 16 : null"
			:class="hover ? 'hover' : ''"
			class="ma-auto card"
			router
			exact
			:to="
				`${$route.params.target}/${createUrlString(
					item.id,
					item.details.name
				)}`
			"
			:style="`border: rgba(255, 255, 255, 0.12) solid 1px;`"
		>
			<v-img
				aspect-ratio="1.7778"
				:src="imgSrc"
				:lazy-src="'/logo_16-9-256.jpg'"
				contain
				:style="
					type === 'layouts'
						? `background-color: ${item.details.color};`
						: ''
				"
				class="overlay_image"
			/>

			<v-card-title v-text="item.details.name" />

			<v-card-subtitle>
				{{ item.details.author.name }} • v{{ item.details.version }}
			</v-card-subtitle>

			<v-divider v-if="item.details.description" />

			<v-card-text v-if="item.details.description">
				<div>{{ item.details.description }}</div>
			</v-card-text>
		</v-card>
	</v-hover>
</template>

<script lang="ts">
import Vue from 'vue'
import urlParser from '@/components/mixins/urlParser'

export default Vue.extend({
	mixins: [urlParser],
	props: {
		item: {
			type: Object,
			required: true,
			default: null
		},
		type: {
			type: String,
			required: true,
			default: null
		}
	},
	computed: {
		imgSrc(): String {
			if (this.type === 'layouts')
				return `//api.themezer.ga/storage/layouts/${this.item.uuid}/overlay.png`
			else if (this.type === 'themes')
				return `//api.themezer.ga/storage/themes/${this.item.uuid}/screenshot.jpg`
			else return ''
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
