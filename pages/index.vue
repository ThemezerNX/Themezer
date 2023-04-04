<template>
    <v-container ref="top" class="pa-0 content" fluid style="height: 100%;">
        <card-collage :height-px="`${collageViewWindowHeight}vh`">
            <template #center>
                <v-img
                    src="@/static/icon.png"
                    class="collage-title-image"
                    contain
                    width="128"
                />
                <h1 v-if="$auth.isAuthenticated" class="text-center pt-4 pb-3">
                    {{ $t("welcomeBack", {user: $auth.user.username}) }}
                </h1>
                <div v-else>
                    <h1 class="text-center pt-4 pb-3">
                        {{ $t("welcome") }}
                    </h1>
                    <p>{{ $t("themezerIntro") }}</p>
                </div>
            </template>
            <template #bottom>
                <v-btn class="collage-bottom-button" color="transparent" large rounded @click="scrollDown(false)">
                    <h3>{{ $t("home.recentAdditions") }}</h3>
                    <v-icon dark right>
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
                    <v-col class="pt-0"
                           cols="12"
                           lg="9"
                           md="9"
                           sm="12"
                           xl="9"
                           xs="12"
                    >
                        <h2>
                            {{ $t("home.newPacks") }}
                        </h2>
                        <v-divider/>
                        <item-grid
                            :items="packList"
                            :loading="!packList || !!$apollo.queries.packList.loading"
                            :show-props="['creator']"
                            more-url="/packs?sort=id&order=desc"
                            type="packs"
                        >
                            <template #moreButtonSubtitle>
                                {{ $t("home.newPacks") }}
                            </template>
                        </item-grid>
                    </v-col>
                </v-row>
                <v-row
                    align="center"
                    justify="center"
                >
                    <v-col class="pt-0"
                           cols="12"
                           lg="9"
                           md="9"
                           sm="12"
                           xl="9"
                           xs="12"
                    >
                        <h2>
                            {{ $t("home.newThemes") }}
                        </h2>
                        <v-divider/>
                        <item-grid
                            :items="themeList"
                            :loading="!themeList || !!$apollo.queries.themeList.loading"
                            :show-props="['creator']"
                            more-url="/themes?sort=id&order=desc"
                            type="themes"
                        >
                            <template #moreButtonSubtitle>
                                {{ $t("home.newThemes") }}
                            </template>
                        </item-grid>
                    </v-col>
                </v-row>
                <v-row
                    align="center"
                    justify="center"
                >
                    <v-col class="pt-0"
                           cols="12"
                           lg="9"
                           md="9"
                           sm="12"
                           xl="9"
                           xs="12"
                    >
                        <h2>
                            {{ $t("home.updatedLayouts") }}
                        </h2>
                        <v-divider/>
                        <item-grid
                            :items="layoutList"
                            :loading="!layoutList || !!$apollo.queries.layoutList.loading"
                            :show-props="['creator']"
                            more-url="/layouts?sort=updated&order=desc"
                            type="layouts"
                        >
                            <template #moreButtonSubtitle>
                                {{ $t("home.updatedLayouts") }}
                            </template>
                        </item-grid>
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
import ItemGrid from "@/components/ItemGrid.vue";
import CardCollage from "@/components/CardCollage.vue";

export default Vue.extend({
    components: {
        // Load these components normally to prevent jumpyness
        ItemGrid: ItemGrid,
        CardCollage: CardCollage,
    },
    mounted() {
        this.$nextTick(() => {
            if (this.$route.hash && this.$route.hash.includes("#additions")) {
                this.scrollDown(true);
            }
        });
    },
    data() {
        return {
            error: null,
            collageViewWindowHeight: 100,
            scrollOptions: {
                duration: 500,
                offset: 0,
                easing: "easeInOutQuad",
            },
        };
    },
    computed: {
        hash() {
            return this.$route.hash;
        },
    },
    watch: {
        hash(newHash) {
            if (newHash.includes("#additions")) {
                this.scrollDown(false);
            } else {
                this.scrollUp(false);
            }
        },
    },
    methods: {
        scrollDown(instant) {
            this.scroll(this.$refs.additions, instant);
        },
        scrollUp(instant) {
            this.scroll(this.$refs.top, instant);
        },
        scroll(element, instant) {
            this.$vuetify.goTo(element, instant ? {duration: 0} : this.scrollOptions);
        },
    },
    apollo: {
        packList: {
            query: rowPackList,
            variables() {
                const vars = {
                    q: "packList",
                    limit: 8,
                };
                vars.hash = this.$objectHash(vars);

                return vars;
            },
            prefetch: false,
        },
        themeList: {
            query: rowThemeList,
            variables() {
                const vars = {
                    q: "themeList",
                    limit: 8,
                };
                vars.hash = this.$objectHash(vars);

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
                    limit: 8,
                };
                vars.hash = this.$objectHash(vars);

                return vars;
            },
            prefetch: false,
        },
    },
    head() {
        const metaTitle = this.$t("home.pageTitle");

        const i18nHead = this.$nuxtI18nHead({addSeoAttributes: true});
        return {
            htmlAttrs: {
                ...i18nHead.htmlAttrs,
            },
            link: [
                ...i18nHead.link,
            ],
            title: metaTitle,
            meta: [
                ...i18nHead.meta,
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
@import "~assets/variables.scss";

.container {
    z-index: 1;
}

.collage-bottom-button {
    &:hover {
        box-shadow: 0 8px 18px 5px rgba(0, 0, 0, .3);
        transform: translateY(-3px);
    }
}

.content {
    z-index: 5;
}
</style>
