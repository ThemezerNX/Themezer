<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <v-row>
            <v-col cols="12" md="3" sm="4" xl="2" xs="12">
                <h2 class="text-center">{{ targetName() }} Packs</h2>
                <Filters
                    ref="filter"
                    :unsupported-filters="unsupportedFilters"
                />
            </v-col>
            <v-col ref="top" cols="12" md="9" sm="8" xl="10" xs="12">
                <LoadingOverlay :loading="!!$apollo.loading" :margin="false">
                    <div v-if="itemList && itemList.pagination">
                        <h3>
                            {{ itemList.pagination.item_count }}
                            {{
                                itemList.pagination.item_count === 1
                                    ? 'result'
                                    : 'results'
                            }}
                        </h3>
                        <v-divider/>
                    </div>

                    <v-row
                        v-if="
							itemList &&
								itemList.packList &&
								itemList.packList.length > 0
						"
                    >
                        <v-col
                            v-for="pack in itemList.packList"
                            :key="pack.id"
                            cols="12"
                            md="4"
                            sm="6"
                            xl="3"
                            xs="12"
                        >
                            <ItemCard
                                :item="pack"
                                :show-props="['creator', 'description']"
                                type="packs"
                            />
                        </v-col>
                    </v-row>

                    <span v-else-if="!$apollo.loading"
                    >There were no results</span
                    >
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
import {allCreators, allLayouts, packList} from '@/graphql/Pack.gql'
import targetParser from '@/components/mixins/targetParser'
import filter from '@/components/mixins/filter'

export default Vue.extend({
    components: {
        Filters: () => import('@/components/Filters.vue'),
        ItemCard: () => import('@/components/ItemCard.vue'),
        LoadingOverlay: () => import('@/components/LoadingOverlay.vue')
    },
    mixins: [targetParser, filter],
    data() {
        return {
            type: 'packs',
            list: 'packList',
            unsupportedFilters: [],
            allCreatorsQuery: allCreators,
            allLayoutsQuery: allLayouts,
            nsfw: false
        }
    },
    apollo: {
        itemList: {
            query: packList,
            fetchPolicy: 'cache-and-network',
            variables() {
                const vars = {
                    q: 'packList',
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
            resultAmount !== undefined
                ? `${resultAmount} ${
                    resultAmount === 1 ? 'result' : 'results'
                } | Packs`
                : `Packs`

        const metaDesc = 'Discover amazing theme packs to give every menu a similar look!'

        const metaImg = null

        return {
            title: metaTitle,
            meta: [
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
