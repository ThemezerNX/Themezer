import {ApolloClient} from "@apollo/client/core";

declare module "vue/types/vue" {
    interface Vue {
        $apollo: ApolloClient<any>;
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        $apollo: ApolloClient<any>;
    }

    interface Context {
        $apollo: ApolloClient<any>;
    }
}
