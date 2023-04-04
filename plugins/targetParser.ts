import {Plugin} from "@nuxt/types";
import {NuxtI18nInstance} from "@nuxtjs/i18n";
import {
    isNice,
    isTarget,
    isTheme,
    isWeb,
    stripExtension,
    toTarget,
    toTheme,
    toTitleId,
    toWeb,
} from "@themezernx/target-parser/dist";

class TargetParser {
    private readonly i18n: NuxtI18nInstance;

    constructor(i18n: NuxtI18nInstance) {
        this.i18n = i18n;
    }

    isNice = isNice;
    isTarget = isTarget;
    isTheme = isTheme;
    isWeb = isWeb;
    stripExtension = stripExtension;

    toNice(string: string): string | null {
        switch (toTarget(string)) {
            case "common":
                return this.i18n.t("target.common").toString()
            case "ResidentMenu":
                return this.i18n.t("target.homemenu").toString()
            case "Entrance":
                return this.i18n.t("target.lockscreen").toString()
            case "MyPage":
                return this.i18n.t("target.userpage").toString()
            case "Flaunch":
                return this.i18n.t("target.allapps").toString()
            case "Set":
                return this.i18n.t("target.settings").toString()
            case "Notification":
                return this.i18n.t("target.news").toString();
            case "Psl":
                return this.i18n.t("target.playerselect").toString();

            default:
                return null;
        }
    }

    toTarget = toTarget;
    toTheme = toTheme;
    toTitleId = toTitleId;
    toWeb = toWeb;

}

const plugin: Plugin = ({i18n}, inject) => {
    inject("targetParser", new TargetParser(i18n));
};

export default plugin;

declare module "vue/types/vue" {
    interface Vue {
        $targetParser: TargetParser;
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        $targetParser: TargetParser;
    }

    interface Context {
        $targetParser: TargetParser;
    }
}


