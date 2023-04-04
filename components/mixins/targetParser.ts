import Vue from "vue";

export default Vue.extend({

    methods: {
        target(): string | null {
            return this.$route.params.target;
        },
        targetName(): string | null {
            switch (this.$route.params.target) {
                case "homemenu":
                    return this.$t("target.homemenu") as string;
                case "lockscreen":
                    return this.$t("target.lockscreen") as string;
                case "userpage":
                    return this.$t("target.userpage") as string;
                case "allapps":
                    return this.$t("target.allapps") as string;
                case "settings":
                    return this.$t("target.settings") as string;
                case "news":
                    return this.$t("target.news") as string;
                case "playerselect":
                    return this.$t("target.playerselect") as string;

                default:
                    return null;
            }
        },
        targetFile(): string | null {
            switch (this.$route.params.target) {
                case "homemenu":
                    return "ResidentMenu";
                case "lockscreen":
                    return "Entrance";
                case "userpage":
                    return "MyPage";
                case "allapps":
                    return "Flaunch";
                case "settings":
                    return "Set";
                case "news":
                    return "Notification";
                case "playerselect":
                    return "Psl";

                default:
                    return null;
            }
        },
        fileNameToWebName(s: string): string | null {
            switch (s) {
                case "ResidentMenu.szs":
                case "ResidentMenu":
                    return "homemenu";
                case "Entrance.szs":
                case "Entrance":
                    return "lockscreen";
                case "MyPage.szs":
                case "MyPage":
                    return "userpage";
                case "Flaunch.szs":
                case "Flaunch":
                    return "allapps";
                case "Set.szs":
                case "Set":
                    return "settings";
                case "Notification.szs":
                case "Notification":
                    return "news";
                case "Psl.szs":
                case "Psl":
                    return "playerselect";

                default:
                    return null;
            }
        },
        toNiceWebName(s: string): string | null {
            switch (s) {
                case "homemenu":
                case "ResidentMenu.szs":
                case "ResidentMenu":
                    return this.$t("target.homemenu") as string;
                case "lockscreen":
                case "Entrance.szs":
                case "Entrance":
                    return this.$t("target.lockscreen") as string;
                case "userpage":
                case "MyPage.szs":
                case "MyPage":
                    return this.$t("target.userpage") as string;
                case "allapps":
                case "Flaunch.szs":
                case "Flaunch":
                    return this.$t("target.allapps") as string;
                case "settings":
                case "Set.szs":
                case "Set":
                    return this.$t("target.settings") as string;
                case "news":
                case "Notification.szs":
                case "Notification":
                    return this.$t("target.news") as string;
                case "playerselect":
                case "Psl.szs":
                case "Psl":
                    return this.$t("target.playerselect") as string;

                default:
                    return null;
            }
        },
    },
});
