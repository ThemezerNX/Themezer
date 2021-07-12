import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            termsOfService: [
                {
                    content: "Last modified: February 2, 2021",
                },
                {
                    title: this.$t("termsOfServices.ownership.title"),
                    content: this.$t("termsOfServices.ownership.content"),
                },
                {
                    title: this.$t("termsOfServices.copyright.title"),
                    content: this.$t("termsOfServices.copyright.content"),
                    list: [
                        {
                            title: this.$t("termsOfServices.copyright.contact"),
                            title_to: "/contact",
                        },
                    ],
                },
                {
                    title: this.$t("termsOfServices.abuse.title"),
                    content: this.$t("termsOfServices.abuse.content"),
                },
                {
                    title: this.$t("termsOfServices.nsfw.title"),
                    content: this.$t("termsOfServices.nsfw.content"),
                },
                {
                    title: this.$t("termsOfServices.accountTermination.title"),
                    content: this.$t("termsOfServices.accountTermination.content"),
                },
                {
                    title: this.$t("moreInfo.title"),
                    content: this.$t("moreInfo.content"),
                    list: [
                        {
                            title: this.$t("moreInfo.contact"),
                            title_to: "/contact",
                        },
                    ],
                },
            ],
        };
    },
});