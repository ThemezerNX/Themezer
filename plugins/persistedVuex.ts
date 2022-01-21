import createPersistedState from "vuex-persistedstate";
import {Plugin} from "@nuxt/types";

const plugin: Plugin = ({store}) => {
    createPersistedState()(store);
};

export default plugin;
