<template>
    <v-menu
        v-model="showLoginDialog"
        :close-on-content-click="false"
        bottom
        offset-y
        right
    >
        <template v-slot:activator="{ attrs }">
            <v-tooltip top>
                <template v-slot:activator="{ on: tooltip }">
                    <v-btn
                        v-bind="attrs"
                        v-on="{ ...tooltip }"
                        :disabled="hasReported"
                        class="button"
                        color="red"
                        dark
                        rounded
                        @click="
                          $auth.loggedIn
                            ? (showDialog = true)
                            : (showLoginDialog = true)
                        "
                    >
                        Report
                        <v-icon right>{{ icon || "mdi-flag-variant" }}</v-icon>
                    </v-btn>
                    <v-dialog
                        v-model="showDialog"
                        :persistent="loading"
                        max-width="600"
                    >
                        <v-card>
                            <v-card-title class="headline">
                                {{ $t("item.reportConfirm") }}
                            </v-card-title>

                            <v-card-text>
                                {{ $t("item.reportDescription") }}
                            </v-card-text>

                            <v-textarea
                                v-model="reason"
                                class="px-6"
                                counter="500"
                                label="Reason"
                                maxlength="500"
                                minlength="10"
                                outlined
                                prepend-icon="mdi-pencil-outline"
                                rounded
                            ></v-textarea>

                            <v-card-actions>
                                <v-btn
                                    :loading="loading"
                                    color="red"
                                    rounded
                                    text
                                    @click="report()"
                                >
                                    {{ $t("yesSubmit") }}
                                </v-btn>

                                <v-spacer></v-spacer>

                                <v-btn
                                    :disabled="loading"
                                    color="primary"
                                    rounded
                                    text
                                    @click="showDialog = false"
                                >
                                    {{ $t("noCancel") }}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </template>
                <span>{{ $t(`item.reportThis${type.charAt(0).toUpperCase() + type.slice(1)}`) }}</span>
            </v-tooltip>
        </template>
        <v-card>
            <v-card-title>{{ $t(`item.reportThis${type.charAt(0).toUpperCase() + type.slice(1)}`) }}</v-card-title>
            <v-card-text>
                {{ $t("item.reportLoginRequired") }}
            </v-card-text>
            <v-card-actions>
                <v-btn
                    :loading="loading"
                    color="red"
                    rounded
                    text
                    @click="$auth.loginWith('social')"
                >
                    {{ $t("login") }}
                </v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import {reportURL} from "@/graphql/Report.gql";

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
        nsfw: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            showDialog: false,
            showLoginDialog: false,
            loading: false,
            hasReported: false,
            reason: null,
        };
    },
    methods: {
        report() {
            this.loading = true
            ;(this as any).$apollo
                .mutate({
                    mutation: reportURL,
                    variables: {
                        url: window.location.href,
                        type: this.type,
                        nsfw: this.nsfw,
                        reason: this.reason,
                    },
                })
                .then(() => {
                    this.loading = false;
                    this.showDialog = false;
                    this.hasReported = true
                    ;(this as any).$snackbar.message(
                        `${this.type.charAt(0).toUpperCase() +
                        this.type.slice(1)} reported successfully!`,
                    );
                })
                .catch((err: Error) => {
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
