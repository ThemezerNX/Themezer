<template>
	<v-tooltip top>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				class="button"
				dark
				rounded
				color="blue darken-1"
				v-bind="attrs"
				to="edit"
				append
				v-on="on"
			>
				Edit
				<v-icon right>{{ icon || 'mdi-shield-edit' }}</v-icon>
			</v-btn>
		</template>
		<span>Edit this {{ type }}</span>
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
			required: true,
			default: null
		},
		creatorId: {
			type: String,
			required: true,
			default: null
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
