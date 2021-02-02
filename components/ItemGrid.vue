<template>
    <div>
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
        <nuxt-link v-if="moreUrl && items.length === limit" :to="moreUrl">
            <div
                class="flex-grow-1 text-right"
                style="text-shadow: 0 0 4px black;"
            >
                More items
            </div>
        </nuxt-link>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import targetParser from "@/components/mixins/targetParser";
import urlParser from "@/components/mixins/urlParser";

export default Vue.extend({
    components: {
        ItemCard: () => import("@/components/ItemCard.vue"),
    },
    mixins: [targetParser, urlParser],
    props: {
        type: {
            type: String,
            required: true,
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
            required: true,
            default: null,
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
