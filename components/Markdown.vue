<template>
    <div v-html="compiledMarkdown"></div>
</template>

<script lang="ts">
import Vue from "vue";

const marked = require("marked");

export default Vue.extend({
    props: {
        source: {default: "", type: String},
    },
    computed: {
        compiledMarkdown() {
            return marked(this.source, {breaks: true});
        },
    },
});
</script>
