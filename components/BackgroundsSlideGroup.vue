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
							color="grey darken-4"
							@click="toggle"
						>
							<v-img
								v-if="background.url"
								aspect-ratio="1.7778"
								:src="
									require(`@/assets/backgrounds/${background.url}`)
								"
								:width="
									$vuetify.breakpoint.smAndDown ? 200 : 300
								"
								contain
							/>

							<v-card-title
								v-if="background.url"
								class="my-1 mx-3 title"
								:class="
									$vuetify.breakpoint.smAndDown
										? 'body-2'
										: 'subtitle-1'
								"
								v-text="background.name"
							/>

							<v-row
								v-else-if="background.clear"
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

							<v-row
								v-else-if="background.upload"
								class="fill-height"
								align="center"
								justify="center"
								@click="$refs.backgroundUpload[0].click()"
							>
								<v-icon
									color="white"
									size="48"
									v-text="'mdi-upload'"
								/>
								<input
									ref="backgroundUpload"
									type="file"
									style="display: none"
									accept="image/*"
									@change="handleBackgroundUpload"
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
					clear: true
				},
				{
					name: 'Breath of the Wild Forest',
					url: 'Games/Breath_of_the_Wild_Forest.jpg'
				},
				{
					name: 'Skyrim Mountains',
					url: 'Games/Skyrim_Mountains.jpg'
				},
				{
					name: "Assassin's Creed Odyssey",
					url: 'Games/Assassins_Creed_Odyssey.jpg'
				},
				{
					name: 'Far Cry 5',
					url: 'Games/Far_Cry_5.jpg'
				},
				{
					name: 'Breath of the Wild Art',
					url: 'Games/Zelda_BotW_Art.jpg'
				},
				{
					name: 'Animal Crossing New Horizons',
					url: 'Games/Animal_Crossing_New_Horizons.jpg'
				},
				{
					name: 'Sea',
					url: 'Nature/Sea.jpg'
				},
				{
					name: 'Spiderman Into the Spiderverse',
					url: 'Movies/Spiderman_Into_the_Spiderverse_-_2.jpg'
				},
				{
					name: 'PewDiePie',
					url: 'PewDiePie.jpg'
				},
				{
					name: 'Darling in the Franxx',
					url: 'Movies/Darling_in_the_Franxx_-_1.jpg'
				},
				{
					name: 'Nier Automata',
					url: 'Games/Nier_Automata_-_1.jpg'
				},
				{
					name: 'Persona 5 Ryuji',
					url: 'Games/Persona_5/Persona_5_Ryuji.jpg'
				},
				{
					upload: true
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
	},
	methods: {
		handleBackgroundUpload(input) {
			if (input && input.target.files[0]) {
				const imageUrl = URL.createObjectURL(input.target.files[0])
				this.$store.commit('SET_BACKGROUND', imageUrl)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/assets/card.scss';
</style>
