<template>
    <v-snackbar v-model="snackbar" :color="color" bottom timeout="-1" rounded>
        {{ error || message }}
    </v-snackbar>
</template>

<script lang="ts">
export default {
    data() {
        return {
            snackbar: false,
            color: null,
        };
    },
    computed: {
        message() {
            return (this as any).$store.state.snackbar?.message;
        },
        error() {
            return (this as any).$store.state.snackbar?.error;
        },
    },
    watch: {
        message(n: string) {
            if (n && n !== "") {
                ;(this as any).$data.color = "green darken-2"
                ;(this as any).snackbar = true;
            } else (this as any).snackbar = false;
        },
        error(n: string) {
            if (n && n !== "") {
                ;(this as any).$data.color = "error"
                ;(this as any).snackbar = true;
            } else (this as any).snackbar = false;
        },
    },
};
</script>
