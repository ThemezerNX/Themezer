<template>
    <div/>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
    middleware: ["auth"],
    data() {
        return {
            prevRoute: null,
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.prevRoute = from;
        });
    },
    mounted() {
        if (this.prevRoute) {
            this.$cookies.set("login_redirect", this.prevRoute.fullPath, {
                maxAge: 86400,
                httpOnly: false,
            });
        }

        this.$auth.loginWith("social");
    },
});
</script>
