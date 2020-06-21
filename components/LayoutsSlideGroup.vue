<template>
	<v-sheet v-if="items" class="mx-auto" style="background: unset;">
		<v-slide-group
			:class="$vuetify.breakpoint.smAndDown ? 'smAndDown' : ''"
			show-arrows
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
							exact
							:to="
								`/layouts/${fileNameToWebName(
									layout.target
								)}/${createUrlString(
									layout.id,
									layout.details.name
								)}`
							"
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
								class="py-1 px-3"
								:class="
									$vuetify.breakpoint.smAndDown
										? 'body-2'
										: 'subtitle-1'
								"
								v-text="layout.details.name"
							/>
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
		}
	}
})
</script>

<style lang="scss" scoped>
@import '@/assets/card.scss';
</style>
