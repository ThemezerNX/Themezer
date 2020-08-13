<template>
	<v-layout column justify-center align-center pa-3>
		<v-card max-width="600" style="border-radius: 10px;">
			<v-card-title class="headline">
				About
			</v-card-title>
			<v-card-text>
				<p>
					Themezer is a site for Nintendo Switch themes and layouts
					for themes. Source Code for the Website and API are
					available on the
					<a
						href="https://github.com/ThemezerNX"
						target="_blank"
						title="discord"
						>ThemezerNX GitHub page</a
					>.
				</p>
				<p>
					If you have any questions, please join the
					<a
						href="https://discord.gg/VBa3bjp"
						target="_blank"
						title="discord"
						>Discord server</a
					>.
				</p>
				<p>
					Found a bug or have a suggestion?
					<a
						href="https://github.com/ThemezerNX/Themezer/issues"
						target="_blank"
						title="contribute"
						>Create an issue on GitHub</a
					>.
				</p>
				<div>
					What does the
					<CertifiedBadge inline /> badge mean? It means that the
					layout used in the theme was downloaded from Themezer and is
					automatically updated when downloading.
				</div>
				<p class="mt-4">
					Need to restore your Themezer account?
					<v-btn
						rounded
						text
						color="primary"
						@click="restoreDialog = true"
						>Open the dialog</v-btn
					>
				</p>
				<hr class="mb-2" />
			</v-card-text>
		</v-card>
		<v-dialog v-model="restoreDialog" max-width="800" class="mx-auto">
			<v-card>
				<v-card-title
					class="title font-weight-regular justify-space-between"
				>
					<span>Restore Account</span>
					<v-spacer></v-spacer>

					<v-btn rounded icon @click="restoreDialog = false">
						<v-icon>
							mdi-close
						</v-icon>
					</v-btn>
				</v-card-title>

				<v-card-text>
					Back when you created your Themezer account, you were
					informed of a backup code you could use if you ever lost
					access to your Discord account. You can use it here to
					regain access to your Themezer account. The Discord account
					you are currently logged in with will be linked to your
					previous Themezer data. Make sure to update your layouts
					with your new creator ID afterwards!
					<v-form v-model="restoreValid">
						<v-text-field
							v-model="creatorId"
							rounded
							class="mt-5"
							:disabled="!$auth.loggedIn"
							label="Previous Creator ID"
							:error-messages="
								!$auth.loggedIn
									? ['You have to be logged in first']
									: []
							"
							outlined
							:rules="[
								rules.required,
								rules.creatorId,
								rules.notOwnCreatorId
							]"
							prepend-icon="mdi-identifier"
						></v-text-field>
						<v-text-field
							v-model="backupCode"
							rounded
							:disabled="!$auth.loggedIn"
							label="Backup Code"
							:error-messages="
								!$auth.loggedIn
									? ['You have to be logged in first']
									: []
							"
							outlined
							:rules="[rules.required]"
							prepend-icon="mdi-key-variant"
							:type="showBackupCode ? 'text' : 'password'"
							:append-icon="
								showBackupCode ? 'mdi-eye-off' : 'mdi-eye'
							"
							@click:append="
								() => (showBackupCode = !showBackupCode)
							"
						></v-text-field>
						<v-flex class="d-flex">
							<v-spacer />
							<v-btn
								rounded
								:disabled="!restoreValid"
								color="secondary"
								:loading="loading.restore"
								@click.prevent="restore()"
							>
								Restore
								<v-icon right>mdi-backup-restore</v-icon>
							</v-btn>
						</v-flex>
					</v-form>
				</v-card-text>
			</v-card>
		</v-dialog>
	</v-layout>
</template>

<script>
import Vue from 'vue'
import { restoreAccount } from '@/graphql/Creator.gql'

export default Vue.extend({
	components: {
		CertifiedBadge: () => import('@/components/badges/CertifiedBadge.vue')
	},
	data() {
		return {
			restoreDialog: false,
			restoreValid: false,
			showBackupCode: false,
			creatorId: null,
			backupCode: null,
			rules: {
				required: (value) => !!value || 'Required',
				creatorId: (value) =>
					!value || (!isNaN(value) ? true : 'Invalid ID'),
				notOwnCreatorId: (value) =>
					!value ||
					(!(this.$auth.user.id === value)
						? true
						: 'This is your current ID')
			},
			loading: {
				restore: false
			}
		}
	},
	methods: {
		restore() {
			this.loading.restore = true
			this.$apollo
				.mutate({
					mutation: restoreAccount,
					variables: {
						creator_id: this.creatorId,
						backup_code: this.backupCode
					}
				})
				.then(({ data }) => {
					this.loading.restore = false
					if (data.restoreAccount) {
						this.$snackbar.message('Restored successfully!')
					} else {
						this.$snackbar.error(
							new Error('Creator ID or Backup Code invalid!')
						)
					}
				})
				.catch((err) => {
					this.$snackbar.error(err)
					this.loading.accept = false
				})
		}
	}
})
</script>
