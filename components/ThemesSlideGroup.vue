<template>
	<v-sheet v-if="items" class="mx-auto" style="background: unset;">
		<v-slide-group
			:class="$vuetify.breakpoint.smAndDown ? 'smAndDown' : ''"
			show-arrows="always"
			center-active
		>
			<v-slide-item v-for="(theme, i) in items" :key="i">
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
						>
							<div v-if="theme.layout" class="badges-wrapper">
								<CertifiedBadge />
							</div>

							<v-img
								aspect-ratio="1.7778"
								:src="
									`//api.themezer.ga/storage/themes/${theme.uuid}/screenshot.jpg`
								"
								:width="
									$vuetify.breakpoint.smAndDown ? 200 : 300
								"
								contain
							/>

							<v-card-title
								:class="
									($vuetify.breakpoint.smAndDown
										? 'body-2'
										: 'subtitle-1') +
										' ' +
										(showProps.includes('creator')
											? ''
											: 'py-1 px-3')
								"
								v-text="theme.details.name"
							/>
							<v-card-subtitle
								v-if="showProps.includes('creator')"
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
import CertifiedBadge from '@/components/CertifiedBadge'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '@/components/mixins/urlParser'

export default Vue.extend({
	components: {
		CertifiedBadge
	},
	mixins: [targetParser, urlParser],
	props: {
		items: {
			type: Array,
			required: true,
			default: null
		},
		showProps: {
			type: Array,
			required: false,
			default: () => {
				return []
			}
		}
	}
})
</script>

<style lang="scss" scoped>
@import '@/assets/card.scss';
</style>
