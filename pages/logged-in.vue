<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <LoadingOverlay :dim="false" :shadow="false">
            <v-alert color="info" style="z-index: 5;" rounded>
                {{ $t("loginSuccess") }}
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
    mounted() {
        const redirectUrl = this.$cookies.get("login_redirect") || "/";
        this.$cookies.remove("login_redirect");
        setTimeout(() => {
            this.$router.push(redirectUrl);
        }, 2000);
    },
});
</script>
