import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            rules: {
                required: (value: any) => !!value || this.$t("rules.required"),
                utf8_only: (input: any) => {
                    if (!input) return true;
                    let output = "";
                    input = input.toString();
                    for (let i = 0; i < input.length; i++) {
                        if (input.charCodeAt(i) <= 127) {
                            output += input.charAt(i);
                        }
                    }
                    return input === output || this.$t("rules.utf8Only");
                },
                description_length: (value: string) =>
                    !value ||
                    (value.trim().length >= 10 && value.trim().length <= 500) ||
                    this.$t("rules.characterLength", {field: this.$t("fields.description"), min: 10, max: 500}),
                name_length: (value: string) =>
                    !value ||
                    (value.trim().length >= 3 && value.trim().length <= 50) ||
                    this.$t("rules.characterLength", {field: this.$t("fields.name"), min: 3, max: 50}),
                category_length: (values: Array<string>) =>
                    !values ||
                    !values.some((v) => v.trim().length < 2) ||
                    this.$t("rules.characterLengthMin", {field: this.$t("fields.category"), count: 2}),
                min_category_amount: (values: Array<string>) =>
                    !values || values.length > 0 || this.$t("categoryMin", {count: 1}),
                max_category_amount: (values: Array<string>) =>
                    !values ||
                    values.length <= 10 || this.$t("categoryMax", {count: 10}),
                hex: (value: string) =>
                    !value ||
                    (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
                        ? true
                        : this.$t("rules.invalid", {field: this.$t("fields.hex")})),
                banner_size: (file: File) =>
                    !file || file.size < 1048576 || this.$t("rules.maxImageSize", {max: "1 MB"}),
                logo_size: (file: File) =>
                    !file || file.size < 1048576 || this.$t("rules.maxImageSize", {max: "1 MB"}),
                creatorId: (value: any) =>
                    !value || (!isNaN(value) ? true : this.$t("rules.invalid", {field: this.$t("fields.id")})),
                notOwnCreatorId: (value: any) =>
                    !value ||
                    (!(this.$auth.user?.id === value)
                        ? true
                        : this.$t("rules.notOwnCreatorId"))
            },
        };
    },
});
