<template>
    <v-layout align-center column justify-center pa-3>
        <TextCard :title="title" :subtitle="subtitle" :max-width="1000" :items="cookiePolicy"/>
    </v-layout>
</template>

<script>
import Vue from "vue";
import cookiePolicy from "~/components/mixins/cookiePolicy";
import TextCard from "~/components/TextCard.vue";

export default Vue.extend({
    components: {TextCard},
    mixins: [cookiePolicy],
    data() {
        return {
            subtitle: null,
        };
    },
    computed: {
        title() {
            return this.$t("cookiePolicy");
        }
    },
    head() {
        const metaTitle = this.title;

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
