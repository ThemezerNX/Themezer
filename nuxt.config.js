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
	/*
	 ** Headers of the page
	 */
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
				content: '#d50000'
			},
			{
				name: 'msapplication-TileColor',
				content: '#d50000'
			},
			{
				hid: 'description',
				name: 'description',
				content: process.env.npm_package_description || ''
			}
		],
		link: [{ rel: 'icon', type: 'image/jpeg', href: '/logo-256.jpg' }]
	},
	/*
	 ** Customize the progress-bar color
	 */
	loading: { color: '#fff' },
	/*
	 ** Global CSS
	 */
	css: [],
	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: [
		// '@/plugins/mergeJson',
		{
			src: '@/plugins/meta',
			mode: 'client'
		},
		{
			src: '@/plugins/pagination',
			mode: 'client'
		},
		{
			src: '@/plugins/downloadFile',
			mode: 'client'
		}
	],
	/*
	 ** Nuxt.js dev-modules
	 */
	buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify', '@nuxtjs/gtm'],
	/*
	 ** Nuxt.js modules
	 */
	modules: [
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios',
		'@nuxtjs/apollo',
		[
			'nuxt-rfg-icon',
			{
				masterPicture: 'static/logo-512.jpg'
			}
		],
		'@nuxtjs/pwa',
		// Doc: https://github.com/nuxt-community/dotenv-module
		'@nuxtjs/dotenv'
	],
	/*
	 ** Axios module configuration
	 ** See https://axios.nuxtjs.org/options
	 */
	axios: {},
	gtm: {
		id: 'GTM-T5ZBWPZ'
	},
	apollo: {
		// // optional
		// watchLoading: '~/plugins/apollo-watch-loading-handler.js',
		// // optional
		// errorHandler: '~/plugins/apollo-error-handler.js',
		clientConfigs: {
			default: {
				httpEndpoint: process.env.API_ENDPOINT,
				inMemoryCacheOptions: {
					addTypename: false
				}
			}
		}
	},

	pwa: {
		manifest: {
			name: 'Themezer',
			description: process.env.npm_package_description || '',
			lang: 'en',
			theme_color: '#d50000',
			background_color: '#121212'
		}
	},

	/*
	 ** vuetify module configuration
	 ** https://github.com/nuxt-community/vuetify-module
	 */
	vuetify: {
		customVariables: ['~/assets/variables.scss'],
		theme: {
			dark: true,
			themes: {
				dark: {
					primary: '#B40A86',
					accent: colors.grey.darken3,
					secondary: '#0AB379',
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent3
				}
			}
		}
	},
	/*
	 ** Build configuration
	 */
	build: {
		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) {
			config.module.rules.push({
				test: /\/graphql\/\.(graphql|gql)$/,
				exclude: /(node_modules|server)/,
				loader: 'graphql-tag/loader'
			})

			if (ctx.isDev) {
				config.mode = 'development'
			} else if (ctx.isClient) {
				config.optimization.splitChunks.maxSize = 249856
			}
		}
	}
}
