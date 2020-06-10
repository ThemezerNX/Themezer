<template>
	<v-row v-if="themesList && themesList.length > 0">
		<v-col
			v-for="theme in themesList"
			:key="theme.uuid"
			class=""
			cols="12"
			xs="12"
			sm="6"
			md="4"
			xl="3"
		>
			<ItemCard :item="theme" :type="type" />
		</v-col>
	</v-row>
	<LoadingOverlay v-else-if="$apollo.loading" />
	<span v-else>There are no themes here yet :(</span>
</template>

<script>
import Vue from 'vue'
import { themesList } from '@/graphql/Theme.gql'
import targetParser from '@/layouts/mixins/targetParser'
import ItemCard from '@/components/ItemCard.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default Vue.extend({
	components: {
		ItemCard,
		LoadingOverlay
	},
	mixins: [targetParser],
	data() {
		return {
			type: 'themes'
		}
	},
	apollo: {
		themesList: {
			query: themesList,
			variables() {
				return {
					target: this.$route.params.target
				}
			},
			prefetch: true
		}
	},
	head() {
		const title = `${this.targetName} | Themes`
		const desc = 'All Themes on Themezer'

		return {
			title,
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: desc
				},
				{
					hid: 'og:title',
					name: 'og:title',
					property: 'og:title',
					content: title
				},
				{
					hid: 'og:description',
					name: 'og:description',
					property: 'og:description',
					content: desc
				}
			]
		}
	}
})
</script>
