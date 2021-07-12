<template>
    <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                :href="downloadHref"
                :loading="loading"
                append
                color="secondary"
                rounded
                target="_blank"
                @click="downloadFunction()"
            >
                <slot/>
                <v-icon :right="!!$slots.default">{{
                        icon || "mdi-download"
                    }}
                </v-icon>
            </v-btn>
        </template>
        <span>{{ type ? $t("item.download", {type: $tc(type)}) : "Download" }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: {
        icon: {
            type: String,
            required: false,
            default: undefined,
        },
        type: {
            type: String,
            required: false,
            default: undefined,
        },
        downloadFunction: {
            type: Function,
            required: false,
            default() {
                return () => {
                };
            },
        },
        downloadHref: {
            type: String,
            required: false,
            default: undefined,
        },
        loading: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
});
</script>
