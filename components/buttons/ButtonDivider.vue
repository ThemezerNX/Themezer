<template>
	<v-flex class="button-divider d-flex justify-center my-2">
		<v-divider
			v-if="!hideDividers"
			class="mx-3"
			:class="!!this.$slots.default ? 'my-auto' : ''"
		/>
		<div>
			<slot />
		</div>
		<v-divider
			v-if="!hideDividers && !!this.$slots.default"
			class="mx-3 my-auto"
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
.button-divider {
	.v-btn {
		margin: auto 6px;
	}
}
</style>
