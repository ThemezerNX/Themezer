<template>
	<v-hover v-if="item && item.details" v-slot:default="{ hover }">
		<v-card
			:elevation="hover ? 16 : null"
			:class="hover ? 'hover' : ''"
			class="ma-auto card"
			router
			exact
			:to="`/packs/${createUrlString(item.id, item.details.name)}`"
			:style="`border: rgba(255, 255, 255, 0.12) solid 1px;`"
		>
			<v-carousel
				continuous
				hide-delimiters
				hide-delimiter-background
				:show-arrows="false"
				:cycle="hover"
				interval="2000"
				height="auto"
			>
				<v-carousel-item
					v-for="(theme, i) in item.themes"
					:key="i"
					height="auto"
					aspect-ratio="1.7778"
					:lazy-src="'/logo_16-9-256.jpg'"
					:src="
						`//api.themezer.ga/storage/themes/${theme.uuid}/screenshot.jpg`
					"
				>
				</v-carousel-item>
			</v-carousel>

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
import urlParser from '@/layouts/mixins/urlParser'

export default Vue.extend({
	mixins: [urlParser],
	props: {
		item: {
			type: Object,
			required: true,
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
