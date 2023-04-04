<template>
    <PageTargetPicker :type="type" />
</template>

<script>
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            type: "themes",
        };
    },
    head() {
        return this.$createHead(this.$nuxtI18nHead, {
            title: this.$tc("theme", 2),
            description: this.$tc("themes.pageDescription"),
        });
    },
});
</script>
