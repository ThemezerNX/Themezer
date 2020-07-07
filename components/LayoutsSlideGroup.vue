<template>
	<v-sheet v-if="items" class="mx-auto" style="background: unset;">
		<v-slide-group
			:class="$vuetify.breakpoint.smAndDown ? 'smAndDown' : ''"
			show-arrows="always"
			center-active
		>
			<v-slide-item v-for="(layout, i) in items" :key="i">
				<v-hover v-if="layout" v-slot:default="{ hover }">
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
								`/layouts/${fileNameToWebName(
									layout.target
								)}/${createUrlString(
									layout.id,
									layout.details.name
								)}`
							"
							color="grey darken-4"
						>
							<v-img
								aspect-ratio="1.7778"
								:src="
									`//api.themezer.ga/storage/layouts/${layout.uuid}/overlay.png`
								"
								contain
								:style="
									`background-color: ${layout.details.color};`
								"
								:width="
									$vuetify.breakpoint.smAndDown ? 200 : 300
								"
								class="overlay-image"
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
								v-text="layout.details.name"
							/>
							<v-card-subtitle
								v-if="showProps.includes('creator')"
								class="creator"
							>
								By {{ layout.creator.discord_user.username }}
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

export default Vue.extend({
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
