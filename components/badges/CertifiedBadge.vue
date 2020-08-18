<template>
	<v-tooltip top>
		<template v-slot:activator="{ on, attrs }">
			<v-icon
				class="ma-1 pa-1"
				:class="inline ? '' : 'badge'"
				v-bind="attrs"
				v-on="on"
				>mdi-certificate-outline</v-icon
			>
		</template>
		<span>Automatically updated</span>
	</v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: {
		inline: {
			type: Boolean,
			required: false,
			default: false
		}
	}
})
</script>

<style lang="scss" scoped>
.badge {
	background: transparentize(#1e1e1e, 0.5);
	user-select: none;
	border-radius: 100px;
	position: absolute !important;
	right: 0;
	top: 0;
}
</style>

<style lang="scss">
.badges-wrapper {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 2;
}
</style>
