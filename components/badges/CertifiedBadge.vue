<template>
    <v-tooltip top>
        <template #activator="{ on, attrs }">
            <v-icon
                :class="inline ? '' : 'badge'"
                class="ma-1 pa-1"
                v-bind="attrs"
                v-on="on"
            >
                mdi-certificate-outline
            </v-icon>
        </template>
        <span>{{ $t("badges.certifiedBadge") }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: {
        inline: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
});
</script>

<style lang="scss" scoped>
.badge {
    background: transparentize(#1e1e1e, 0.5);
    user-select: none;
    border-radius: 100px;
    position: absolute !important;
    right: 0;
    bottom: 0;
}
</style>

<style lang="scss">
.badges-wrapper {
    position: absolute;
    z-index: 2;
    right: 0;
    bottom: 0;
}
</style>
