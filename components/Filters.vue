<template>
    <v-card
        :elevation="12"
        class="ma-auto"
        exact
        router
    >
        <div
            class="group"
            @mouseleave="searchHover = false"
            @mouseover="searchHover = true"
        >
            <v-card-title class="title">
                {{ $t("filter.search") }}
                <v-spacer/>
                <v-btn
                    :disabled="
                        Object.keys($route.query).length === 0 ||
                          (Object.keys($route.query).includes('page')
                            ? Object.keys($route.query).length === 1
                            : !Object.keys($route.query).length)
                    "
                    class="px-1"
                    color="secondary"
                    rounded
                    style="height: 24px"
                    text
                    @click="$router.push($route.path)"
                >
                    {{ $t("filter.clear") }}
                </v-btn>
            </v-card-title>

            <v-card-actions class="mx-2" @focus="focussed = true">
                <v-text-field
                    v-model="query"
                    :label="$t('filter.search')"
                    dense
                    hide-details
                    outlined
                    rounded
                    single-line
                    @blur="focussed = false"
                    @focus="focussed = true"
                ></v-text-field>
            </v-card-actions>
            <v-expand-transition mode="out-in" name="card-animation">
                <div
                    v-show="
                        focussed ||
                          searchHover ||
                          withCreators.length > 0 ||
                          withLayouts.length > 0
                    "
                    class="mx-2 search-in"
                    @mouseover="searchHover = true"
                >
                    <v-card-actions>
                        <v-autocomplete
                            v-model="withCreators"
                            :disabled="onlybyme"
                            :items="allCreators || []"
                            :label="$tc('creator', 2)"
                            :loading="loading.allCreators"
                            :menu-props="{ bottom: true, offsetY: true }"
                            auto-select-first
                            chips
                            deletable-chips
                            dense
                            hide-details
                            multiple
                            outlined
                            rounded
                            single-line
                            small-chips
                            @blur="focussed = false"
                            @click="focussed = true"
                            @mouseover.once="getParentAllCreators()"
                        ></v-autocomplete>
                    </v-card-actions>
                    <v-card-actions>
                        <v-autocomplete
                            v-if="!unsupportedFilters.includes('withLayouts')"
                            v-model="withLayouts"
                            :items="allLayouts || []"
                            :label="$tc('layout', 2)"
                            :loading="loading.allLayouts"
                            :menu-props="{ bottom: true, offsetY: true }"
                            auto-select-first
                            chips
                            deletable-chips
                            dense
                            hide-details
                            multiple
                            outlined
                            rounded
                            single-line
                            small-chips
                            @blur="focussed = false"
                            @click="focussed = true"
                            @mouseover.once="getParentAllLayouts()"
                        ></v-autocomplete>
                    </v-card-actions>
                </div>
            </v-expand-transition>
        </div>

        <div class="group">
            <v-card-title class="title">
                {{ $t("filter.sortBy") }}
            </v-card-title>

            <v-card-actions class="link-group mx-2">
                <nuxt-link
                    v-for="(option, i) in sortOptions"
                    :key="i"
                    :class="{
                            'nuxt-link-exact-active': currentSort === option.id,
                            asc: currentOrder === 'asc',
                            desc: currentOrder === 'desc'
                        }"
                    :to="{
                            query: {
                              page: undefined,
                              query: $parent.currentSearch,
                              sort: option.id,
                              order:
                                currentSort === option.id
                                  ? nextSortOrder
                                  : 'desc',
                              creators:
                                withCreators.length > 0
                                  ? withCreators.join(',')
                                  : undefined,
                              layouts:
                                withLayouts.length > 0
                                  ? withLayouts.join(',')
                                  : undefined
                            }
                          }"
                    class="sort-item"
                >
                    <v-icon
                        :color="
                          currentSort === option.id && currentOrder === 'asc'
                            ? '#1e1e1e'
                            : 'white'
                        "
                    >
                        {{ option.icon }}
                    </v-icon>
                    {{ $t(`filter.${option.id}`) }}
                    <span v-show="currentSort === option.id" class="order">
                        <v-icon
                            :color="currentOrder === 'asc' ? '#1e1e1e' : 'white'"
                        >
                          mdi-arrow-up
                        </v-icon>
                    </span>
                </nuxt-link>
            </v-card-actions>
        </div>

        <div class="group">
            <v-card-title class="title">
                {{ $t("filter.filters") }}
            </v-card-title>

            <v-card-actions v-if="!unsupportedFilters.includes('my')">
                <v-checkbox
                    v-model="onlybyme"
                    :label="$t('filter.madeByMe')"
                    class="ma-0 mx-2"
                    hide-details
                    @change="
                            $event
                              ? (withCreators = [$auth.user.id])
                              : (withCreators = [])
                        "
                    @change.once="getParentAllCreators()"
                ></v-checkbox>
            </v-card-actions>

            <v-card-actions v-if="!unsupportedFilters.includes('nsfw')">
                <v-checkbox
                    v-model="nsfw"
                    :label="$t('filter.nsfw')"
                    class="ma-0 mx-2"
                    color="red"
                    hide-details
                ></v-checkbox>
            </v-card-actions>
        </div>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: {
        unsupportedFilters: {
            type: Array,
            required: true,
            default: null,
        },
    },
    data() {
        return {
            sortOptions: [
                {
                    id: "downloads",
                    icon: "mdi-download-outline",
                },
                {
                    id: "likes",
                    icon: "mdi-heart",
                },
                {
                    id: "updated",
                    icon: "mdi-calendar-edit",
                },
                {
                    id: "id",
                    icon: "mdi-calendar-clock",
                },
            ],
            loading: {
                allCreators: false,
                allLayouts: false,
            },
            allCreators: null,
            allLayouts: null,
            // Search with
            query: "",
            typingQueryTimer: null,
            focussed: false,
            searchHover: false,
            withCreators: [],
            typingWithCreatorsTimer: null,
            withLayouts: [],
            typingWithLayoutsTimer: null,
            // Filters
            onlybyme: false,
            nsfw: false,
        };
    },
    computed: {
        currentSort(): string {
            return this.$route.query.sort
                ? (this.$route.query.sort as string)
                : "downloads";
        },
        currentOrder(): string {
            return this.$route.query.order
                ? (this.$route.query.order as string)
                : "desc";
        },
        nextSortOrder(): string | null {
            if (this.currentOrder === "asc") {
                return "desc";
            } else {
                return "asc";
            }
        },
        currentCreators(): Array<string> | undefined {
            const creators = this.$route.query.creators
                ? (this.$route.query.creators as string).split(",")
                : undefined;

            if (this.$auth.isAuthenticated && creators && creators.includes((this.$auth as any)?.user?.id)) {
                this.onlybyme = true;
            }

            return creators;
        },
        currentLayouts(): Array<string> | undefined {
            return this.$route.query.layouts
                ? (this.$route.query.layouts as string).split(",")
                : undefined;
        },
    },
    watch: {
        nsfw(n) {
            this.$parent.$data.nsfw = n;
        },
        query(n) {
            clearTimeout(this.$data.typingQueryTimer);
            this.$data.typingQueryTimer = setTimeout(() => {
                const query = Object.assign({}, this.$route.query);
                delete query.page;
                if (n === "") delete query.query;
                else query.query = n;
                this.$router.push({
                    query,
                });
            }, 400);
        },
        withCreators(n, o) {
            if (
                (this.$data.allCreators || this.$data.loading.allCreators) &&
                n.length !== o.length
            ) {
                clearTimeout(this.$data.typingWithCreatorsTimer);
                this.$data.typingWithCreatorsTimer = setTimeout(() => {
                    const query = Object.assign({}, this.$route.query);
                    delete query.page;
                    if (n.length === 0) delete query.creators;
                    else query.creators = n.join(",");
                    this.$router.push({
                        query,
                    });
                }, 400);
            }
        },
        withLayouts(n, o) {
            if (
                (this.$data.allLayouts || this.$data.loading.allLayouts) &&
                n.length !== o.length
            ) {
                clearTimeout(this.$data.typingWithLayoutsTimer);
                this.$data.typingWithLayoutsTimer = setTimeout(() => {
                    const query = Object.assign({}, this.$route.query);
                    delete query.page;
                    if (n.length === 0) delete query.layouts;
                    else query.layouts = n.join(",");
                    this.$router.push({
                        query,
                    });
                }, 400);
            }
        },
        currentCreators(n) {
            if (!n) {
                this.withCreators = [];
            }
        },
        currentLayouts(n) {
            if (!n) {
                this.withLayouts = [];
            }
        },
    },
    mounted() {
        this.$data.query = this.$route.query.query || "";
        if ((this.$parent as any).currentCreators) {
            this.$data.withCreators = (this.$parent as any).currentCreators;
            this.getParentAllCreators();
        }
        if ((this.$parent as any).currentLayouts) {
            this.$data.withLayouts = (this.$parent as any).currentLayouts;
            this.getParentAllLayouts();
        }
    },
    methods: {
        getParentAllCreators() {
            this.$data.loading.allCreators = true
            ;(this.$parent as any).getAllCreators().then((res: Array<any>) => {
                this.$data.allCreators = res
                    .map((item) => {
                        return {
                            text: item.creator.display_name,
                            value: item.creator.id,
                        };
                    })
                    .sort((a, b) =>
                        a.text.toLowerCase().localeCompare(b.text.toLowerCase()),
                    );
                this.$data.loading.allCreators = false;
            });
        },
        getParentAllLayouts() {
            this.$data.loading.allLayouts = true
            ;(this.$parent as any).getAllLayouts().then((res: Array<any>) => {
                const all: Array<any> = [];
                if (this.$parent.$data.type === "themes") {
                    res.forEach((item) => {
                        if (item.layout) {
                            all.push({
                                text: item.layout.details.name,
                                value: item.layout.id,
                            });
                        }
                    });
                } else {
                    res.forEach((pack) => {
                        pack.themes.forEach((theme: any) => {
                            if (theme.layout)
                                all.push({
                                    text: theme.layout.details.name,
                                    value: theme.layout.id,
                                });
                        });
                    });
                }

                this.$data.allLayouts = all.sort((a, b) =>
                    a.text.toLowerCase().localeCompare(b.text.toLowerCase()),
                );

                this.$data.loading.allLayouts = false;
            });
        },
    },
});
</script>

