export const state = () => ({
	profileColor: '',
	background: null
})

export const mutations = {
	SET_PROFILE_COLOR(state, color) {
		state.profileColor = color
	},
	SET_BACKGROUND(state, url) {
		state.background = url
	}
}
