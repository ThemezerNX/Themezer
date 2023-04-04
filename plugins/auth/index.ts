import {Commit, Module as VuexModule, Store} from "vuex";
import {Context, Plugin} from "@nuxt/types";
import {ME_QUERY} from "@/plugins/auth/graphql/me";
import {LOGIN_MUTATION} from "@/plugins/auth/graphql/login";
import {LOGOUT_MUTATION} from "@/plugins/auth/graphql/logout";
import {SnackbarPlugin} from "@/plugins/snackbar";
import {REGISTER_MUTATION} from "@/plugins/auth/graphql/register";
import {ApolloClient} from "apollo-client";

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
    snackbar: SnackbarPlugin;
    private apolloClient: ApolloClient<any>;

    constructor(store: Store<any>, snackbar: SnackbarPlugin, apolloClient: ApolloClient<any>) {
        this.store = store;
        this.snackbar = snackbar;
        this.apolloClient = apolloClient;
    }

    get user() {
        return this.store.state.auth.user;
    }

    get isAuthenticated() {
        return this.store.state.auth.isAuthenticated;
    }

    async login(email: string, password: string) {
        return true;
        try {
            const res = await this.apolloClient.mutate({
                mutation: LOGIN_MUTATION,
                variables: {
                    email,
                    password,
                },
            });

            this.setUser(res.data.login);
            return true;
        } catch (e) {
            console.error(e);
            this.clearUser();
            throw e;
        }
    }

    async logout() {
        try {
            const res = await this.apolloClient.mutate({
                mutation: LOGOUT_MUTATION,
            });

            this.clearUser();
            return true;
        } catch (e) {
            console.error(e);
        }
    }

    async register(email: string, username: string, password: string) {
        try {
            const res = await this.apolloClient.mutate({
                mutation: REGISTER_MUTATION,
                variables: {
                    email,
                    username,
                    password,
                },
            });

            this.setUser(res.data.register);
            return true;
        } catch (e) {
            console.error(e);
            this.clearUser();
            throw e;
        }
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
    }

    private clearUser() {
        this.store.commit("SET_USER", null);
    }

}

// https://stackoverflow.com/questions/60940012/set-session-id-cookie-in-nuxt-auth
const plugin: Plugin = ({store, app, $snackbar}, inject) => {
    console.log("Auth plugin");
    if (app.apolloProvider?.defaultClient) {
        const authClient = new Auth(store, $snackbar, app.apolloProvider.defaultClient);
        const storeModule: VuexModule<any, any> = {
            namespaced: true,
            state: () => ({
                user: null as User | null,
                isAuthenticated: false,
            }),
            mutations: {
                SET_USER(state: any, user: User) {
                    state.user = user;
                    state.isAuthenticated = !!user;
                },
            },
            actions: {
                async nuxtServerInit({commit}, context: Context) {
                    await authClient.fetchUser(context.app.apolloProvider?.defaultClient, commit);
                },
            },
        };

        store.registerModule("auth", storeModule);

        inject("auth", authClient);
    }
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
