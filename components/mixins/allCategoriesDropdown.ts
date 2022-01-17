import Vue from "vue";
import {allCategories} from "~/graphql/Filtering.gql";

export default Vue.extend({
    data() {
        return {
            currentThemeTarget: null,
            packCategories: [],
        };
    },
    // @ts-ignore
    apollo: {
        categories: {
            query: allCategories,
            prefetch: false,
            skip: true,
            result() {
                ;(this as any).$data.loading.categories = false;
            },
            update(res: any) {
                return res?.categories.sort((a: string, b: string) =>
                    a.toLowerCase().localeCompare(b.toLowerCase()),
                );
            },
        },
    },
    watch: {
        packCategories() {
            ;(this as any).detectedThemes?.forEach((t: any) => {
                t.categories = (this as any).packCategories;
            });
        },
    },
});
