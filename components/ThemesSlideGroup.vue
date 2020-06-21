<template>
	<v-sheet v-if="items" class="mx-auto" style="background: unset;">
		<v-slide-group
			:class="$vuetify.breakpoint.smAndDown ? 'smAndDown' : ''"
			show-arrows
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
							exact
							:to="
								`/themes/${fileNameToWebName(
									theme.target
								)}/${createUrlString(
									theme.id,
									theme.details.name
								)}`
							"
						>
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
								class="py-1 px-3"
								:class="
									$vuetify.breakpoint.smAndDown
										? 'body-2'
										: 'subtitle-1'
								"
								v-text="theme.details.name"
							/>
						</v-card>
					</v-scale-transition>
				</v-hover>
			</v-slide-item>
		</v-slide-group>
	</v-sheet>
</template>

<script>
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

<style lang="scss">
.card {
	border: rgba(255, 255, 255, 0.12) solid 1px !important;
	transition: cubic-bezier(0.165, 0.84, 0.44, 1) 1s;
}
.card.hover {
	background: lighten(#1e1e1e, 4%) !important;
	transform: translateY(-2px);
}
</style>
