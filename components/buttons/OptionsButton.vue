<template>
    <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                :loading="loading"
                :to="to"
                append
                color="primary"
                rounded
            >
                {{ $t("item.customize") }}
                <v-icon right>{{ icon || "mdi-square-edit-outline" }}</v-icon>
            </v-btn>
        </template>
        <span>{{ label }}</span>
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
        label: {
            type: String,
            required: true,
        },
        to: {
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
