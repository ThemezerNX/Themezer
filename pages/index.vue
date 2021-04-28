<template>
    <v-container class="pa-0 content" fluid style="height: 100%;">
        <card-collage :height-px="`${collageViewWindowHeight}vh`">
            <template #center>
                <v-img
                    class="collage-title-image"
                    contain
                    :src="require('@/static/icon.png')"
                    width="128"
                />
                <h1 v-if="$auth.loggedIn" class="text-center pt-4 pb-3">
                    Welcome back {{ $auth.user.username }}!
                </h1>
                <div v-else>
                    <h1 class="text-center pt-4 pb-3">
                        Welcome to Themezer!
                    </h1>
                    <p>Themezer is a site for sharing Nintendo Switch themes and layouts</p>
                </div>
            </template>
            <template #bottom>
                <v-btn class="collage-bottom-button" rounded large color="transparent" @click="scrollDown()">
                    <h3>Recent Additions</h3>
                    <v-icon right dark>
                        mdi-arrow-down
                    </v-icon>
                </v-btn>
            </template>
        </card-collage>
        <v-layout ref="additions" justify-center>
            <v-container fluid style="height: 100%;">
                <v-row
                    align="center"
                    justify="center"
                >
                    <v-col class="pt-0" cols="12">
                        <h2>
                            Latest Packs
                        </h2>
                        <v-divider/>
                        <ItemGrid
                            :loading="!packList || !!$apollo.queries.packList.loading"
                            :items="packList"
                            :show-props="['creator']"
                            more-url="/packs?sort=id&order=desc"
                            type="packs"
                        />
                    </v-col>
                </v-row>
                <v-row
                    align="center"
                    justify="center"
                >
                    <v-col class="pt-0" cols="12">
                        <h2>
                            Latest Themes
                        </h2>
                        <v-divider/>
                        <ItemGrid
                            :loading="!themeList || !!$apollo.queries.themeList.loading"
                            :items="themeList"
                            :show-props="['creator']"
                            more-url="/themes?sort=id&order=desc"
                            type="themes"
                        />
                    </v-col>
                </v-row>
                <v-row
                    align="center"
                    justify="center"
                >
                    <v-col class="pt-0" cols="12">
                        <h2>
                            Updated Layouts
                        </h2>
                        <v-divider/>
                        <ItemGrid
                            :loading="!layoutList || !!$apollo.queries.layoutList.loading"
                            :items="layoutList"
                            :show-props="['creator']"
                            more-url="/layouts?sort=updated&order=desc"
                            type="layouts"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-layout>
    </v-container>
</template>

<script>
import Vue from "vue";
import {rowPackList} from "@/graphql/Pack.gql";
import {rowThemeList} from "@/graphql/Theme.gql";
import {rowLayoutList} from "@/graphql/Layout.gql";
import ItemGrid from '@/components/ItemGrid.vue';
import CardCollage from '@/components/CardCollage.vue';

export default Vue.extend({
    components: {
        // Load these components normally to prevent jumpyness
        ItemGrid: ItemGrid,
        CardCollage: CardCollage,
    },
    data() {
        return {
            error: null,
            collageViewWindowHeight: 100,
            scrollOptions: {
                duration: 600,
                offset: 0,
                easing: "easeInOutQuad",
            },
        };
    },
    methods: {
        scrollDown() {
            this.$vuetify.goTo(this.$refs.additions, this.scrollOptions);
        },
    },
    apollo: {
        packList: {
            query: rowPackList,
            variables() {
                const vars = {
                    q: "packList",
                    limit: 12,
                };
                vars.hash = this.$hashString(vars);

                return vars;
            },
            prefetch: false,
        },
        themeList: {
            query: rowThemeList,
            variables() {
                const vars = {
                    q: "themeList",
                    limit: 12,
                };
                vars.hash = this.$hashString(vars);

                return vars;
            },
            prefetch: false,
        },
        layoutList: {
            query: rowLayoutList,
            variables() {
                const vars = {
                    q: "layoutList",
                    sort: "updated",
                    limit: 12,
                };
                vars.hash = this.$hashString(vars);

                return vars;
            },
            prefetch: false,
        },
    },
    head() {
        const metaTitle = "Home";

        return {
            title: metaTitle,
            meta: [
                {
                    hid: "og:title",
                    name: "og:title",
                    property: "og:title",
                    content: metaTitle,
                },
            ],
        };
    },
});
</script>

<style lang="scss" scoped>
.container {
    z-index: 1;
}

.collage-title-image {
    margin: auto;
    box-shadow: 0 8px 18px 5px rgba(0, 0, 0, .3) !important;
    border-radius: 35% !important;
    min-height: 128px;
}

.collage-bottom-button {
    &:hover {
        box-shadow: 0 8px 18px 5px rgba(0, 0, 0, .3) !important;
        transform: translateY(-3px) !important;
    }
}

.content {
    z-index: 5;
}
</style>
