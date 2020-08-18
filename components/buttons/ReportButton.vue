<template>
	<v-menu
		v-model="showLoginDialog"
		:close-on-content-click="false"
		bottom
		right
		offset-y
	>
		<template v-slot:activator="{ attrs }">
			<v-tooltip top>
				<template v-slot:activator="{ on: tooltip }">
					<v-btn
						class="button"
						dark
						rounded
						color="red"
						:disabled="hasReported"
						v-bind="attrs"
						v-on="{ ...tooltip }"
						@click="
							$auth.loggedIn
								? (showDialog = true)
								: (showLoginDialog = false)
						"
					>
						Report
						<v-icon right>{{ icon || 'mdi-flag-variant' }}</v-icon>
					</v-btn>
					<v-dialog
						v-model="showDialog"
						max-width="600"
						:persistent="loading"
					>
						<v-card>
							<v-card-title class="headline"
								>Are you sure you want to report this
								{{ type }}?</v-card-title
							>

							<v-card-text>
								Do you believe this {{ type }} doesn't belong on
								Themezer because it shows inappropriate content?
								If so, please let us know why:
							</v-card-text>

							<v-textarea
								v-model="reason"
								class="px-6"
								rounded
								label="Reason"
								minlength="10"
								maxlength="500"
								counter="500"
								outlined
								prepend-icon="mdi-pencil-outline"
							></v-textarea>

							<v-card-actions>
								<v-btn
									rounded
									:loading="loading"
									color="red"
									text
									@click="report()"
								>
									Yes, report
								</v-btn>

								<v-spacer></v-spacer>

								<v-btn
									rounded
									color="primary"
									text
									:disabled="loading"
									@click="showDialog = false"
								>
									No, cancel
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</template>
				<span>Report this {{ type }}</span>
			</v-tooltip>
		</template>
		<v-card>
			<v-card-title>Do you want to report this {{ type }}?</v-card-title>
			<v-card-text>
				Log in to report inappropriate content
			</v-card-text>
			<v-card-actions>
				<v-btn
					rounded
					:loading="loading"
					color="red"
					text
					@click="$auth.loginWith('social')"
				>
					Login
				</v-btn>
				<v-spacer></v-spacer>
			</v-card-actions>
		</v-card>
	</v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import { reportURL } from '@/graphql/Report.gql'

export default Vue.extend({
	props: {
		icon: {
			type: String,
			required: false,
			default: undefined
		},
		type: {
			type: String,
			required: true,
			default: null
		},
		nsfw: {
			type: Boolean,
			required: true,
			default: false
		}
	},
	data() {
		return {
			showDialog: false,
			showLoginDialog: false,
			loading: false,
			hasReported: false,
			reason: null
		}
	},
	methods: {
		report() {
			this.loading = true
			;(this as any).$apollo
				.mutate({
					mutation: reportURL,
					variables: {
						url: window.location.href,
						type: this.type,
						nsfw: this.nsfw,
						reason: this.reason
					}
				})
				.then(() => {
					this.loading = false
					this.showDialog = false
					this.hasReported = true
					;(this as any).$snackbar.message('Page reported!')
				})
				.catch((err: Error) => {
					// eslint-disable-next-line no-console
					console.error(err)
					;(this as any).$snackbar.error(err)
				})
		}
	}
})
</script>

<style lang="scss" scoped>
.button {
	padding-top: 2px;
	background-color: #555;
}
</style>
