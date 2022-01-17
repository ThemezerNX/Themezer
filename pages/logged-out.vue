<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <LoadingOverlay :dim="false" :shadow="false">
            <v-alert color="info" rounded style="z-index: 5;">
                {{ $t("logoutSuccess") }}
            </v-alert>
        </LoadingOverlay>
    </v-container>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
    components: {
        LoadingOverlay: () => import("~/components/LoadingOverlay.vue"),
    },
    mounted() {
        setTimeout(() => {
            this.$router.push("/");
        }, 2000);
    },
});
</script>
