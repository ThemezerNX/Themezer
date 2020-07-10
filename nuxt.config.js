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
		]
	},

	loading: { color: '#B40A86' },

	plugins: [
		'@/plugins/linkify',
		'@/plugins/snackbar',
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
		}
	},

	pwa: {
		manifest: {
			name: 'Themezer',
			short_name: 'Themezer',
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

	components: true,

	router: {
		trailingSlash: false
	},

	build: {
		transpile: ['@nuxtjs/auth-next'],
		extractCSS: process.env.NODE_ENV === 'production',
		parallel: true,
		extend(config, ctx) {
			if (ctx.isDev) {
				config.mode = 'development'
			} else if (ctx.isClient) {
				config.optimization.splitChunks.maxSize = 244000
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
