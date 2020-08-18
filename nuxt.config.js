require('dotenv').config()
const ImageminPlugin = require('imagemin-webpack-plugin').default

export default {
	debug: false,
	env: {
		APP_TITLE: 'Themezer',
		API_ENDPOINT: process.env.API_ENDPOINT
	},

	server: {
		port: process.env.PORT,
		host: process.env.HOST
	},

	mode: 'universal',

	head: {
		titleTemplate: '%s | Themezer',
		title: 'Themezer',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				name: 'theme-color',
				content: '#0ab379'
			},
			{
				name: 'msapplication-TileColor',
				content: '#0ab379'
			},
			{
				hid: 'description',
				name: 'description',
				content: process.env.npm_package_description || ''
			}
		]
	},

	messages: {
		loading: 'Loading...',
		error_404: 'This page could not be found. Go back',
		server_error: 'URL malformed or item not found',
		server_error_details:
			"The URL is likely malformed. Go back using your browser's back button or go",
		client_error_details: 'An error occurred while rendering the page.'
	},

	loading: { color: '#0ab379' },

	plugins: [
		'@/plugins/linkify',
		'@/plugins/snackbar',
		'@/plugins/hashString',
		{
			src: '@/plugins/pagination',
			mode: 'client'
		},
		{
			src: '@/plugins/downloadFile',
			mode: 'client'
		}
	],

	buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify', '@nuxtjs/gtm'],

	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/apollo',
		[
			'nuxt-rfg-icon',
			{
				masterPicture: 'static/icon.png'
			}
		],
		'@nuxtjs/pwa',
		'@nuxtjs/dotenv',
		'@nuxtjs/redirect-module',
		['cookie-universal-nuxt', { parseJSON: false }],
		'@nuxtjs/auth-next'
	],

	redirect: [
		{
			from: '(?!^/$|^/[?].*$)(.*/[?](.*)$|.*/$)',
			to: (_from, req) => {
				const base = req._parsedUrl.pathname.replace(/\/$/, '')
				const search = req._parsedUrl.search
				return base + (search != null ? search : '')
			},
			statusCode: 301
		}
	],

	gtm: {
		id: 'GTM-T5ZBWPZ'
	},

	apollo: {
		clientConfigs: {
			default: '~/plugins/apolloClient'
		},
		errorHandler: '~/plugins/apolloErrorHandler'
	},

	pwa: {
		manifest: {
			name: 'Themezer',
			short_name: 'Themezer',
			description: process.env.npm_package_description || '',
			lang: 'en',
			theme_color: '#0ab379',
			background_color: '#121212'
		}
	},

	/*
	 ** https://github.com/nuxt-community/vuetify-module
	 */
	vuetify: {
		optionsPath: './vuetify.options.ts'
	},

	auth: {
		cookie: {
			prefix: 'auth.',
			options: {
				maxAge: 604800
			}
		},
		redirect: {
			callback: '/logged-in',
			logout: '/logged-out'
		},
		strategies: {
			social: {
				scheme: '@/schemes/customScheme',
				clientId: '722724539028734003',
				endpoints: {
					// logout: 'https://discord.com/api/oauth2/token/revoke', needs POST method(?)
					authorization: 'https://discord.com/api/oauth2/authorize',
					token: {
						url: 'https://discord.com/api/oauth2/token',
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						}
					},
					userInfo: 'https://discord.com/api/users/@me'
				},
				scope: ['identify'],
				token: {
					type: 'Bearer',
					name: 'Authorization',
					maxAge: 60 * 60 * 24 * 7 // 7 days
				},
				refreshToken: {
					property: 'refresh_token',
					maxAge: 60 * 60 * 24 * 30
				}
			}
		}
	},

	components: false,

	router: {
		trailingSlash: false
	},

	build: {
		transpile: ['@nuxtjs/auth-next', 'vuetify/lib'],
		extractCSS: process.env.NODE_ENV === 'production',
		parallel: process.env.NODE_ENV !== 'production',
		optimization: {
			splitChunks: {
				chunks: 'all'
			}
		},
		plugins: [
			new ImageminPlugin({
				disable: process.env.NODE_ENV !== 'production',
				pngquant: {
					quality: '80-100'
				}
			})
		],
		extend(config, { isDev, isClient, loaders: { vue } }) {
			if (isDev) {
				config.mode = 'development'
			} else if (isClient) {
				vue.transformAssetUrls['v-img'] = 'src'
				config.optimization.splitChunks.maxSize = 200000
				config.optimization.splitChunks.cacheGroups = {
					styles: {
						name: 'styles',
						test: /\.(css|vue)$/,
						chunks: 'all',
						enforce: true
					}
				}
			}
		}
	}
}
