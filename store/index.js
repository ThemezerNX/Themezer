export const state = () => ({
	background: null,
	profileColor: ''
})

export const mutations = {
	SET_BACKGROUND(state, url) {
		state.background = url
	},
	SET_PROFILE_COLOR(state, color) {
		state.profileColor = color
	}
}
