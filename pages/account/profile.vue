<template>
	<div />
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
	middleware: ['auth'],
	options: {
		auth: true
	}
})
</script>
