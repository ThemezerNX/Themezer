<template>
    <v-snackbar v-model="snackbar" :color="color" bottom rounded timeout="-1">
        {{ error || message }}
    </v-snackbar>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            snackbar: false,
            color: null,
        };
    },
    computed: {
        message: {
            get(): string {
                return this.$store.state.snackbar.message;
            },
        },
        error: {
            get(): string {
                return this.$store.state.snackbar.error;
            },
        },
    },
    watch: {
        message(n: string) {
            if (n) {
                this.$data.color = "green darken-2";
                this.$data.snackbar = true;
            } else {
                this.$data.snackbar = false;
            }
        },
        error(n: string) {
            if (n) {
                this.$data.color = "error";
                this.$data.snackbar = true;
            } else {
                this.$data.snackbar = false;
            }
        },
    },
});
</script>
