import Vue from 'vue'

export default Vue.extend({
	computed: {
		targetName(): string | null {
			switch (this.$route.params.target) {
				case 'homemenu':
					return 'Home Menu'
				case 'lockscreen':
					return 'Lockscreen'
				case 'userpage':
					return 'User Page'
				case 'allapps':
					return 'All Apps'
				case 'settings':
					return 'Settings'
				case 'news':
					return 'News'
				case 'playerselect':
					return 'Player Select'

				default:
					return null
			}
		},
		targetFile(): string | null {
			switch (this.$route.params.target) {
				case 'homemenu':
					return 'ResidentMenu'
				case 'lockscreen':
					return 'Entrance'
				case 'userpage':
					return 'MyPage'
				case 'allapps':
					return 'Flaunch'
				case 'settings':
					return 'Set'
				case 'news':
					return 'Notification'
				case 'playerselect':
					return 'Psl'

				default:
					return null
			}
		}
	},
	methods: {
		fileNameToWebName(s: string): string | null {
			switch (s) {
				case 'ResidentMenu.szs':
				case 'ResidentMenu':
					return 'homemenu'
				case 'Entrance.szs':
				case 'Entrance':
					return 'lockscreen'
				case 'MyPage.szs':
				case 'MyPage':
					return 'userpage'
				case 'Flaunch.szs':
				case 'Flaunch':
					return 'allapps'
				case 'Set.szs':
				case 'Set':
					return 'settings'
				case 'Notification.szs':
				case 'Notification':
					return 'news'
				case 'Psl.szs':
				case 'Psl':
					return 'playerselect'

				default:
					return null
			}
		}
	}
})