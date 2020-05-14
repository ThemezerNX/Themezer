<template v-for="folder in folders">
	<LayoutCard :layout-details="layoutDetails" />
</template>

<script lang="ts">
import Vue from 'vue'
import LayoutCard from '@/components/LayoutCard.vue'

const layoutDetails = {
	title: 'Flow Layout',
	author: 'Migush',
	description: 'A clean material UI with simple clean animations.',
	overlay:
		'https://github.com/exelix11/SwitchThemeInjector/raw/master/SwitchThemes/layouts/Flow Layout.jpg'
}

export default Vue.extend({
	components: {
		LayoutCard
	},
	data() {
		return {
			folders: [{}],
			menu: 'homemenu',
			layoutDetails
		}
	}
})
</script>
