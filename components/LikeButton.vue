<template>
	<v-tooltip top>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				class="button"
				dark
				:color="newValue ? 'red' : ''"
				v-bind="attrs"
				v-on="on"
				@click="like()"
			>
				{{ newCount }}
				<v-icon right>mdi-heart</v-icon>
			</v-btn>
		</template>
		<span class="text-capitalize">{{
			newValue ? 'Unlike this' : 'I like this!'
		}}</span>
	</v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
import { setLike } from '@/graphql/Like.gql'

export default Vue.extend({
	props: {
		type: {
			type: String,
			required: true,
			default: null
		},
		id: {
			type: String,
			required: true,
			default: null
		},
		value: {
			type: Boolean,
			required: true,
			default: false
		},
		count: {
			type: Number,
			required: false,
			default: 0
		}
	},
	data() {
		return {
			newValue: this.value,
			newCount: this.count
		}
	},
	methods: {
		like() {
			this.newValue = !this.newValue
			this.newCount = this.newCount + (this.newValue ? 1 : -1)
			;(this as any).$apollo
				.mutate({
					mutation: setLike,
					variables: {
						type: this.type,
						id: this.id,
						value: this.newValue
					}
				})
				.then(() => {
					this.$auth.fetchUser()
				})
				.catch((err: Error) => {
					this.newValue = !this.newValue
					this.newCount = this.newCount + (this.newValue ? 1 : -1)
					console.error(err)
				})
		}
	}
})
</script>

<style lang="scss" scoped>
.button {
	padding-top: 2px;
	background-color: #555;
	user-select: none;
	border-radius: 100px;
}
</style>
