import Vue from 'vue'
import Snackbar from './Snackbar.vue'

export default (context: any, inject: any) => {
	const storeModule = {
		namespaced: true,
		state: () => ({
			message: 'Gaming week',
			error: null
		}),
		mutations: {
			SET_MESSAGE(state: any, message: string) {
				state.message = message
			},
			SET_ERROR(state: any, error: string) {
				state.error = error
			}
		}
	}

	context.store.registerModule('snackbar', storeModule)

	const $snackbar = {
		message(message: string) {
			context.store.commit('snackbar/SET_MESSAGE', message)

			setTimeout(() => {
				context.store.commit('snackbar/SET_MESSAGE', null)
			}, 8100)
		},
		error(error: Error) {
			// eslint-disable-next-line no-console
			console.error(error)

			context.store.commit(
				'snackbar/SET_ERROR',
				error.message.replace('GraphQL error: ', '') || 'Unknown Error'
			)

			setTimeout(() => {
				context.store.commit('snackbar/SET_ERROR', null)
			}, 8100)
		}
	}

	inject('snackbar', $snackbar)
	context.$snackbar = $snackbar

	Vue.component('Snackbar', Snackbar)
}