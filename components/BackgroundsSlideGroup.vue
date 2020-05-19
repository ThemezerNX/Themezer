<template>
	<v-sheet>
		<v-slide-group v-model="model" show-arrows center-active mandatory>
			<v-slide-item
				v-for="background in backgrounds"
				:key="background"
				v-slot:default="{ active, toggle }"
			>
				<v-hover v-if="background" v-slot:default="{ hover }">
					<BackgroundCard
						v-bind="{ active, toggle }"
						class="me-3"
						:background="background"
						:class="hover ? 'hover' : ''"
						@click="toggle"
					/>
				</v-hover>
			</v-slide-item>
		</v-slide-group>
	</v-sheet>
</template>

<script>
import BackgroundCard from '@/components/BackgroundCard.vue'

export default {
	components: {
		BackgroundCard
	},
	data() {
		return {
			model: null,
			backgrounds: [
				{
					name: 'None',
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
					name: 'Umbreon',
					url: '/images/backgrounds/Umbreon.jpg'
				},
				{
					name: 'GTA V',
					url: '/images/backgrounds/background12.jpg'
				}
			]
		}
	}
}
</script>
