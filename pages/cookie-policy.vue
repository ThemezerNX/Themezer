<template>
    <v-layout align-center column justify-center pa-3>
        <TextCard :title="title" :subtitle="subtitle" :max-width="1000" :items="items"/>
    </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import items from "~/assets/lang/cookiePolicy";
import TextCard from "~/components/TextCard";

export default Vue.extend({
    components: {TextCard},
    data() {
        return {
            title: "Cookie Policy",
            subtitle: null,
            items,
        };
    },
    head() {
        const metaTitle = this.title;

        return {
            title: metaTitle,
            meta: [
                {
                    hid: "og:title",
                    name: "og:title",
                    property: "og:title",
                    content: metaTitle,
                },
            ],
        };
    },
});
</script>
