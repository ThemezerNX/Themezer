import Vue from "vue";

export default Vue.extend({
    computed() {
        return {
            submitInfo: [
                {
                    title: this.$t("submitInfo.screenshots.title"),
                    content: this.$t("submitInfo.screenshots.content"),
                },
                {
                    title: this.$t("submitInfo.language.title"),
                    content: this.$t("submitInfo.language.content"),
                },
                {
                    title: this.$t("submitInfo.special.title"),
                    content: this.$t("submitInfo.special.content"),
                    list: [
                        {
                            title: `${this.$tc("theme", 2)}/${this.$tc("pack", 2)}`,
                            content: this.$t("submitInfo.special.themes.content"),
                        },
                        {
                            title: this.$tc("layout", 2),
                            content: this.$t("submitInfo.special.layouts.content"),
                        },
                    ],
                },
                {
                    title: this.$t("submitInfo.notDetect.title"),
                    content: this.$t("submitInfo.notDetect.content"),
                },
                {
                    title: this.$tc("faq"),
                    list: [
                        {
                            title: this.$t("submitInfo.faq.notAuthor.title"),
                            content: this.$t("submitInfo.faq.notAuthor.content"),
                        },
                        {
                            title: this.$t("submitInfo.faq.notAvailable.title"),
                            content: this.$t("submitInfo.faq.notAvailable.content"),
                        },
                        {
                            title: this.$t("submitInfo.faq.modified.title"),
                            content: this.$t("submitInfo.faq.modified.content"),
                        },
                        {
                            title: this.$t("submitInfo.faq.notSubmit.title"),
                            content: this.$t("submitInfo.faq.notSubmit.content"),
                        },
                    ],
                },
            ],
        };
    },
});
