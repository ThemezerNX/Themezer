const themes = {
	name: 'themes',
	icon: 'mdi-format-color-fill'
}
const layouts = {
	name: 'layouts',
	icon: 'mdi-code-json'
}

export default [
	{
		icon: 'mdi-home-outline',
		title: 'Home Menu',
		target: 'homemenu',
		image: 'ResidentMenu.jpg',
		types: [themes, layouts]
	},
	{
		icon: 'mdi-lock-outline',
		title: 'Lockscreen',
		target: 'lockscreen',
		image: 'Entrance.jpg',
		types: [themes, layouts]
	},
	{
		icon: 'mdi-apps',
		title: 'All Apps',
		target: 'allapps',
		image: 'Flaunch.jpg',
		types: [themes, layouts]
	},
	{
		icon: 'mdi-cog-outline',
		title: 'Settings',
		target: 'settings',
		image: 'Set.jpg',
		types: [themes, layouts]
	},
	{
		icon: 'mdi-account-multiple',
		title: 'Player Select',
		target: 'playerselect',
		image: 'Psl.jpg',
		types: [themes, layouts]
	},
	{
		icon: 'mdi-account-outline',
		title: 'User Page',
		target: 'userpage',
		image: 'MyPage.jpg',
		types: [themes, layouts]
	},
	{
		icon: 'mdi-newspaper-variant-outline',
		title: 'News',
		target: 'news',
		image: 'Notification.jpg',
		types: [themes, layouts]
	}
]
