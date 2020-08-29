<template>
	<v-flex class="button-divider d-flex justify-center my-2">
		<v-divider
			v-if="!hideDividers"
			:class="{
				'my-auto': !!$slots.default,
				'my-2': !$slots.default,
				'mx-2': margin,
				'mr-2': !margin
			}"
		/>
		<div class="button-parent">
			<slot />
		</div>
		<v-divider
			v-if="!hideDividers && !!$slots.default"
			:class="{
				'my-auto': !!$slots.default,
				'my-2': !$slots.default,
				'mx-2': margin,
				'ml-2': !margin
			}"
		/>
	</v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: {
		hideDividers: {
			type: Boolean,
			required: false,
			default: false
		},
		margin: {
			type: Boolean,
			required: false,
			default: true
		}
	}
})
</script>

<style lang="scss">
.button-divider .button-parent {
	text-align: center;
	.v-btn {
		margin: 3px 3px;
	}
}
</style>
