<template>
    <LoadingOverlay :loading="loading" :margin="false" min-loader-height="200px">
        <v-row v-if="items && items.length > 0">
            <v-col
                v-for="item in items"
                :key="item.id"
                class="pa-2"
                cols="12"
                lg="3"
                md="4"
                sm="6"
                xl="2"
                xs="12"
            >
                <ItemCard :item="item" :show-props="showProps" :type="type"/>
            </v-col>
        </v-row>
        <span v-else-if="!loading">{{ $t("noResults") }}</span>
        <nuxt-link v-if="moreUrl && items && items.length === limit" :to="moreUrl">
            <div
                class="flex-grow-1 text-right"
                style="text-shadow: 0 0 4px black;"
            >
                {{ $t("moreItems") }}
            </div>
        </nuxt-link>
    </LoadingOverlay>
</template>

<script lang="ts">
import Vue from "vue";
import targetParser from "@/components/mixins/targetParser";
import urlParser from "@/components/mixins/urlParser";

export default Vue.extend({
    components: {
        ItemCard: () => import("@/components/ItemCard.vue"),
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
            default: 12,
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
