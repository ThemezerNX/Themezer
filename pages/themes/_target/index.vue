<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <v-row class="fill-height">
            <v-col cols="12" md="3" sm="4" xl="2" xs="12">
                <h2 class="text-center"><v-icon style="vertical-align: baseline;" left v-text="targetIcon(target())"></v-icon>{{ $tc("theme", 2) }}</h2>
                <Filters
                    ref="filter"
                    :unsupported-filters="unsupportedFilters"
                />
            </v-col>
            <v-col ref="top" cols="12" md="9" sm="8" xl="10" xs="12">
                <LoadingOverlay :loading="!!$apollo.loading" :margin="false" min-loader-height="auto">
                    <div v-if="itemList && itemList.pagination">
                        <h3>
                            {{ $tc("resultCount", itemList.pagination.item_count) }}
                        </h3>
                        <v-divider/>
                    </div>

                    <v-row
                        v-if="itemList && itemList.themeList && itemList.themeList.length > 0"
                    >
                        <v-col
                            v-for="theme in itemList.themeList"
                            :key="theme.id"
                            cols="12"
                            md="4"
                            sm="6"
                            xl="3"
                            xs="12"
                        >
                            <ItemCard
                                :item="theme"
                                :show-props="['creator', 'description']"
                                :type="type"
                            />
                        </v-col>
                    </v-row>

                    <span v-else-if="!$apollo.loading">{{ $t("noResults") }}</span>
                    <paginate
                        v-model="pageNumber"
                        :click-handler="paginationEvent"
                        :no-li-surround="true"
                        :page-count="pageCount"
                        :page-range="5"
                        break-view-link-class="hidden"
                        container-class="pagination-container"
                        next-text
                        page-class="page-item"
                        page-link-class="button--pagination"
                        prev-text
                    >
                        <span slot="breakViewContent"></span>
                    </paginate>
                </LoadingOverlay>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Vue from 'vue'
import {allCreators, allLayouts, themeList} from '@/graphql/Theme.gql'
import targetParser from '@/components/mixins/targetParser'
import filter from '@/components/mixins/filter'
import allowedTargets from '@/components/mixins/allowedTargets'
import {targetIcon} from "@/assets/targets";

export default Vue.extend({
    beforeRouteEnter(to, _from, next) {
        if (allowedTargets.includes(to.params.target)) {
            next()
        } else {
            next('/')
        }
    },
    components: {
        Filters: () => import('@/components/Filters.vue'),
        ItemCard: () => import('@/components/ItemCard.vue'),
        LoadingOverlay: () => import('@/components/LoadingOverlay.vue')
    },
    mixins: [targetParser, filter],
    methods: {
        targetIcon,
    },
    data() {
        return {
            type: 'themes',
            list: 'themeList',
            unsupportedFilters: [],
            allCreatorsQuery: allCreators,
            allLayoutsQuery: allLayouts,
            nsfw: false
        }
    },
    apollo: {
        itemList: {
            query: themeList,
            fetchPolicy: 'cache-and-network',
            variables() {
                const vars = {
                    q: 'themeList',
                    target: this.targetFile(),
                    limit: 16,
                    page: this.currentPage,
                    query: this.currentSearch,
                    sort: this.currentSort,
                    order: this.currentOrder,
                    creators: this.currentCreators,
                    layouts: this.currentLayouts,
                    nsfw: this.nsfw
                }
                vars.hash = this.$hashString(vars)
                return vars
            },
            update(data) {
                return data
            },
            prefetch: true
        }
    },
    head() {
        // eslint-disable-next-line camelcase
        const resultAmount = this.itemList?.pagination?.item_count

        const metaTitle =
            (resultAmount !== undefined
                ? `${this.$tc("resultCount", resultAmount)} | `
                : "")
            + `${this.targetName()} | ${this.$tc("theme", 2)}`;
        const metaDesc = this.$t("themes.targetPageDescription", {menu: this.targetName()});
        const metaImg = null;

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
                    hid: 'description',
                    name: 'description',
                    content: metaDesc
                },
                {
                    hid: 'og:title',
                    name: 'og:title',
                    property: 'og:title',
                    content: metaTitle
                },
                {
                    hid: 'og:description',
                    name: 'og:description',
                    property: 'og:description',
                    content: metaDesc
                },
                {
                    hid: 'og:image',
                    name: 'og:image',
                    property: 'og:image',
                    content: metaImg
                }
            ]
        }
    }
})
</script>

<style lang="scss">
@import 'assets/paginate.scss';
</style>
