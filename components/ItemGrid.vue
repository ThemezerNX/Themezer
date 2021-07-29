<template>
    <LoadingOverlay :loading="loading" :margin="false" min-loader-height="200px">
        <v-row v-if="items && items.length > 0">
            <v-col
                v-for="(item, i) in items"
                :key="item.id"
                class="pa-3"
                cols="12"
                lg="3"
                md="4"
                sm="6"
                xs="12"
            >
                <MoreCard
                    v-if="
                        i === items.length - 1 &&
                        items.length === limit &&
                        moreUrl
                    "
                    :to="moreUrl"
                >
                    <template #title>
                        {{ $t("moreItems") }}
                    </template>
                    <template #subtitle>
                        <slot name="moreButtonSubtitle"/>
                    </template>
                </MoreCard>
                <ItemCard v-else :item="item" :show-props="showProps" :type="type"/>
            </v-col>
        </v-row>
        <span v-else-if="!loading">{{ $t("noResults") }}</span>
    </LoadingOverlay>
</template>

<script lang="ts">
import Vue from "vue";
import targetParser from "@/components/mixins/targetParser";
import urlParser from "@/components/mixins/urlParser";

export default Vue.extend({
    components: {
        ItemCard: () => import("@/components/ItemCard.vue"),
        MoreCard: () => import("@/components/MoreCard.vue"),
        LoadingOverlay: () => import("@/components/LoadingOverlay.vue"),
    },
    mixins: [targetParser, urlParser],
    props: {
        type: {
            type: String,
            required: true,
        },
        loading: {
            type: Boolean,
            required: false,
            default: true,
        },
        moreUrl: {
            type: String,
            required: false,
            default: null,
        },
        limit: {
            type: Number,
            required: false,
            default: 8,
        },
        items: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },
        showProps: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },
    },
});
</script>
