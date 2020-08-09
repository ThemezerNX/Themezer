<template>
	<v-tooltip top>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				class="button"
				dark
				rounded
				color="red"
				v-bind="attrs"
				v-on="on"
				@click="showDialog = true"
			>
				Delete
				<v-icon right>{{ icon || 'mdi-delete' }}</v-icon>
			</v-btn>
		</template>
		<span>Delete this {{ type }}</span>
		<v-dialog v-model="showDialog" max-width="400" :persistent="loading">
			<v-card>
				<v-card-title class="headline"
					>You're at the edge of deleting this {{ type }} forever. Are
					you absolutely sure?</v-card-title
				>

				<v-card-text>
					All data related to this {{ type }} will be removed from the
					server.
				</v-card-text>

				<v-card-actions>
					<v-btn
						rounded
						:loading="loading"
						color="red"
						text
						@click="del()"
					>
						Delete
					</v-btn>
					<v-spacer></v-spacer>

					<v-btn
						rounded
						color="primary"
						text
						:disabled="loading"
						@click="showDialog = false"
					>
						Cancel
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		icon: {
			type: String,
			required: false,
			default: undefined
		},
		type: {
			type: String,
			required: true
		},
		query: {
			type: Object,
			required: true
		},
		id: {
			type: String,
			required: true
		},
		returnUrl: {
			type: String,
			required: false,
			default: '/'
		}
	},
	data() {
		return {
			showDialog: false,
			loading: false
		}
	},
	methods: {
		del() {
			this.loading = true
			;(this as any).$apollo
				.mutate({
					mutation: this.query,
					variables: {
						id: this.id
					}
				})
				.then(() => {
					this.loading = false
					this.showDialog = false
					;(this as any).$snackbar.message(
						`${this.type} deleted successfully!`
					)
					this.$router.push(this.returnUrl)
				})
				.catch((e: any) => {
					this.loading = false
					;(this as any).$snackbar.error(e)
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
