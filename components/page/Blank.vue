<template>
    <v-layout
        :align-center="centerContentVertical"
        :justify-center="centerContentHorizontal"
        :fill-height="fillHeight || centerContentVertical"
        :pa-3="!noGutters"
        :pa-10="largerGutters && !$vuetify.breakpoint.smAndDown"
    >
        <slot/>
    </v-layout>
</template>

<script>
export default {
    name: "PageBlank",
    props: {
        fillHeight: {
            type: Boolean,
            default: false,
        },
        centerContentHorizontal: {
            type: Boolean,
            default: true,
        },
        centerContentVertical: {
            type: Boolean,
            default: false,
        },
        noGutters: {
            type: Boolean,
            default: false,
        },
        largerGutters: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
