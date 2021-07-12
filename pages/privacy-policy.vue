<template>
    <v-layout align-center column justify-center pa-3>
        <TextCard :title="title" :subtitle="subtitle" :max-width="1000" :items="privacyPolicy"/>
    </v-layout>
</template>

<script>
import Vue from "vue";
import privacyPolicy from "~/components/mixins/privacyPolicy";
import TextCard from "~/components/TextCard.vue";

export default Vue.extend({
    components: {TextCard},
    mixins: [privacyPolicy],
    data() {
        return {
            title: this.$t("privacyPolicy"),
            subtitle: null,
        };
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
