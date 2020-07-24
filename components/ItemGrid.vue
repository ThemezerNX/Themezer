<template>
	<div>
		<v-row v-if="items && items.length > 0">
			<v-col
				v-for="item in items"
				:key="item.uuid"
				cols="12"
				xs="12"
				sm="6"
				md="4"
				lg="3"
				xl="2"
			>
				<ItemCard :item="item" :type="type" :show-props="showProps" />
			</v-col>
		</v-row>
		<nuxt-link v-if="moreUrl && items.length === 12" :to="moreUrl">
			More items
		</nuxt-link>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import targetParser from '@/components/mixins/targetParser'
import urlParser from '@/components/mixins/urlParser'
import slideGroupSorting from '@/components/mixins/slideGroupSorting'

export default Vue.extend({
	components: {
		ItemCard: () => import('@/components/ItemCard.vue')
	},
	mixins: [targetParser, urlParser, slideGroupSorting],
	props: {
		type: {
			type: String,
			required: true
		},
		moreUrl: {
			type: String,
			required: false,
			default: null
		},
		items: {
			type: Array,
			required: true,
			default: null
		},
		showProps: {
			type: Array,
			required: false,
			default() {
				return []
			}
		}
	}
})
</script>
