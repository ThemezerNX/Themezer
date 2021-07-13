<template>
    <v-sheet v-if="items" class="mx-auto" style="background: unset;">
        <v-slide-group
            :class="$vuetify.breakpoint.smAndDown ? 'smAndDown' : ''"
            center-active
            show-arrows="always"
        >
            <v-slide-item v-for="(theme, i) in items" :key="i">
                <v-hover v-if="theme" v-slot:default="{ hover }">
                    <v-scale-transition>
                        <v-card
                            :class="`
                                ${$vuetify.breakpoint.smAndDown ? 'ms-1' : 'ms-2'}
                                ${
                                    $vuetify.breakpoint.smAndDown
                                    ? 'me-1'
                                    : 'me-2'
                                }
                                ${hover ? 'on-hover' : ''}
                            `"
                            :elevation="hover ? 2 : 10"
                            :to="
                                `/themes/${fileNameToWebName(
                                  theme.target
                                )}/${createUrlString(
                                  theme.id,
                                  theme.details.name
                                )}`
                              "
                            class="mx-auto card transition-ease"
                            router
                        >
                            <div v-if="!!theme.layout" class="badges-wrapper">
                                <CertifiedBadge/>
                            </div>

                            <v-img
                                :src="theme.preview.thumb"
                                :width="
                                  $vuetify.breakpoint.smAndDown ? 200 : 300
                                "
                                class="transition-ease"
                                :class="{ 'img-hover': hover}"
                                aspect-ratio="1.7778"
                                cover
                                style="border-radius: 16px"
                            />

                            <v-card-title
                                :class="
                                  ($vuetify.breakpoint.smAndDown
                                    ? 'body-2'
                                    : 'subtitle-1') +
                                    ' ' +
                                    (showProps.includes('creator') ||
                                    showProps.includes('target')
                                      ? 'mb-0'
                                      : 'my-1 mx-3')
                                "
                                class="title"
                                v-text="theme.details.name"
                            />
                            <v-card-subtitle
                                v-if="showProps.includes('creator')"
                                class="creator"
                            >
                                {{ $t("item.author", {creator: theme.creator.display_name}) }}
                            </v-card-subtitle>
                            <v-card-subtitle
                                v-if="showProps.includes('target')"
                                class="target"
                            >
                                {{ toNiceWebName(theme.target) }}
                            </v-card-subtitle>
                        </v-card>
                    </v-scale-transition>
                </v-hover>
            </v-slide-item>
        </v-slide-group>
    </v-sheet>
</template>

<script lang="ts">
import Vue from "vue";
import targetParser from "@/components/mixins/targetParser";
import urlParser from "@/components/mixins/urlParser";

export default Vue.extend({
    components: {
        CertifiedBadge: () => import("@/components/badges/CertifiedBadge.vue"),
    },
    mixins: [targetParser, urlParser],
    props: {
        items: {
            type: Array,
            required: true,
            default: null,
        },
        showProps: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },
    },
});
</script>

<style lang="scss" scoped>
@import 'assets/card.scss';
</style>
