<template>
	<v-sheet class="mx-auto" style="background: unset;">
		<v-slide-group
			v-model="activeBackground"
			:class="$vuetify.breakpoint.smAndDown ? 'smAndDown' : ''"
			show-arrows
			center-active
			mandatory
		>
			<v-slide-item
				v-for="(background, i) in backgrounds"
				:key="i"
				v-slot:default="{ active, toggle }"
			>
				<v-hover v-if="background" v-slot:default="{ hover }">
					<v-scale-transition>
						<v-card
							class="card"
							:class="
								`
							${i === 0 ? 'ms-0' : $vuetify.breakpoint.smAndDown ? 'ms-1' : 'ms-2'}
							${
								i === backgrounds.length - 1
									? 'me-0'
									: $vuetify.breakpoint.smAndDown
									? 'me-1'
									: 'me-2'
							}
							${hover ? 'hover' : ''}
							`
							"
							:width="
								background.url
									? null
									: $vuetify.breakpoint.smAndDown
									? 80
									: 100
							"
							router
							exact
							@click="toggle"
						>
							<v-img
								v-if="background.url"
								aspect-ratio="1.7778"
								:src="background.url"
								:width="
									$vuetify.breakpoint.smAndDown ? 200 : 300
								"
								:lazy-src="'/logo_16-9-256.jpg'"
								contain
							/>

							<v-card-title
								v-if="background.url"
								class="py-1 px-3"
								:class="
									$vuetify.breakpoint.smAndDown
										? 'body-2'
										: 'subtitle-1'
								"
								v-text="background.name"
							/>

							<v-row
								v-else
								class="fill-height"
								align="center"
								justify="center"
							>
								<v-icon
									color="white"
									size="48"
									v-text="'mdi-close-circle-outline'"
								/>
							</v-row>
						</v-card>
					</v-scale-transition>
				</v-hover>
			</v-slide-item>
		</v-slide-group>
	</v-sheet>
</template>

<script>
export default {
	data() {
		return {
			activeBackground: 0,
			backgrounds: [
				{
					url: null
				},
				{
					name: 'Breath of The Wild Forest',
					url: '/images/backgrounds/background8.jpg'
				},
				{
					name: "Assassin's Creed Odyssey",
					url: '/images/backgrounds/background9.jpg'
				},
				{
					name: 'Far Cry 5',
					url: '/images/backgrounds/background6.jpg'
				},
				{
					name: 'Skyrim',
					url: '/images/backgrounds/background3.jpg'
				},
				{
					name: 'GTA V',
					url: '/images/backgrounds/background12.jpg'
				}
			]
		}
	},
	watch: {
		activeBackground(selected) {
			this.$store.commit('SET_BACKGROUND', this.backgrounds[selected].url)
		}
	}
}
</script>

<style lang="scss">
.v-slide-group__content {
	padding-top: 6px;
	padding-bottom: 6px;
}

.smAndDown .v-slide-group__prev,
.v-slide-group__next {
	min-width: unset;
}

.card {
	border: rgba(255, 255, 255, 0.12) solid 1px !important;
	transition: cubic-bezier(0.165, 0.84, 0.44, 1) 1s;
}
.card.hover {
	background: lighten(#1e1e1e, 4%) !important;
	transform: translateY(-2px);
}
</style>
