import Vue from "vue";

const nameREGEX = /[^a-zA-Z0-9_.]+/gm;

const escapeRegex = (s: string) => {
    return s.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
};

export default Vue.extend({
    computed: {
        id(): string | null {
            const array = this.$route.params.id.split("-");
            return array[array.length - 1] || null;
        },
    },
    methods: {
        createUrlString(id: string, name: string) {
            return `${name.replace(nameREGEX, " ").trim().replace(/\s/gm, "-")}-${id}`;
        },
        updateUrlString(id: string, name: string, target?: string) {
            let newPath = this.$route.path.replace(
                new RegExp(`/${escapeRegex(this.$route.params.id)}`),
                `/${this.createUrlString(id, name)}`,
            );

            if (target) {
                newPath = newPath.replace(
                    new RegExp(`/${escapeRegex(this.$route.params.target)}/`),
                    `/${target}/`,
                );
            }

            this.$router
                .replace({
                    path: newPath,
                    query: this.$route.query,
                })
                // Don't throw 'redundant navigation'
                .catch(() => {
                });
        },
    },
});
