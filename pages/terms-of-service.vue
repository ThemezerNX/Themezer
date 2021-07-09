<template>
    <v-layout align-center column justify-center pa-3>
        <TextCard :title="title" :subtitle="subtitle" :items="items"/>
    </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import items from "~/assets/lang/termsOfService";
import TextCard from "~/components/TextCard.vue";

const title = "Terms of Service";
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

        const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true })
        return {
            htmlAttrs: {
                ...i18nHead.htmlAttrs
            },
            link: [
                ...i18nHead.link
            ],
            title: metaTitle,
            meta: [
                ...i18nHead.meta,
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
