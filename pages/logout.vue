<template>
    <div/>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
    middleware: ['auth'],
    options: {
        auth: false
    },
    data() {
        return {
            error: null
        }
    },
    mounted() {
        if (this.$auth.loggedIn) this.logout()
        else this.$router.push('/')
    },
    methods: {
        logout() {
            this.error = null
            return this.$auth.logout('social').catch((e) => {
                this.error = e.response.data
            })
        }
    }
})
</script>
