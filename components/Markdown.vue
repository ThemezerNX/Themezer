<template>
	<div v-html="compiledMarkdown"></div>
</template>

<script>
import marked from 'marked'

export default {
	props: {
		source: { default: '', type: String }
	},
	computed: {
		compiledMarkdown() {
			return marked(this.source, { breaks: true })
		}
	}
}
</script>
