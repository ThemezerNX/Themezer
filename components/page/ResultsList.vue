<template>
    <PageBlank fill-height>
        <v-row>
            <v-col cols="12" md="3" sm="4" xl="2" xs="12">
                <h2 class="text-center">
                    <v-icon left style="vertical-align: baseline;">
                        {{ targetIcon(target) }}
                    </v-icon>
                    {{ $tc("theme", 2) }}
                </h2>
<!--                <Filters/>-->
            </v-col>
            <v-col ref="top" cols="12" md="9" sm="8" xl="10" xs="12">
                <LoadingOverlay :loading="loading" :margin="false" min-loader-height="auto">
                    <div v-if="pagination">
                        <h3>
                            {{ $tc("resultCount", pagination.itemCount) }}
                        </h3>
                        <v-divider/>
                    </div>

                    <v-row v-if="items && items.length > 0">
                        <v-col
                            v-for="item in items"
                            :key="item.id"
                            cols="12"
                            md="4"
                            sm="6"
                            xl="3"
                            xs="12"
                        >
                            <!-- card -->
                            <!--                            <ItemCard-->
                            <!--                                :item="theme"-->
                            <!--                                :show-props="['creator', 'description']"-->
                            <!--                                :type="type"-->
                            <!--                            />-->
                        </v-col>
                    </v-row>

                    <span v-else-if="!loading">{{ $t("noResults") }}</span>

                    <!-- pagination -->
                </LoadingOverlay>
            </v-col>
        </v-row>
    </PageBlank>
</template>

<script lang="ts">
import Vue from "vue";
import PageBlank from "@/components/page/Blank.vue";
import Filters from "@/components/Filters.vue";
import {targetIcon} from "@/assets/targets";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

export default Vue.extend({
    name: "PageResultsList",
    components: {LoadingOverlay, Filters, PageBlank},
    props: {
        items: {
            type: Array,
            required: true,
        },
        target: {
            type: String,
            required: true,
        },
        loading: {
            type: Boolean,
            required: true,
        },
    },
    methods: {
        targetIcon,
    },
});
</script>
