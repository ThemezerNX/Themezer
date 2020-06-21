<template>
	<v-sheet class="mx-auto" style="background: unset;">
		<h2 class="px-2">
			Try these backgrounds
		</h2>
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
							class="ma-auto card"
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
					name: 'Breath of the Wild Forest',
					url:
						'/images/backgrounds/Games/Breath of the Wild Forest.jpg'
				},
				{
					name: 'Skyrim Mountains',
					url: '/images/backgrounds/Games/Skyrim Mountains.jpg'
				},
				{
					name: "Assassin's Creed Odyssey",
					url: '/images/backgrounds/Games/Assassins Creed Odyssey.jpg'
				},
				{
					name: 'Far Cry 5',
					url: '/images/backgrounds/Games/Far Cry 5.jpg'
				},
				{
					name: 'Breath of the Wild Art',
					url: '/images/backgrounds/Games/Zelda BotW Art.jpg'
				},
				{
					name: 'Animal Crossing New Horizons',
					url:
						'/images/backgrounds/Games/Animal Crossing New Horizons.jpg'
				},
				{
					name: 'Sea',
					url: '/images/backgrounds/Nature/Sea.jpg'
				},
				{
					name: 'Spiderman Into the Spiderverse',
					url:
						'/images/backgrounds/Movies/Spiderman Into the Spiderverse - 2.jpg'
				},
				{
					name: 'PewDiePie',
					url: '/images/backgrounds/PewDiePie.jpg'
				},
				{
					name: 'Darling in the Franxx',
					url:
						'/images/backgrounds/Movies/Darling in the Franxx - 1.jpg'
				},
				{
					name: 'Nier Automata',
					url: '/images/backgrounds/Games/Nier Automata - 1.jpg'
				},
				{
					name: 'Persona 5 Ryuji',
					url:
						'/images/backgrounds/Games/Persona 5/Persona 5 Ryuji.jpg'
				}
			]
		}
	},
	watch: {
		activeBackground(selected) {
			this.$store.commit(
				'SET_BACKGROUND',
				this.backgrounds[selected].url
					? encodeURI(this.backgrounds[selected].url)
					: null
			)
		}
	}
}
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
