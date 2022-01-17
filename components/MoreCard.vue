<template>
    <v-hover v-slot:default="{ hover }">
        <v-card
            :class="{ 'on-hover': hover }"
            :elevation="hover ? 2 : 12"
            :to="to"
            class="card d-flex align-center transition-ease"
            router
        >
            <div v-if="!!$slots.title" class="display-2 flex-grow-1 text-center ma-4">
                <v-icon size="60">mdi-arrow-right-bold-outline</v-icon>
                <h6 style="position: relative;">
                    <slot name="title"/>
                </h6>
                <span class="subtitle-1 mt-0">
                    <slot name="subtitle"/>
                </span>
            </div>
        </v-card>
    </v-hover>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    components: {
        CertifiedBadge: () => import("~/components/badges/CertifiedBadge.vue"),
    },
    props: {
        to: {
            type: String,
            default: null,
            required: false,
        },
    },
});
</script>

<style lang="scss" scoped>
@import 'assets/card.scss';
</style>
