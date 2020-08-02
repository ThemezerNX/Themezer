// Source: https://stackoverflow.com/a/60801428/12314121
import { createUploadLink } from 'apollo-upload-client'
import { ApolloLink } from 'apollo-link'

export default ({ app }: { app: any }) => {
	const token = app.$cookies.get('auth._token.social')

	const uploadLink = createUploadLink({
		uri: process.env.API_ENDPOINT,
		includeExtensions: true,
		fetch: (uri: any, options: any) => {
			options.headers.Token = token

			return fetch(uri, options)
		}
	})

	return {
		inMemoryCacheOptions: {
			addTypename: false
		},
		defaultHttpLink: false,
		link: ApolloLink.from([uploadLink])
	}
}
