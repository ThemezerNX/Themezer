<template>
    <div/>
</template>

<script>
import Vue from "vue";
import {LOGOUT_MUTATION} from "@/plugins/auth/graphql/logout";

export default Vue.extend({
    mounted() {
        this.logout();
        if (this.$auth.isAuthenticated) {
            this.logout();
        } else {
            this.$router.push("/");
        }
    },
    methods: {
        logout() {
            this.$auth.logout().then((success) => {
                if (success) {
                    this.$router.push("/");
                }
            });
        },
    },
});
</script>
