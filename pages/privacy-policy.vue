<template>
    <PageTextSheet :items="privacyPolicy">
        <template #title>
            {{ $t("privacyPolicy") }}
        </template>
        <template #footer>
            <CopyrightBar/>
        </template>
    </PageTextSheet>
</template>

<script>
import Vue from "vue";
import privacyPolicy from "@/components/mixins/privacyPolicy";
import PageTextSheet from "@/components/page/TextSheet.vue";
import CopyrightBar from "@/components/sections/CopyrightBar";

export default Vue.extend({
    components: {CopyrightBar, PageTextSheet},
    mixins: [privacyPolicy],
    head() {
        const metaTitle = this.title;

        const i18nHead = this.$nuxtI18nHead({addSeoAttributes: true});
        return {
            htmlAttrs: {
                ...i18nHead.htmlAttrs,
            },
            link: [
                ...i18nHead.link,
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
