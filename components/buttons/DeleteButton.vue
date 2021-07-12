<template>
    <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                class="button"
                color="red"
                dark
                rounded
                @click="showDialog = true"
            >
                {{ $t("item.delete") }}
                <v-icon right>{{ icon || 'mdi-delete' }}</v-icon>
            </v-btn>
            <v-dialog
                v-model="showDialog"
                :persistent="loading"
                max-width="400"
            >
                <v-card>
                    <v-card-title class="headline">
                        {{ $t("item.deleteConfirm", {type: $tc(type)}) }}
                    </v-card-title>

                    <v-card-text>
                        {{ $t("item.deleteDescription", {type: $tc(type)}) }}
                    </v-card-text>

                    <v-card-actions>
                        <v-btn
                            :loading="loading"
                            color="red"
                            rounded
                            text
                            @click="del()"
                        >
                            {{ $t("item.delete") }}
                        </v-btn>
                        <v-spacer></v-spacer>

                        <v-btn
                            :disabled="loading"
                            color="primary"
                            rounded
                            text
                            @click="showDialog = false"
                        >
                            {{ $t("cancel") }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
        <span>{{ $t("item.deleteThis", {type: $tc(type)}) }}</span>
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
            required: true,
        },
        query: {
            type: Object,
            required: true,
        },
        id: {
            type: String,
            required: true,
        },
        goBack: {
            type: Boolean,
            required: false,
            default: false,
        },
        returnUrl: {
            type: String,
            required: false,
            default: "/",
        },
    },
    data() {
        return {
            showDialog: false,
            loading: false,
        };
    },
    methods: {
        del() {
            this.loading = true
            ;(this as any).$apollo
                .mutate({
                    mutation: this.query,
                    variables: {
                        id: this.id,
                    },
                })
                .then((res: any) => {
                    this.loading = false;
                    this.showDialog = false
                    ;(this as any).$snackbar.message(
                        this.$t("item.deleteSuccess", {type: this.$tc(this.type)})
                    );

                    if (this.goBack && !res?.data?.deleteTheme) {
                        this.$router.back();
                    } else {
                        this.$router.push(
                            res?.data?.deleteTheme || this.returnUrl,
                        );
                    }
                })
                .catch((err: any) => {
                    this.loading = false
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
