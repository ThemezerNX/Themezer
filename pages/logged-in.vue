<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <LoadingOverlay :dim="false" :shadow="false">
            <v-alert color="info" style="z-index: 5;" rounded>
                You are now logged in!
            </v-alert>
        </LoadingOverlay>
    </v-container>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
    components: {
        LoadingOverlay: () => import("@/components/LoadingOverlay.vue"),
    },
    computed: {
        isCallback() {
            return false;
        }
    },
    mounted() {
        console.log(this.$cookies.get("login_redirect"))
        const redirectUrl = this.$cookies.get("login_redirect") || "/";
        this.$cookies.remove("login_redirect");
        setTimeout(() => {
            this.$router.push(redirectUrl);
        }, 2000);
    },
});
</script>
