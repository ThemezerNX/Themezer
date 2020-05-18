<template>
	<div>
		<BackgroundCard
			v-for="background in backgrounds"
			:key="background.name"
			:background="background"
		/>
	</div>
</template>

<script>
import BackgroundCard from '@/components/BackgroundCard.vue'

export default {
	components: {
		BackgroundCard
	},
	data() {
		return {
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
