<template>
    <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                :color="newValue ? 'red' : ''"
                :disabled="!$auth.isAuthenticated"
                class="button"
                dark
                rounded
                v-bind="attrs"
                @click="like()"
                v-on="on"
            >
                {{ newCount }}
                <v-icon right>{{ icon || "mdi-heart" }}</v-icon>
            </v-btn>
        </template>
        <span>{{ newValue ? $t("item.unlike") : $t("item.like") }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";
import {setLike} from "~/graphql/Like.gql";

export default Vue.extend({
    props: {
        icon: {
            type: String,
            required: false,
            default: undefined,
        },
        type: {
            type: String,
            required: true,
            default: null,
        },
        id: {
            type: String,
            required: true,
            default: null,
        },
        value: {
            type: Boolean,
            required: true,
            default: false,
        },
        count: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    data() {
        return {
            newValue: this.value,
            newCount: this.count,
        };
    },
    methods: {
        like() {
            this.newValue = !this.newValue;
            this.newCount = this.newCount + (this.newValue ? 1 : -1)
            ;(this as any).$apollo
                .mutate({
                    mutation: setLike,
                    variables: {
                        type: this.type,
                        id: this.id,
                        value: this.newValue,
                    },
                })
                .then(() => {
                    this.$auth.fetchUser();
                })
                .catch((err: Error) => {
                    this.newValue = !this.newValue;
                    this.newCount = this.newCount + (this.newValue ? 1 : -1);
                    // eslint-disable-next-line no-console
                    console.error(err)
                    ;(this as any).$snackbar.error(err);
                });
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
