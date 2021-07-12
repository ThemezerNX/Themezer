<template>
    <v-container
        :class="{ 'pa-10': !$vuetify.breakpoint.smAndDown }"
        :fluid="$vuetify.breakpoint.smAndDown"
        class="d-flex align-center"
        style="height: 100%;"
    >
        <v-row class="d-flex align-center" style="height: 100%;">
            <v-col cols="12" style="align-self: flex-end;">
                <h1
                    class="flex-grow-1 text-center display-2 font-weight-medium"
                >
                    {{ $t("target.choose") }}
                </h1>
                <h2
                    class="flex-grow-1 text-center display-1 font-weight-medium text-capitalize"
                >
                    {{ $parent.$data.typeName }}
                </h2>
            </v-col>
            <v-hover
                v-for="target in targets.menus"
                :key="target.target"
                v-slot:default="{ hover }"
            >
                <v-col
                    class="mx-auto"
                    cols="12"
                    md="3"
                    sm="4"
                    style="align-self: flex-start;"
                    xs="12"
                >
                    <v-fade-transition>
                        <v-card
                            :class="{ 'on-hover': hover }"
                            :elevation="hover ? 2 : 12"
                            :to="{
                                path: `${$parent.$data.type}/${target.target}`,
                                query: $route.query
                              }"
                            class="card d-flex align-center transition-ease"
                            min-height="200"
                            min-width="200"
                        >
                            <img
                                :src="
                                  require(`@/assets/stock/360/${target.image}`)
                                "
                                alt="menu screenshot"
                                class="thumbnail transition-ease"
                            />
                            <div class="display-2 flex-grow-1 text-center">
                                <v-icon size="60">{{ target.icon }}</v-icon>
                                <h6 style="position: relative;">
                                    {{ toNiceWebName(target.target) }}
                                </h6>
                            </div>
                        </v-card>
                    </v-fade-transition>
                </v-col>
            </v-hover>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import targets from "@/assets/targets";
import targetParser from "~/components/mixins/targetParser";

export default Vue.extend({
    data() {
        return {
            targets: targets.find(
                (type) => type.name === this.$parent.$data.type,
            ),
        };
    },
    mixins: [targetParser],
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
    // background: darken($themezer-primary, 15%) !important;
    transform: translateY(10px);

    .thumbnail {
        opacity: 1;
        filter: brightness(0.6);
        transform: rotate(-10deg) scale(1.25);
    }
}
</style>
