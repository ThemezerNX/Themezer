<template>
	<v-hover v-if="item && item.details" v-slot:default="{ hover }">
		<v-card
			:elevation="hover ? 16 : null"
			:class="hover ? 'hover' : ''"
			class="ma-auto card"
			router
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
					:src="
						`//api.themezer.ga/storage/themes/${theme.uuid}/screenshot.jpg`
					"
				>
				</v-carousel-item>
			</v-carousel>

			<v-card-title class="title" v-text="item.details.name" />

			<v-card-subtitle class="creator">
				{{ item.creator.discord_user.username }} • v{{
					item.details.version
				}}
			</v-card-subtitle>

			<v-divider v-if="item.details.description" />

			<v-card-text v-if="item.details.description" class="description">
				<div v-linkified v-html="item.details.description" />
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
		}
	}
})
</script>

<style lang="scss" scoped>
@import '@/assets/card.scss';
</style>
