<template>
    <v-tooltip top>
        <template #activator="{ on, attrs }">
            <v-btn
                :loading="loading"
                :to="to"
                append
                color="primary"
                rounded
                v-bind="attrs"
                v-on="on"
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
