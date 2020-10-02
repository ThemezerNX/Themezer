<template>
	<v-hover v-if="item && item.details" v-slot:default="{ hover }">
		<v-card
			:elevation="hover ? 12 : 2"
			:class="{ 'on-hover': hover }"
			class="ma-auto card transition-fast-in-fast-out"
			router
			:to="
				(type === 'packs'
					? '/packs'
					: `/${type}/${fileNameToWebName(item.target)}`) +
					`/${createUrlString(item.id, item.details.name)}`
			"
			:style="`border: rgba(255, 255, 255, 0.12) solid 1px;`"
		>
			<div v-if="item.layout" class="badges-wrapper">
				<CertifiedBadge />
			</div>

			<v-carousel
				v-if="type === 'packs'"
				continuous
				hide-delimiters
				hide-delimiter-background
				:show-arrows="false"
				:cycle="hover"
				interval="2000"
				height="auto"
				class="mb-n2"
			>
				<v-carousel-item v-for="(theme, i) in item.themes" :key="i">
					<v-img
						:src="theme.preview.thumb"
						cover
						:style="
							type === 'layouts'
								? `background-color: ${item.details.color};`
								: ''
						"
						aspect-ratio="1.7778"
						style="border-radius: 5px"
						class="overlay-image ma-2"
					/>
				</v-carousel-item>
			</v-carousel>

			<v-img
				v-else
				aspect-ratio="1.7778"
				:src="imgSrc"
				cover
				:style="
					type === 'layouts'
						? `background-color: ${item.details.color};`
						: ''
				"
				style="border-radius: 5px"
				class="overlay-image ma-2"
			/>

			<v-card-title
				class="title subtitle-1"
				:class="
					showProps.includes('creator') ||
					showProps.includes('target')
						? 'mb-0'
						: 'my-1 mx-3'
				"
				v-text="item.details.name"
			/>

			<v-card-subtitle
				v-if="showProps.includes('creator')"
				class="creator"
			>
				By {{ item.creator.display_name }}
				{{ item.details.version ? `• v${item.details.version}` : '' }}
			</v-card-subtitle>

			<v-card-subtitle
				v-if="showProps.includes('target') && item.target"
				class="creator"
			>
				{{ item.target }}
			</v-card-subtitle>

			<v-divider v-if="item.details.description" />

			<v-card-text
				v-if="
					item.details.description &&
						showProps.includes('description')
				"
				class="description"
			>
				<div v-linkified v-html="item.details.description" />
			</v-card-text>
		</v-card>
	</v-hover>
</template>

<script lang="ts">
import Vue from 'vue'
import urlParser from '@/components/mixins/urlParser'
import targetParser from '@/components/mixins/targetParser'

export default Vue.extend({
	components: {
		CertifiedBadge: () => import('@/components/badges/CertifiedBadge.vue')
	},
	mixins: [urlParser, targetParser],
	props: {
		item: {
			type: Object,
			required: true,
			default: null
		},
		type: {
			type: String,
			required: true
		},
		showProps: {
			type: Array,
			required: false,
			default() {
				return []
			}
		}
	},
	computed: {
		imgSrc(): String {
			if (this.type === 'layouts')
				return `${process.env.API_ENDPOINT}cdn/layouts/${this.item.uuid}/overlay.png`
			else if (this.type === 'themes') return this.item.preview.thumb
			else return ''
		}
	}
})
</script>

<style lang="scss" scoped>
@import '~assets/card.scss';
</style>
