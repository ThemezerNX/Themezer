// Source: https://stackoverflow.com/a/60801428/12314121
import { createUploadLink } from 'apollo-upload-client'

export default ({ app }: { app: any }) => {
	const token = app.$cookies.get('auth._token.social')

	return {
		inMemoryCacheOptions: {
			addTypename: false
		},
		defaultHttpLink: false,
		link: createUploadLink({
			uri: process.env.API_ENDPOINT,
			fetch: (uri: any, options: any) => {
				options.headers.Token = token

				return fetch(uri, options)
			}
		})
	}
}
