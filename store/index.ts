export const state = () => ({
    profileColor: '',
    background: null
})

export const mutations = {
    SET_PROFILE_COLOR(state: any, color: string) {
        state.profileColor = color
    },
    SET_BACKGROUND(state: any, url: string) {
        state.background = url
    }
}
