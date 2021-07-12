<template>
    <v-app style="background: transparent;">
        <v-container
            :fluid="$vuetify.breakpoint.smAndDown"
            style="height: 100%;"
        >
            <h2>
                {{ $t("error.uhOh") }}
            </h2>
            <h1 class="mb-4">
                {{ title }}
            </h1>
            <v-btn color="secondary" rounded @click="$router.go(-1)">
                {{ $t("error.goBack") }}
            </v-btn>
        </v-container>
    </v-app>
</template>

<script>
export default {
    layout: 'empty',
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            pageNotFound: this.$t("error.pageNotFound"),
            otherError: this.$t("error.otherError")
        }
    },
    computed: {
        title() {
            return (
                this.error.message.replace('GraphQL error: ', '') ||
                (this.error.statusCode === 404
                    ? this.pageNotFound
                    : this.otherError)
            )
        }
    },
    head() {
        return {
            title: this.title
        }
    }
}
</script>
