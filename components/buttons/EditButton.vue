<template>
    <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                append
                class="button"
                color="blue darken-1"
                dark
                rounded
                to="edit"
            >
                {{ $t("item.edit") }}
                <v-icon right>{{ icon || "mdi-shield-edit" }}</v-icon>
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
            default: null,
        },
    },
});
</script>

<style lang="scss" scoped>
.button {
    padding-top: 2px;
    background-color: #555;
}
</style>
