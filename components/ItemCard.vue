<template>
    <v-hover v-if="item && item.details" v-slot:default="{ hover }">
        <v-card
            :class="{ 'on-hover': hover }"
            :elevation="hover ? 2 : 12"
            :to="
                (type === 'packs'
                  ? '/packs'
                  : `/${type}/${fileNameToWebName(item.target)}`) +
                  `/${createUrlString(item.id, item.details.name)}`
            "
            class="ma-auto card transition-ease"
            router
        >
            <div v-if="!!item.layout" class="badges-wrapper">
                <CertifiedBadge/>
            </div>

            <v-carousel
                v-if="type === 'packs'"
                :cycle="hover"
                :show-arrows="false"
                class="carousel mb-2 transition-ease"
                :class="{ 'on-hover': hover}"
                continuous
                height="auto"
                hide-delimiter-background
                hide-delimiters
                interval="2000"
                style="border-radius: 16px "
            >
                <v-carousel-item v-for="(theme, i) in item.themes" :key="i" >
                    <v-img
                        :src="theme.preview.thumb"
                        :style="
                          type === 'layouts'
                            ? `background-color: ${item.details.color};`
                            : ''
                        "
                        aspect-ratio="1.7778"
                        class="overlay-image"
                        cover
                    />
                </v-carousel-item>
            </v-carousel>

            <v-img
                v-else
                :src="imgSrc"
                :style="
                  type === 'layouts'
                    ? `background-color: ${item.details.color};`
                    : ''
                "
                :class="{ 'img-hover': hover}"
                aspect-ratio="1.7778"
                class="overlay-image mb-2"
                cover
                style="border-radius: 16px; "
            />

            <v-card-title
                :class="
                  showProps.includes('creator') ||
                  showProps.includes('target')
                    ? 'mb-0'
                    : 'my-1 mx-3'
                "
                class="title subtitle-1"
                v-text="item.details.name"
            />

            <v-card-subtitle
                v-if="showProps.includes('creator')"
                class="creator"
            >
                By {{ item.creator.display_name }}
                {{ item.details.version ? `• v${item.details.version}` : "" }}
            </v-card-subtitle>

            <v-card-subtitle
                v-if="showProps.includes('target') && item.target"
                class="creator"
            >
                {{ item.target }}
            </v-card-subtitle>

            <v-divider v-if="item.details.description"/>

            <v-card-text
                v-if="
                  item.details.description &&
                    showProps.includes('description')
                "
                class="description"
            >
                <div v-linkified v-html="item.details.description"/>
            </v-card-text>
        </v-card>
    </v-hover>
</template>

<script lang="ts">
import Vue from "vue";
import urlParser from "@/components/mixins/urlParser";
import targetParser from "@/components/mixins/targetParser";

export default Vue.extend({
    components: {
        CertifiedBadge: () => import("@/components/badges/CertifiedBadge.vue"),
    },
    mixins: [urlParser, targetParser],
    props: {
        item: {
            type: Object,
            required: true,
            default: null,
        },
        type: {
            type: String,
            required: true,
        },
        showProps: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },
    },
    computed: {
        imgSrc(): String {
            if (this.type === "layouts")
                return `${process.env.API_ENDPOINT}cdn/layouts/${this.item.uuid}/overlay.png`;
            else if (this.type === "themes") return this.item.preview.thumb;
            else return "";
        },
    },
});
</script>

<style lang="scss" scoped>
@import 'assets/card.scss';
</style>
