import {Oauth2Scheme} from "@nuxtjs/auth-next/dist/runtime";
import {extendMe} from "@/graphql/Creator.gql";

export default class CustomScheme extends Oauth2Scheme {
    async fetchUser() {
        if (!this.check().valid) {
            return;
        }

        if (!this.options.endpoints.userInfo) {
            this.$auth.setUser({});
            return;
        }

        const {data} = await this.$auth.requestWith(this.name, {
            url: this.options.endpoints.userInfo,
        });

        try {
            const $apollo = this.$auth.ctx.app.apolloProvider.clients
                .defaultClient;

            const {
                data: {me},
            } = await $apollo.query({
                query: extendMe,
                fetchPolicy: "network-only",
            });

            this.$auth.setUser({
                ...data,
                ...me,
                isAdmin: !!me.roles?.includes("admin"),
            });
        } catch (e) {
            this.$auth.setUser({
                ...data,
            });
        }
    }

    // async logout() {
    // 	if (this.options.endpoints.logout) {
    // 		this.requestHandler.clearHeader()
    // 		await this.$auth.request(this.name, {
    // 			method: 'post',
    // 			headers: {
    // 				'content-type': 'application/x-www-form-urlencoded',
    // 				authorization: ''
    // 			},
    // 			url: this.options.endpoints.logout,
    // 			data: {
    // 				token: ''
    // 			}
    // 		})

    // 		return this.$auth.reset()
    // 	}
    // }
}
