export const state = () => ({
    profileColor: "",
    backgroundIndex: 0,
    background: null,
});

export const mutations = {
    SET_PROFILE_COLOR(state: any, color: string) {
        state.profileColor = color;
    },
    SET_BACKGROUND(state: any, {index, url}: { index: number; url: string | null }) {
        state.backgroundIndex = index;
        state.background = url;
    },
};
