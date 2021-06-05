<template>
    <v-card class="box" :max-width="maxWidth" style="border-radius: 20px;">
        <v-card-title class="headline">
            {{ title }}
        </v-card-title>
        <v-card-subtitle v-if="subtitle">
        </v-card-subtitle>
        <v-card-text>
            <div v-for="item in items" :key="item.title">
                <h2>{{ item.title }}</h2>
                <p>
                    {{ item.content }}
                </p>
                <ul v-if="item.list">
                    <li v-for="list_item in item.list" :key="item.title">
                        <a v-if="list_item.title_to && list_item.title_to.includes('http')" target="_blank" :href="list_item.title_to">
                            <h3>{{ list_item.title }}</h3>
                        </a>
                        <nuxt-link v-else-if="list_item.title_to" :to="list_item.title_to">
                            <h3>{{ list_item.title }}</h3>
                        </nuxt-link>
                        <h3 v-else>{{ list_item.title }}</h3>

                        <p>
                            {{ list_item.content }}
                        </p>
                    </li>
                </ul>
            </div>

            <hr class="mb-2"/>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "TextCard",
    props: {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: false,
        },
        maxWidth: {
            type: Number,
            required: false,
            default: 800,
        },
        items: {
            type: Array,
            required: true,
        },
    },
});
</script>