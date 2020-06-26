// Source: https://stackoverflow.com/a/60801428/12314121
import { createUploadLink } from 'apollo-upload-client'

export default ({ app }) => {
	const token = app.$cookies.get('auth._token.social')

	return {
		// httpEndpoint: process.env.API_ENDPOINT,
		inMemoryCacheOptions: {
			addTypename: false
		},
		defaultHttpLink: false,
		link: createUploadLink({
			uri: process.env.API_ENDPOINT,
			fetch: (uri, options) => {
				options.headers.Token = token

				return fetch(uri, options)
			}
		})
	}
}
