export const state = () => ({
	background: null
})

export const mutations = {
	SET_BACKGROUND(state, url) {
		state.background = url
	}
}
