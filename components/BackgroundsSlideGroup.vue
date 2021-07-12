<template>
    <v-sheet class="mx-auto" style="background: unset;">
        <h2 class="px-2">
            {{ $t("layouts.tryBackgrounds") }}
        </h2>
        <v-slide-group
            v-model="activeBackground"
            :class="$vuetify.breakpoint.smAndDown ? 'smAndDown' : ''"
            center-active
            mandatory
            show-arrows
        >
            <v-slide-item
                v-for="(background, i) in backgrounds"
                :key="i"
                v-slot:default="{ toggle }"
            >
                <v-hover v-if="background" v-slot:default="{ hover }">
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
                            :width="
                                background.url
                                  ? null
                                  : $vuetify.breakpoint.smAndDown
                                  ? 80
                                  : 100
                              "
                            class="ma-auto card transition-ease"
                            @click="toggle"
                        >
                            <v-img
                                v-if="background.url"
                                :src="
                                  require(`@/assets/backgrounds/${background.url}`)
                                "
                                :width="
                                  $vuetify.breakpoint.smAndDown ? 200 : 300
                                "
                                class="transition-ease"
                                :class="{ 'img-hover': hover}"
                                aspect-ratio="1.7778"
                                contain
                                style="border-radius: 16px"
                            />

                            <v-card-title
                                v-if="background.url"
                                :class="
                                  $vuetify.breakpoint.smAndDown
                                    ? 'body-2'
                                    : 'subtitle-1'
                                "
                                class="my-1 mx-3 title"
                                v-text="background.name"
                            />

                            <v-row
                                v-else-if="background.clear"
                                align="center"
                                class="fill-height"
                                justify="center"
                            >
                                <v-icon
                                    color="white"
                                    size="48"
                                    v-text="'mdi-close-circle-outline'"
                                />
                            </v-row>

                            <v-row
                                v-else-if="background.upload"
                                align="center"
                                class="fill-height"
                                justify="center"
                                @click="$refs.backgroundUpload[0].click()"
                            >
                                <v-icon
                                    color="white"
                                    size="48"
                                >
                                    mdi-upload
                                </v-icon>
                                <input
                                    ref="backgroundUpload"
                                    accept="image/*"
                                    style="display: none"
                                    type="file"
                                    @change="handleBackgroundUpload"
                                />
                            </v-row>
                        </v-card>
                    </v-scale-transition>
                </v-hover>
            </v-slide-item>
        </v-slide-group>
    </v-sheet>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            activeBackground: 0,
            backgrounds: [
                {
                    clear: true,
                },
                {
                    name: this.$t("layouts.backgrounds.botwForest"),
                    url: "Games/Breath_of_the_Wild_Forest.jpg",
                },
                {
                    name: this.$t("layouts.backgrounds.skyrimMountains"),
                    url: "Games/Skyrim_Mountains.jpg",
                },
                {
                    name: this.$t("layouts.backgrounds.acod"),
                    url: "Games/Assassins_Creed_Odyssey.jpg",
                },
                {
                    name: this.$t("layouts.backgrounds.fc5"),
                    url: "Games/Far_Cry_5.jpg",
                },
                {
                    name: this.$t("layouts.backgrounds.botwArt"),
                    url: "Games/Zelda_BotW_Art.jpg",
                },
                {
                    name: this.$t("layouts.backgrounds.acnh"),
                    url: "Games/Animal_Crossing_New_Horizons.jpg",
                },
                {
                    name: this.$t("layouts.backgrounds.sea"),
                    url: "Nature/Sea.jpg",
                },
                {
                    name: this.$t("layouts.backgrounds.spiderman"),
                    url: "Movies/Spiderman_Into_the_Spiderverse_-_2.jpg",
                },
                {
                    name: this.$t("layouts.backgrounds.pewdiepie"),
                    url: "PewDiePie.jpg",
                },
                {
                    name: this.$t("layouts.backgrounds.franxx"),
                    url: "Movies/Darling_in_the_Franxx_-_1.jpg",
                },
                {
                    name: this.$t("layouts.backgrounds.nier"),
                    url: "Games/Nier_Automata_-_1.jpg",
                },
                {
                    name: this.$t("layouts.backgrounds.p5"),
                    url: "Games/Persona_5/Persona_5_Ryuji.jpg",
                },
                {
                    upload: true,
                },
            ],
        };
    },
    watch: {
        activeBackground(selected: any) {
            this.$store.commit(
                "SET_BACKGROUND",
                this.backgrounds[selected].url
                    ? encodeURI(this.backgrounds[selected].url || "")
                    : null,
            );
        },
    },
    methods: {
        handleBackgroundUpload(input: any) {
            if (input && input.target.files[0]) {
                const imageUrl = URL.createObjectURL(input.target.files[0]);
                this.$store.commit("SET_BACKGROUND", imageUrl);
            }
        },
    },
});
</script>

<style lang="scss" scoped>
@import 'assets/card.scss';
</style>
