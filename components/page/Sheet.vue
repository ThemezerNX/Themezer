<template>
    <PageBlank
        :center-content-certical="centerContentVertical"
        :center-content-horizontal="centerContentHorizontal"
        :fill-height="fillHeight"
        :no-gutters="noGutters"
    >
        <v-card
            :elevation="elevation"
            outlined
            :max-width="maxWidth"
        >
            <v-card-title v-if="$slots.title" class="text-h4 font-weight-bold">
                <slot name="title"/>
            </v-card-title>
            <v-card-text v-if="$slots.description">
                <slot name="description"/>
            </v-card-text>

            <v-card-text v-if="$slots.content" class="pt-0">
                <slot name="content"/>
            </v-card-text>

            <v-card-actions
                v-if="$slots.footer || $slots['footer-centered']"
                class="pa-4 pt-0 text-caption"
                :class="{'justify-center': $slots['footer-centered']}"
            >
                <slot name="footer"/>
                <slot name="footer-centered"/>
            </v-card-actions>
        </v-card>
    </PageBlank>
</template>

<script>
import PageBlank from "@/components/page/Blank";
export default {
    name: "PageSheet",
    components: {PageBlank},
    props: {
        elevation: {
            type: [Number, String],
            default: 10,
        },
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
        maxWidth: {
            type: [Number, String],
            default: "auto",
        },
    },
};
</script>
