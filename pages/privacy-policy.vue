<template>
    <v-layout align-center column justify-center pa-3>
        <TextCard :title="title" :subtitle="subtitle" :max-width="1000" :items="items"/>
    </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import items from "~/assets/lang/privacyPolicy";
import TextCard from "~/components/TextCard.vue";

const title = "Privacy Policy";
export default Vue.extend({
    components: {TextCard},
    data() {
        return {
            title,
            subtitle: null,
            items,
        };
    },
    head() {
        const metaTitle = title;

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
