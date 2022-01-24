<template>
    <PageSheet max-width="800">
        <template #title v-if="$slots.title">
            <slot name="title"/>
        </template>
        <template #description v-if="$slots.description">
            <slot name="description"/>
        </template>
        <template #content>
            <div v-for="item in items">
                <h2>{{ item.title }}</h2>
                <p>
                    {{ item.content }}
                </p>
                <ul v-if="item.list">
                    <li v-for="list_item in item.list">
                        <a v-if="list_item.title_to && list_item.title_to.includes('http')" :href="list_item.title_to"
                           target="_blank">
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
        </template>
        <template #footer v-if="$slots.footer">
            <slot name="footer"/>
        </template>
    </PageSheet>
</template>

<script lang="ts">
import Vue from "vue";
import PageSheet from "@/components/page/Sheet.vue";

export default Vue.extend({
    name: "PageTextSheet",
    components: {PageSheet},
    props: {
        items: {
            type: Array,
            required: true,
        },
    },
});
</script>
