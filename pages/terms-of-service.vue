<template>
    <v-layout align-center column justify-center pa-3>
        <TextCard :title="title" :subtitle="subtitle" :items="items"/>
    </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import items from "~/assets/lang/termsOfService";
import TextCard from "~/components/TextCard";

export default Vue.extend({
    components: {TextCard},
    data() {
        return {
            title: "Terms of Service",
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
