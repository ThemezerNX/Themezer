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
                Delete
                <v-icon right>{{ icon || 'mdi-delete' }}</v-icon>
            </v-btn>
            <v-dialog
                v-model="showDialog"
                :persistent="loading"
                max-width="400"
            >
                <v-card>
                    <v-card-title class="headline"
                    >You're super close to deleting this {{ type }} forever.
                        Are you absolutely sure?
                    </v-card-title
                    >

                    <v-card-text>
                        All data related to this {{ type }} will be removed from
                        the server.
                    </v-card-text>

                    <v-card-actions>
                        <v-btn
                            :loading="loading"
                            color="red"
                            rounded
                            text
                            @click="del()"
                        >
                            Delete
                        </v-btn>
                        <v-spacer></v-spacer>

                        <v-btn
                            :disabled="loading"
                            color="primary"
                            rounded
                            text
                            @click="showDialog = false"
                        >
                            Cancel
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </template>
        <span>Delete this {{ type }}</span>
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
                        `${this.type.charAt(0).toUpperCase() +
                        this.type.slice(1)} deleted successfully!`,
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
