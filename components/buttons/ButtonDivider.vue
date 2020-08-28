<template>
	<v-flex class="button-divider d-flex justify-center my-2">
		<v-divider
			v-if="!hideDividers"
			class="mx-2"
			:class="!!$slots.default ? 'my-auto' : 'my-2'"
		/>
		<div class="button-parent">
			<slot />
		</div>
		<v-divider
			v-if="!hideDividers && !!$slots.default"
			class="mx-2"
			:class="!!$slots.default ? 'my-auto' : 'my-2'"
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
