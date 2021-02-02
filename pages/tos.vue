<template>
    <v-layout align-center column justify-center pa-3>
        <v-card max-width="600" style="border-radius: 10px;">
            <v-card-title class="headline">
                Terms of Service
            </v-card-title>
            <v-card-text>
                <div v-for="item in tos" :key="item.title">
                    <h2>{{ item.title }}</h2>
                    <p>
                        {{ item.content }}
                    </p>
                </div>

                <hr class="mb-2"/>
            </v-card-text>
        </v-card>
    </v-layout>
</template>

<script>
import Vue from 'vue'
import tos from '@/assets/tos'

export default Vue.extend({
    data() {
        return {
            tos
        }
    },
    head() {
        const metaTitle = 'Terms Of Service'

        return {
            title: metaTitle,
            meta: [
                {
                    hid: 'og:title',
                    name: 'og:title',
                    property: 'og:title',
                    content: metaTitle
                }
            ]
        }
    }
})
</script>
