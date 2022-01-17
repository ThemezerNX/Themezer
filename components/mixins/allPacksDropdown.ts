import Vue from "vue";
import {allPacks} from "~/graphql/Filtering.gql";

export default Vue.extend({
    // @ts-ignore
    apollo: {
        packList: {
            query: allPacks,
            prefetch: false,
            skip: true,
            variables() {
                return {
                    creators: [(this as any).theme.creator.id],
                    nsfw: true,
                };
            },
            result() {
                ;(this as any).$data.loading.packs = false;
            },
            update(data: any) {
                if (data?.packList) {
                    const packs = data.packList.map((p: any) => {
                        return {
                            text: p.details.name,
                            value: p.id,
                        };
                    });

                    return packs.sort((a: any, b: any) =>
                        a.text.toLowerCase().localeCompare(b.text.toLowerCase()),
                    );
                }
            },
        },
    },
});
