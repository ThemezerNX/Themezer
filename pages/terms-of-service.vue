<template>
    <PageTextSheet :items="termsOfService">
        <template #title>
            {{ $t("termsOfService") }}
        </template>
        <template #footer>
            <CopyrightBar/>
        </template>
    </PageTextSheet>
</template>

<script>
import Vue from "vue";
import termsOfService from "@/components/mixins/termsOfService";
import PageTextSheet from "@/components/page/TextSheet.vue";
import CopyrightBar from "@/components/sections/CopyrightBar";

export default Vue.extend({
    components: {CopyrightBar, PageTextSheet},
    mixins: [termsOfService],
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
