import {Commit, Module as VuexModule, Store} from "vuex";
import {Context, Plugin} from "@nuxt/types";
import {ME_QUERY} from "~/plugins/auth/graphql/me";
import {ApolloClient} from "@apollo/client/core";

type UserProfile = {
    bio: string;
    color: string;
    avatarUrl: string;
    bannerUrl: string;
    avatarBlurHash: string;
    bannerBlurHash: string;
}

type DiscordConnection = {
    username: string;
    discriminator: string;
    avatarHash: string;
}

type UserConnections = {
    discord: DiscordConnection;
};

type UserPreferences = {
    showNSFW: boolean;
    notificationEmails: boolean;
    promotionEmails: boolean;
}

type User = {
    id: string;
    username: string;
    joinedTimestamp: Date;
    isAdmin: boolean;
    roles: string[];
    profile: UserProfile;
    connections: UserConnections;
    csrfToken: string;
    pageUrl: string;
    email: string;
    hasAccepted: boolean;
    isBlocked: boolean;
    preferences: UserPreferences;
}

class Auth {
    store: Store<any>;
    private apolloClient: ApolloClient<any>;

    constructor(store: Store<any>, apolloClient: ApolloClient<any>) {
        this.store = store;
        this.apolloClient = apolloClient;
    }

    get user() {
        return this.store.state.auth.user;
    }

    get isAuthenticated() {
        return this.store.state.auth.isAuthenticated;
    }

    login(email: string, password: string) {
        // this.apolloClient.mutate();
    }

    logout() {

    }

    register(email: string, password: string) {

    }

    async fetchUser(apolloClient?: ApolloClient<any>, commit?: Commit) {
        try {
            const res = await (apolloClient || this.apolloClient).query({
                query: ME_QUERY,
            });
            this.setUser(res.data.me, commit);
        } catch (e) {
            console.log(e);
            this.clearUser();
        }
    }

    private setUser(user: User, commit?: Commit) {
        const commitFunction = commit || this.store?.commit;
        commitFunction("SET_USER", user);
        commitFunction("SET_AUTHENTICATED", true);
    }

    private clearUser() {
        this.store.commit("SET_USER", null);
        this.store.commit("SET_AUTHENTICATED", false);
    }

}

// https://stackoverflow.com/questions/60940012/set-session-id-cookie-in-nuxt-auth
const plugin: Plugin = ({store, $apollo, app}, inject) => {
    const authClient = new Auth(store, app.apolloProvider.defaultClient);

    const storeModule: VuexModule<any, any> = {
        namespaced: true,
        state: () => ({
            user: null as User | null,
            isAuthenticated: false,
        }),
        mutations: {
            SET_USER(state: any, user: User) {
                state.user = user;
            },
            SET_IS_AUTHENTICATED(state: any, isAuthenticated: boolean) {
                state.isAuthenticated = isAuthenticated;
            },
        },
        actions: {
            async nuxtServerInit({commit}, context: Context) {
                await authClient.fetchUser(context.$apollo, commit);
            },
        },
    };

    store.registerModule("auth", storeModule);

    inject("auth", authClient);
};

export default plugin;

declare module "vue/types/vue" {
    interface Vue {
        $auth: Auth;
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        $auth: Auth;
    }

    interface Context {
        $auth: Auth;
    }
}
