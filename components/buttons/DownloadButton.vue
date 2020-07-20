<template>
	<v-tooltip top>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				color="secondary"
				append
				rounded
				target="_blank"
				v-bind="attrs"
				:loading="loading"
				:href="downloadHref"
				v-on="on"
				@click="downloadFunction()"
			>
				<v-icon>{{ icon || 'mdi-download' }}</v-icon>
			</v-btn>
		</template>
		<span>{{ tooltip || 'Download' }}</span>
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
		tooltip: {
			type: String,
			required: false,
			default: undefined
		},
		downloadFunction: {
			type: Function,
			required: false,
			default() {
				return () => {}
			}
		},
		downloadHref: {
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
