<template>
    <PageResultsList
        :items="themes ? themes.nodes : []"
        :target="target"
        :loading="$apollo.loading"
        :pageInfo="themes ? themes.pageInfo : null"
    >

    </PageResultsList>
</template>

<script lang="ts">
import Vue from "vue";
import allowedTargets from "@/components/mixins/allowedTargets";
import {targetIcon} from "@/assets/targets";
import PageBlank from "@/components/page/Blank.vue";
import {THEMES_QUERY} from "@/graphql/themes/themes";
import PageResultsList from "@/components/page/ResultsList.vue";

export default Vue.extend({
    components: {PageResultsList, PageBlank},
    beforeRouteEnter(to, _from, next) {
        if (allowedTargets.includes(to.params.target)) {
            next();
        } else {
            next("/");
        }
    },
    methods: {
        targetIcon,

    },
    data() {
        return {
            target: this.$route.params.target,
            type: "themes",
            variables: {
                query: "",
                creators: [],
                layouts: [],
                includeNSFW: false,
                looseOnly: false,
                order: "DESC",
                orderBy: "DOWNLOADS",
                limit: 16,
                page: 1,
            },
            themes: null,
        };
    },
    computed: {
        title() {
            const resultAmount = this.$data.themes?.pageInfo.itemCount;
            return (this.$data.themes?.pageInfo ? `${this.$tc("resultCount", resultAmount)} | ` : "") + `${this.$targetParser.toNice(this.target)} | ${this.$tc("theme", 2)}`;
        }
    },
    apollo: {
        themes: {
            query: THEMES_QUERY,
            fetchPolicy: "cache-and-network",
            variables() {
                return this.$data.variables;
            },
            prefetch: true,
        },
    },
    head() {
        const metaDesc = this.$t("themes.targetPageDescription", {menu: this.$targetParser.toNice(this.target)});

        const i18nHead = this.$nuxtI18nHead({addSeoAttributes: true});
        return {
            htmlAttrs: {
                ...i18nHead.htmlAttrs,
            },
            link: [
                ...i18nHead.link,
            ],
            title: this.title,
            meta: [
                ...i18nHead.meta,
                {
                    hid: "description",
                    name: "description",
                    content: metaDesc,
                },
                {
                    hid: "og:title",
                    name: "og:title",
                    property: "og:title",
                    content: this.title,
                },
                {
                    hid: "og:description",
                    name: "og:description",
                    property: "og:description",
                    content: metaDesc,
                },
            ],
        };
    },
});
</script>
