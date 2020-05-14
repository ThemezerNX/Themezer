import colors from 'vuetify/es5/util/colors'
require('dotenv').config()

export default {
	env: {
		APP_TITLE: 'Themezer'
	},
	mode: 'universal',
	/*
	 ** Headers of the page
	 */
	head: {
		titleTemplate: '%s - ' + 'Themezer',
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
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
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
	plugins: [],
	/*
	 ** Nuxt.js dev-modules
	 */
	buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],
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
				masterPicture: 'static/icon.png'
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

	apollo: {
		// // optional
		// watchLoading: '~/plugins/apollo-watch-loading-handler.js',
		// // optional
		// errorHandler: '~/plugins/apollo-error-handler.js',
		clientConfigs: {
			default: {
				httpEndpoint: process.env.API_ENDPOINT
			}
		}
	},

	pwa: {
		manifest: {
			name: 'Themezer',
			description: process.env.npm_package_description,
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
					primary: colors.blue.darken2,
					accent: colors.grey.darken3,
					secondary: colors.amber.darken3,
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
			if (ctx.isDev) {
				config.mode = 'development'
			} else if (ctx.isClient) {
				config.optimization.splitChunks.maxSize = 400000
			}
		}
	}
}
