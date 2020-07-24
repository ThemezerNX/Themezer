<template>
	<v-sheet v-if="items" class="mx-auto" style="background: unset;">
		<v-slide-group
			:class="$vuetify.breakpoint.smAndDown ? 'smAndDown' : ''"
			show-arrows="always"
			center-active
		>
			<v-slide-item v-for="(theme, i) in sortedItems" :key="i">
				<v-hover v-if="theme" v-slot:default="{ hover }">
					<v-scale-transition>
						<v-card
							class="mx-auto card"
							:class="
								`
								${i === 0 ? 'ms-0' : $vuetify.breakpoint.smAndDown ? 'ms-1' : 'ms-2'}
								${
									i === items.length - 1
										? 'me-0'
										: $vuetify.breakpoint.smAndDown
										? 'me-1'
										: 'me-2'
								}
								${hover ? 'hover' : ''}
							`
							"
							router
							:to="
								`/themes/${fileNameToWebName(
									theme.target
								)}/${createUrlString(
									theme.id,
									theme.details.name
								)}`
							"
							color="grey darken-4"
						>
							<div v-if="theme.layout" class="badges-wrapper">
								<CertifiedBadge />
							</div>

							<v-img
								aspect-ratio="1.7778"
								:src="
									`//api.themezer.ga/cdn/themes/${theme.id}/screenshot.jpg`
								"
								:width="
									$vuetify.breakpoint.smAndDown ? 200 : 300
								"
								contain
							/>

							<v-card-title
								class="title"
								:class="
									($vuetify.breakpoint.smAndDown
										? 'body-2'
										: 'subtitle-1') +
										' ' +
										(showProps.includes('creator')
											? 'mb-0'
											: 'my-1 mx-3')
								"
								v-text="theme.details.name"
							/>
							<v-card-subtitle
								v-if="showProps.includes('creator')"
								class="creator"
							>
								By {{ theme.creator.discord_user.username }}
							</v-card-subtitle>
						</v-card>
					</v-scale-transition>
				</v-hover>
			</v-slide-item>
		</v-slide-group>
	</v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '@/components/mixins/urlParser'
import slideGroupSorting from '@/components/mixins/slideGroupSorting'

export default Vue.extend({
	components: {
		CertifiedBadge: () => import('@/components/badges/CertifiedBadge.vue')
	},
	mixins: [targetParser, urlParser, slideGroupSorting],
	props: {
		items: {
			type: Array,
			required: true,
			default: null
		},
		showProps: {
			type: Array,
			required: false,
			default() {
				return []
			}
		}
	}
})
</script>

<style lang="scss" scoped>
@import '@/assets/card.scss';
</style>
