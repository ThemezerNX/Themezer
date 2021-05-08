<template>
    <v-container :fluid="$vuetify.breakpoint.smAndDown" style="height: 100%;">
        <LoadingOverlay :dim="false" :shadow="false">
            <div>
                <v-alert color="info" style="z-index: 5;" rounded>
                    You have been logged out!
                </v-alert>
            </div>
        </LoadingOverlay>
    </v-container>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
    components: {
        LoadingOverlay: () => import('@/components/LoadingOverlay.vue')
    },
    mounted() {
        setTimeout(() => {
            this.$router.push('/')
        }, 2000)
    }
})
</script>
