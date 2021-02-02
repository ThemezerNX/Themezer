<template>
    <div/>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
    middleware: ['auth'],
    options: {
        auth: true
    },
    beforeRouteEnter(_to, _from, next) {
        next('/')
    }
})
</script>
