export const state = () => ({
    profileColor: "",
    background: {
        index: 0,
        url: null,
    },
});

export const mutations = {
    SET_PROFILE_COLOR(state: any, color: string) {
        state.profileColor = color;
    },
    SET_BACKGROUND(state: any, {index, url}: { index: number; url: string }) {
        state.background.index = index;
        state.background.url = url;
    },
};
