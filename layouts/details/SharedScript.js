import Vue from 'vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

export default Vue.extend({
	components: {
		LoadingOverlay
	},
	data: () => {
		return {
			landscape: false,
			show: false
		}
	},
	mounted() {
		window.addEventListener(
			'orientationchange',
			this.handleOrientationChange
		)
		this.handleOrientationChange()
	},
	methods: {
		handleOrientationChange() {
			const orientation = window.screen.orientation.type
			if (orientation === 'portrait-primary') {
				this.landscape = false
			} else if (orientation === 'landscape-primary') {
				this.landscape = true
			}
		},
		niceDate(unix) {
			const monthNames = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
			]

			const DateTime = new Date(unix)
			return (
				monthNames[DateTime.getMonth()] +
				' ' +
				DateTime.getDate() +
				', ' +
				DateTime.getFullYear()
			)
		}
	}
})
