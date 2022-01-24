<template>
    <PageBlank center-content-vertical center-content-horizontal larger-gutters>
        <v-col>
            <v-row class="d-flex align-center text-center" style="height: 100%;">
                <v-col cols="12">
                    <h1 class="display-2 font-weight-medium">
                        {{ $t("target.choose") }}
                    </h1>
                    <h2 class="display-1 font-weight-light">
                        {{ this.$tc(item.langKey, 2) }}
                    </h2>
                </v-col>
                <v-hover
                    v-for="target in item.menus"
                    :key="target.target"
                    #default="{ hover }"
                >
                    <v-col
                        class="mx-auto"
                        cols="12"
                        md="3"
                        sm="4"
                        xs="12"
                    >
                        <v-fade-transition>
                            <v-card
                                :class="{ 'on-hover': hover }"
                                :elevation="hover ? 2 : 12"
                                :to="{
                                path: `${type}/${target.target}`,
                                query: $route.query
                            }"
                                class="card d-flex align-center transition-ease"
                                min-height="200"
                                min-width="200"
                            >
                                <img
                                    :src="require(`@/assets/images/stock/360/${target.image}`)"
                                    alt="menu screenshot"
                                    class="thumbnail transition-ease"
                                />
                                <div class="display-2 mx-auto">
                                    <v-icon size="60">{{ target.icon }}</v-icon>
                                    <h6 style="position: relative;">
                                        {{ toNice(target.target) }}
                                    </h6>
                                </div>
                            </v-card>
                        </v-fade-transition>
                    </v-col>
                </v-hover>
            </v-row>
        </v-col>
    </PageBlank>
</template>

<script lang="ts">
import Vue from "vue";
import targets from "@/assets/targets";
import {toNice} from "@themezernx/target-parser/dist";

export default Vue.extend({
    name: "PageTargetPicker",
    data() {
        return {
            item: targets.find((type) => type.name === this.type),
        };
    },
    props: {
        type: {
            type: String,
            required: true,
        },
    },
    methods: {
        toNice,
    },
});
</script>

<style lang="scss" scoped>
.card {
    border-radius: 20px !important;
    overflow: hidden;
    text-shadow: 0 0 5px #000000;

    .thumbnail {
        opacity: 0.3;
        left: 0;
        transform: scale(1.05);
        filter: brightness(0.4);
        position: absolute;
        width: 100%;
        height: 110%;
        object-fit: cover;
    }
}

.card.on-hover {
    transform: translateY(-10px);

    .thumbnail {
        opacity: 1;
        filter: brightness(0.6);
        transform: rotate(-10deg) scale(1.25);
    }
}
</style>
