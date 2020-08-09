import Vue from 'vue'

export default Vue.extend({
	components: {
		Error: () => import('@/layouts/error.vue')
	},
	data() {
		return {
			error: null
		}
	}
})
