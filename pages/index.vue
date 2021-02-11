<template>
    <v-container class="pa-0 content" fluid style="height: 100%;">
        <div>
            <!-- <v-parallax
              class="d-flex align-center justify-center parallax"
              height="100%"
              src="https://res.cloudinary.com/rebelwalls/image/upload/b_black,c_fill,f_auto,fl_progressive,h_533,q_auto,w_800/v1479371023/article/R10961_image1"
            /> -->
            <v-layout column justify-center>
                <v-container fluid style="height: 100%;">
                    <h1 v-if="$auth.loggedIn" class="text-center pt-4 pb-3">
                        Welcome back {{ $auth.user.username }}!
                    </h1>
                    <h1 v-else class="text-center pt-4 pb-3">
                        Welcome to Themezer!
                    </h1>
                    <v-row
                        v-if="packList && packList.length > 0"
                        align="center"
                        justify="center"
                    >
                        <v-col class="pt-0" cols="12">
                            <h2>
                                Latest Packs
                            </h2>
                            <v-divider/>
                            <ItemGrid
                                :items="packList"
                                :show-props="['creator']"
                                more-url="/packs?sort=id&order=desc"
                                type="packs"
                            />
                        </v-col>
                    </v-row>
                    <v-row
                        v-if="themeList && themeList.length > 0"
                        align="center"
                        justify="center"
                    >
                        <v-col class="pt-0" cols="12">
                            <h2>
                                Latest Themes
                            </h2>
                            <v-divider/>
                            <ItemGrid
                                :items="themeList"
                                :show-props="['creator']"
                                more-url="/themes?sort=id&order=desc"
                                type="themes"
                            />
                        </v-col>
                    </v-row>
                    <v-row
                        v-if="layoutList && layoutList.length > 0"
                        align="center"
                        justify="center"
                    >
                        <v-col class="pt-0" cols="12">
                            <h2>
                                Updated Layouts
                            </h2>
                            <v-divider/>
                            <ItemGrid
                                :items="layoutList"
                                :show-props="['creator']"
                                more-url="/layouts?sort=updated&order=desc"
                                type="layouts"
                            />
                        </v-col>
                    </v-row>
                </v-container>
            </v-layout>
        </div>
    </v-container>
</template>

<script>
import Vue from 'vue'
import {rowPackList} from '@/graphql/Pack.gql'
import {rowThemeList} from '@/graphql/Theme.gql'
import {rowLayoutList} from '@/graphql/Layout.gql'

export default Vue.extend({
    components: {
        ItemGrid: () => import('@/components/ItemGrid.vue')
    },
    data() {
        return {
            error: null
        }
    },
    apollo: {
        packList: {
            query: rowPackList,
            variables() {
                const vars = {
                    q: 'packList',
                    limit: 12
                }
                vars.hash = this.$hashString(vars)

                return vars
            },
            prefetch: true
        },
        themeList: {
            query: rowThemeList,
            variables() {
                const vars = {
                    q: 'themeList',
                    limit: 12
                }
                vars.hash = this.$hashString(vars)

                return vars
            },
            prefetch: true
        },
        layoutList: {
            query: rowLayoutList,
            variables() {
                const vars = {
                    q: 'layoutList',
                    sort: 'updated',
                    limit: 12
                }
                vars.hash = this.$hashString(vars)

                return vars
            },
            prefetch: true
        }
    },
    head() {
        const metaTitle = 'Home'

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

<style lang="scss" scoped>
.container {
    z-index: 1;
}

.parallax {
    position: fixed;
    height: 100%;
    width: 100%;
}

.content {
    // background: linear-gradient(0deg, #b40a86, #0ab379);
    z-index: 5;
}
</style>