<style lang="scss" scoped>
@import 'assets/variables.scss';

.group:first-of-type {
    padding-top: 8px;
}

.group:last-of-type {
    padding-bottom: 8px;
}

.group > .title {
    padding-top: 0;
    padding-bottom: 0;
}

.link-group {
    display: grid;
}

.sort-item {
    width: 100%;
    position: relative;
    font-weight: 600;
    font-size: 0.95em;
    text-decoration: none;
    padding: 6px 12px;
    margin: 4px 0;
    border-radius: 100px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.8);

    transition: all 200ms ease;

    &:hover {
        box-shadow: 0 6px 6px -3px rgb(0 0 0 / 20%), 0 10px 14px 1px rgb(0 0 0 / 14%), 0 4px 18px 3px rgb(0 0 0 / 12%) !important;
        transform: translateY(-3px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: rgba(255, 255, 255, 0.6);
        background-color: transparentize(rgba(255, 255, 255, 0.2), 0.9);
    }

    &.nuxt-link-exact-active.asc,
    &.router-link-exact-active.asc {
        border: 1px solid darken($themezer-primary, 5%);
        background-color: darken($themezer-primary, 2%);
        color: #1e1e1e;

        .order {
            transform: unset;
        }
    }

    &.nuxt-link-exact-active.desc,
    &.router-link-exact-active.desc {
        border: 1px solid darken($themezer-secondary, 5%);
        background-color: darken($themezer-secondary, 2%);
        color: white;

        .order {
            transform: rotateZ(180deg);
        }
    }

    .order {
        right: 0;
        transition: all .25s ease;
        position: absolute;
        margin-right: 6px;
    }
}
</style>
