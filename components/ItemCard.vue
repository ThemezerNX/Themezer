<template>
	<v-hover v-if="item && item.details" v-slot:default="{ hover }">
		<v-card
			:elevation="hover ? 16 : null"
			:class="hover ? 'hover' : ''"
			class="ma-auto card"
			router
			:to="
				`${$route.params.target}/${createUrlString(
					item.id,
					item.details.name
				)}`
			"
			:style="`border: rgba(255, 255, 255, 0.12) solid 1px;`"
		>
			<div v-if="item.layout" class="badges-wrapper">
				<CertifiedBadge />
			</div>

			<v-img
				aspect-ratio="1.7778"
				:src="imgSrc"
				contain
				:style="
					type === 'layouts'
						? `background-color: ${item.details.color};`
						: ''
				"
				class="overlay-image"
			/>

			<v-card-title class="title mb-0" v-text="item.details.name" />

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
import CertifiedBadge from '@/components/CertifiedBadge.vue'
import urlParser from '@/components/mixins/urlParser'

export default Vue.extend({
	components: {
		CertifiedBadge
	},
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
@import '@/assets/card.scss';
</style>
