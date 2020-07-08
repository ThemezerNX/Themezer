<template>
	<v-tooltip top>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				color="primary"
				append
				rounded
				v-bind="attrs"
				:to="to"
				:loading="loading"
				v-on="on"
			>
				<v-icon>mdi-square-edit-outline</v-icon>
			</v-btn>
		</template>
		<span>Customize</span>
	</v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: {
		to: {
			type: String,
			required: false,
			default: undefined
		},
		loading: {
			type: Boolean,
			required: false,
			default: false
		}
	}
})
</script>
