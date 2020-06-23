import colors from 'vuetify/es5/util/colors'
require('dotenv').config()

export default {
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
				content: '#B40A86'
			},
			{
				name: 'msapplication-TileColor',
				content: '#B40A86'
			},
			{
				hid: 'description',
				name: 'description',
				content: process.env.npm_package_description || ''
			}
		],
		link: [{ rel: 'icon', type: 'image/jpeg', href: '/logo-256.jpg' }]
	},

	loading: { color: '#B40A86' },

	plugins: [
		// '@/plugins/mergeJson',
		// {
		// 	src: '@/plugins/meta',
		// 	mode: 'client'
		// },
		'@/plugins/linkify',
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
		'@nuxtjs/auth-next',
		'@nuxtjs/apollo',
		[
			'nuxt-rfg-icon',
			{
				masterPicture: 'static/logo-512.jpg'
			}
		],
		'@nuxtjs/pwa',
		'@nuxtjs/dotenv',
		'@nuxtjs/markdownit',
		'@nuxtjs/redirect-module',
		['cookie-universal-nuxt', { parseJSON: false }]
	],

	redirect: [
		{
			// eslint-disable-next-line
			from: '(?!^\/$|^\/[?].*$)(.*\/[?](.*)$|.*\/$)',
			to: (_from, req) => {
				const base = req._parsedUrl.pathname.replace(/\/$/, '') // We take pathname instead of req.url because of the query parameters
				const search = req._parsedUrl.search
				return base + (search != null ? search : '')
			},
			statusCode: 301
		}
	],

	markdownit: {
		injected: true
	},

	gtm: {
		id: 'GTM-T5ZBWPZ'
	},

	apollo: {
		// errorHandler: '~/plugins/apollo-error-handler.js',
		clientConfigs: {
			default: '~/plugins/apolloClient.js'
		}
	},

	pwa: {
		manifest: {
			name: 'Themezer',
			description: process.env.npm_package_description || '',
			lang: 'en',
			theme_color: '#0AB379',
			background_color: '#121212'
		}
	},

	/*
	 ** https://github.com/nuxt-community/vuetify-module
	 */
	vuetify: {
		customVariables: ['~/assets/variables.scss'],
		theme: {
			dark: true,
			themes: {
				dark: {
					primary: '#0AB379',
					accent: colors.grey.darken3,
					secondary: '#B40A86',
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent3
				}
			}
		}
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
				scheme: 'oauth2',
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

	router: {
		trailingSlash: false
	},

	build: {
		extend(config, ctx) {
			config.module.rules.push({
				test: /\/graphql\/\.(graphql|gql)$/,
				exclude: /(node_modules|server)/,
				loader: 'graphql-tag/loader'
			})

			if (ctx.isDev) {
				config.mode = 'development'
			} else if (ctx.isClient) {
				config.optimization.splitChunks.maxSize = 244000
			}
		}
	}
}
