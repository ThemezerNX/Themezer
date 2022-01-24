<template>
    <v-app dark>
        <v-navigation-drawer
            v-model="drawer"
            app
            class="drawer"
            clipped
            fixed
            temporary
        >
            <div
                :style="
                  $store.state.profileColor
                    ? `background-color: ${$store.state.profileColor} !important;`
                    : ''
                "
                class="background transition-ease"
            />
            <v-list nav rounded>
                <v-list-item
                    v-if="!$auth.isAuthenticated"
                    class="my-2"
                    link
                    router
                    to="/login"
                    two-line
                >
                    <v-list-item-avatar>
                        <v-icon large>
                            mdi-account-circle
                        </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title class="text-wrap">
                            {{ $t("login") }} / {{ $t("register") }}
                        </v-list-item-title>
                    </v-list-item-content>
                    <v-icon>mdi-login</v-icon>
                </v-list-item>
                <v-list-group v-if="$auth.isAuthenticated" no-action>
                    <template #activator>
                        <v-list-item-avatar>
                            <img
                                v-if="$auth.isAuthenticated"
                                :src="
                                  `https://cdn.discordapp.com/${avatar}?size=64`
                                "
                                alt="avatar"
                            />
                            <v-icon v-else large>
                                mdi-account-circle
                            </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title class="text-wrap">
                                {{ $auth.user.username }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item
                        :to="`/creators/${$auth.user.id}`"
                        class="ml-11 pl-5"
                        dense
                        router
                    >
                        <v-list-item-title class="text-wrap">{{ $t("myProfile") }}</v-list-item-title>
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                    <v-list-item class="ml-11 pl-5" dense @click="logout()">
                        <v-list-item-title class="text-wrap">{{ $t("logout") }}</v-list-item-title>
                        <v-list-item-icon>
                            <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list-group>
                <template v-for="(item, i) in items">
                    <v-subheader
                        v-if="!!item.header"
                        :key="i"
                        :class="item.class"
                        class="mt-5"
                        inset
                        style="height: 24px;"
                    >
                        {{ item.header }}
                        <v-icon v-if="item.icon" right v-text="item.icon"/>
                    </v-subheader>

                    <v-divider
                        v-else-if="item.divider"
                        :key="i"
                        :class="item.class"
                        :inset="item.inset"
                        class="my-2"
                    />

                    <v-list-group
                        v-else-if="Array.isArray(item.menus)"
                        :key="i"
                        :class="item.class"
                    >
                        <template #activator>
                            <v-list-item-action>
                                <v-icon v-text="item.icon"/>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title class="text-wrap" v-text="item.title || $tc(item.langKey, 2)"/>
                            </v-list-item-content>
                        </template>
                        <template v-for="type in item.menus">
                            <v-list-item
                                :key="item.name + type.target"
                                :to="`/${item.name}/${type.target}`"
                                class="ml-11 pl-5"
                                dense
                                router
                            >
                                <v-list-item-title
                                    class="text-wrap"
                                    v-text="type.title || $t('target.' + type.langKey)"
                                />
                                <v-list-item-icon v-if="type.icon">
                                    <v-icon v-text="type.icon"/>
                                </v-list-item-icon>
                            </v-list-item>
                        </template>
                    </v-list-group>

                    <v-list-item
                        v-else
                        :key="i"
                        :class="item.class"
                        :href="item.href"
                        :to="item.to"
                        class="my-2"
                        rel="noopener"
                        router
                    >
                        <v-list-item-action>
                            <v-icon v-text="item.icon"/>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title class="text-wrap" v-text="item.title || $tc(item.langKey, 2)"/>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar
            v-scroll="handleScroll"
            :color="navbarColor"
            :elevate-on-scroll="this.$route.path === '/'"
            app
            class="navbar rounded-b"
            clipped-left
            fixed
            outlined
        >
            <v-app-bar-nav-icon aria-label="menu toggle" @click.stop="drawer = !drawer"/>
            <NuxtLink class="title-link mx-4 text-decoration-none text--primary" to="/">
                <v-toolbar-title class="d-flex title-text">
                    <v-img
                        class="mr-4 title-icon"
                        contain
                        src="/icon-64.png"
                        width="32"
                    />
                    {{ title }}
                </v-toolbar-title>
            </NuxtLink>
            <v-toolbar-items class="d-none d-md-flex">
                <v-btn
                    :depressed="true"
                    class="d-none d-lg-flex"
                    style="background-color: transparent"
                    to="/#additions"
                >
                    {{ recentAdditionsButton.title }}
                    <v-icon right>
                        {{ recentAdditionsButton.icon }}
                    </v-icon>
                </v-btn>
                <v-btn
                    v-for="target in targets"
                    :key="target.name"
                    :depressed="true"
                    :to="`/${target.name}`"
                    style="background-color: transparent"
                >
                    {{ $tc(target.langKey, 2) }}
                    <v-icon
                        :style="`margin-top: ${target.margin_top};`"
                        right
                    >
                        {{ target.icon }}
                    </v-icon>
                </v-btn>
            </v-toolbar-items>
            <v-spacer/>
            <v-toolbar-items>
                <v-menu bottom offset-y>
                    <template #activator="{ on, attrs }">
                        <v-btn
                            :depressed="true"
                            aria-label="random result"
                            style="background-color: transparent"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>mdi-shuffle</v-icon>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item
                            v-for="(item, i) in randomMenuItems"
                            :key="i"
                            @click="item.function"
                        >
                            <v-list-item-action>
                                <v-icon v-text="item.icon"/>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title class="text-wrap" v-text="item.title"/>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-menu>

                <v-menu bottom left offset-y>
                    <template #activator="{ on, attrs }">
                        <v-btn
                            :depressed="true"
                            aria-label="switch language"
                            style="background-color: transparent"
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon>mdi-translate</v-icon>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item
                            v-for="locale in availableLocales"
                            :key="locale.code"
                            :class="{ 'active-locale': $i18n.locale === locale.code }"
                            @click="$i18n.setLocale(locale.code)"
                        >
                            <v-list-item-content>
                                <v-list-item-title v-text="locale.name"/>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item href="https://translate.themezer.net/" target="_blank">
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ $t("helpTranslate") }}
                                    <v-icon right>mdi-open-in-new</v-icon>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-app-bar>

        <div class="splatter-wrapper">
            <img :src="require('@/assets/images/ink_splatter/magenta-400.png')" alt="" class="splatter splatter-2"/>
            <img :src="require('@/assets/images/ink_splatter/green-400.png')" alt="" class="splatter splatter-1"/>
        </div>

        <v-main>
            <nuxt/>
        </v-main>

        <v-footer absolute app class="footer text-caption" inset>
            <span class="pr-3">&copy; {{ new Date().getFullYear() }} ThemezerNX</span>
            <nuxt-link class="pr-3" to="/about">{{ $t("about") }}</nuxt-link>
            <a href="https://stats.uptimerobot.com/zx1G5uROYn" target="_blank">{{ $t("status") }}</a>
        </v-footer>
        <v-dialog
            v-if="$auth.isAuthenticated && $auth.user"
            v-model="acceptDialog"
            class="mx-auto"
            max-width="800"
            persistent
        >
            <v-card>
                <v-window v-model="step" touchless>
                    <v-window-item :value="0">
                        <v-card-title
                            class="title font-weight-regular justify-space-between"
                        >
                            <span>{{ $t("welcome") }}</span>
                        </v-card-title>

                        <v-card-text>
                            <p class="mb-4">
                                {{ $t("registerSuccessIntro") }}
                            </p>

                            <h1 class="mb-2">
                                {{ $t("termsOfService") }}
                            </h1>
                            <div v-for="item in tos" :key="item.title">
                                <h2>{{ item.title }}</h2>
                                <p>
                                    {{ item.content }}
                                </p>
                            </div>

                            <v-flex class="d-flex">
                                <v-spacer/>
                                <v-btn
                                    :disabled="!countdownFinished"
                                    color="secondary"
                                    rounded
                                    @click.prevent="step++"
                                >
                                    {{ $t("accept") }}
                                    <v-icon right>mdi-arrow-right</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-card-text>
                    </v-window-item>
                    <v-window-item :value="1">
                        <v-card-title
                            class="title font-weight-regular justify-space-between"
                        >
                            <span>{{ $t("backupCode") }}</span>
                        </v-card-title>

                        <v-card-text>
                            {{ $t("backupCodeExplanation") }}
                            <div>
                                {{ $t("backupCodeViewOnceWarning") }}
                            </div>
                            <v-flex class="d-flex">
                                <v-text-field
                                    ref="creatorId"
                                    v-model="$auth.user.id"
                                    class="my-5"
                                    hide-details
                                    outlined
                                    prepend-icon="mdi-identifier"
                                    readonly
                                    rounded
                                ></v-text-field>

                                <v-tooltip v-model="copyIdSuccess" top>
                                    <template #activator="{ attrs }">
                                        <v-btn
                                            class="align-self-center ml-2"
                                            rounded
                                            v-bind="attrs"
                                            @click="copyId"
                                        >
                                            {{ $t("copy") }}
                                        </v-btn>
                                    </template>
                                    <span>Copied!</span>
                                </v-tooltip>
                            </v-flex>
                            <v-flex class="d-flex">
                                <v-text-field
                                    ref="backupCode"
                                    v-model="backupCode"
                                    :append-icon="
                                        showBackupCode
                                          ? 'mdi-eye-off'
                                          : 'mdi-eye'
                                    "
                                    :type="showBackupCode ? 'text' : 'password'"
                                    class="my-5"
                                    hide-details
                                    outlined
                                    prepend-icon="mdi-key-variant"
                                    readonly
                                    rounded
                                    @click:append="
                                        () => (showBackupCode = !showBackupCode)
                                      "
                                ></v-text-field>

                                <v-tooltip v-model="copyCodeSuccess" top>
                                    <template #activator="{ attrs }">
                                        <v-btn
                                            class="align-self-center ml-2"
                                            rounded
                                            v-bind="attrs"
                                            @click="copyCode"
                                        >
                                            {{ $t("copy") }}
                                        </v-btn>
                                    </template>
                                    <span>Copied!</span>
                                </v-tooltip>
                            </v-flex>

                            <v-flex class="d-flex">
                                <v-btn
                                    color="secondary"
                                    rounded
                                    @click.prevent="step--"
                                >
                                    {{ $t("previous") }}
                                    <v-icon right>mdi-arrow-left</v-icon>
                                </v-btn>
                                <v-spacer/>
                                <v-btn
                                    :disabled="!backupCountdownFinished"
                                    :loading="loading.accept"
                                    color="secondary"
                                    rounded
                                    @click.prevent="accept()"
                                >
                                    {{ $t("finish") }}
                                    <v-icon right>mdi-check</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-card-text>
                    </v-window-item>
                </v-window>
            </v-card>
        </v-dialog>

        <Snackbar/>

        <client-only>
            <cookie-law>
                <div slot-scope="props">
                    <v-banner
                        color="grey darken-4"
                        elevation="0"
                        rounded
                        shaped
                    >
                        <v-icon
                            slot="icon"
                            color="warning"
                            size="36"
                        >
                            mdi-cookie
                        </v-icon>
                        {{ $t("cookieBanner") }}
                        <template #actions="">
                            <v-btn
                                color="primary"
                                rounded
                                text
                                to="/cookie-policy"
                            >
                                {{ $t("cookiePolicy") }}
                            </v-btn>
                            <v-btn
                                color="primary"
                                rounded
                                text
                                @click="props.accept"
                            >
                                {{ $t("dismiss") }}
                            </v-btn>
                        </template>
                    </v-banner>
                </div>
            </cookie-law>
        </client-only>
    </v-app>
</template>

<script>
import {updateAuth} from "@/graphql/Creator.gql";
import {randomPackIDs} from "@/graphql/Pack.gql";
import {randomThemeIDs} from "@/graphql/Theme.gql";
import {randomLayoutIDs} from "@/graphql/Layout.gql";
import targets from "@/assets/targets";
import tos from "@/components/mixins/termsOfService";

export default {
    data() {
        return {
            targets,
            title: process.env.APP_TITLE,
            drawer: false,
            transparentNavbar: true,
            acceptDialog: false,
            step: 0,
            tos,
            accepts: true,
            backupCode: null,
            showBackupCode: false,
            copyIdSuccess: false,
            copyCodeSuccess: false,
            countdownFinished: false,
            backupCountdownFinished: false,
            loading: {
                accept: false,
            },
        };
    },
    computed: {
        recentAdditionsButton() {
            return {
                icon: "mdi-plus-circle-multiple-outline",
                title: this.$t("home.recentAdditions"),
                class: "d-lg-none",
                to: "/#additions",
            };
        },
        items() {
            return [
                {
                    divider: true,
                    inset: false,
                },
                this.recentAdditionsButton,
                {
                    header: this.$t("browse") + ":",
                    class: "d-flex d-sm-none",
                },
                {
                    divider: true,
                    inset: true,
                    class: "d-flex d-sm-none",
                },
                ...targets,
                {
                    header: this.$t("upload") + ":",
                },
                {
                    divider: true,
                    inset: true,
                },
                {
                    icon: "mdi-format-color-fill",
                    title: this.$tc("theme") + "/" + this.$tc("pack"),
                    to: "/submit/theme",
                },
                {
                    icon: "mdi-code-json",
                    title: this.$tc("layout"),
                    to: "/submit/layout",
                },
                {
                    header: this.$t("tools") + ":",
                },
                {
                    divider: true,
                    inset: true,
                },
                {
                    icon: "mdi-web",
                    title: this.$t("onlineThemeCreator"),
                    to: "/tools/theme-creator",
                },
                {
                    icon: "mdi-nintendo-switch",
                    title: this.$t("themezerHBApp"),
                    href:
                        "https://github.com/suchmememanyskill/themezer-nx/releases",
                },
                {
                    icon: "mdi-image-edit-outline",
                    title: this.$t("overlayCreator"),
                    to: "/tools/overlay-creator",
                },
                {
                    icon: "mdi-application",
                    title: "LayoutKit",
                    href: "https://github.com/ThemezerNX/LayoutKit#readme",
                },
                {
                    header: this.$t("guides") + ":",
                },
                {
                    divider: true,
                    inset: true,
                },
                {
                    icon: "mdi-help-circle-outline",
                    title: this.$t("guideInstallThemes"),
                    href:
                        "https://nh-server.github.io/switch-guide/extras/theming/#installing-a-theme",
                },
                {
                    icon: "mdi-help-circle-outline",
                    title: this.$t("guideCreateThemes"),
                    href:
                        "https://nh-server.github.io/switch-guide/extras/theming/",
                },
                {
                    icon: "mdi-book-open-variant",
                    title: this.$t("guideCreateLayouts"),
                    href:
                        "https://layoutdocs.themezer.net/",
                },
                {
                    divider: true,
                    inset: true,
                },
                {
                    icon: "mdi-information-outline",
                    title: this.$t("about"),
                    to: "/about",
                },
                {
                    icon: "mdi-timeline-clock-outline",
                    title: this.$t("serviceStatus"),
                    href: "https://stats.uptimerobot.com/zx1G5uROYn",
                },
            ];
        },
        randomMenuItems() {
            return [
                {
                    icon: "mdi-package-variant-closed",
                    title: this.$t("item.randomPack"),
                    function: this.randomPack,
                },
                {
                    icon: "mdi-format-color-fill",
                    title: this.$t("item.randomTheme"),
                    function: this.randomTheme,
                },
                {
                    icon: "mdi-code-json",
                    title: this.$t("item.randomLayout"),
                    function: this.randomLayout,
                },
            ];
        },
        navbarColor() {
            if (this.$route.path === "/" && this.transparentNavbar) {
                return "transparent";
            } else if (!!this.$store.state.profileColor) {
                return this.$store.state.profileColor;
            }
        },
        avatar() {
            if (this.$auth.isAuthenticated && this.$auth.user.avatar) {
                return `avatars/${this.$auth.user.id}/${this.$auth.user.avatar}`;
            } else if (this.$auth.isAuthenticated) {
                return `embed/avatars/${parseInt(
                    this.$auth.user.discriminator,
                ) % 5}.png`;
            } else return null;
        },
        availableLocales() {
            return this.$i18n.locales;
        },
    },
    watch: {
        acceptDialog() {
            setTimeout(() => {
                this.countdownFinished = true;
            }, 10000);
        },
        step(n) {
            if (n === 1) {
                setTimeout(() => {
                    this.backupCountdownFinished = true;
                }, 10000);
            }
        },
    },
    mounted() {
        if (this.$auth.isAuthenticated) {
            this.loading.accept = true;
            this.$apollo
                .mutate({
                    mutation: updateAuth,
                })
                .then(({data}) => {
                    this.loading.accept = false;
                    if (data.updateAuth) {
                        if (data.updateAuth.has_accepted === true) {
                            this.accepts = true;
                        } else {
                            this.accepts = false;
                            this.acceptDialog = true;
                            this.backupCode = data.updateAuth.backup_code;
                        }
                    }
                })
                .catch((err) => {
                    this.$snackbar.error(err);
                    this.loading.accept = false;
                });
        }
    },
    beforeDestroy() {
        this.observer.disconnect();
    },
    methods: {
        handleScroll(event) {
            if (typeof window === "undefined") return;
            const top = window.pageYOffset || event.target.scrollTop || 0;
            this.transparentNavbar = top === 0;
        },
        randomPack() {
            this.$apollo
                .query({
                    query: randomPackIDs,
                    fetchPolicy: "no-cache",
                })
                .then(({data}) => {
                    this.$router.push(`/packs/${data.randomPackIDs[0]}`);
                })
                .catch((err) => {
                    this.$snackbar.error(err);
                });
        },
        randomTheme() {
            this.$apollo
                .query({
                    query: randomThemeIDs,
                    fetchPolicy: "no-cache",
                })
                .then(({data}) => {
                    this.$router.push(`/themes/-/${data.randomThemeIDs[0]}`);
                })
                .catch((err) => {
                    this.$snackbar.error(err);
                });
        },
        randomLayout() {
            this.$apollo
                .query({
                    query: randomLayoutIDs,
                    fetchPolicy: "no-cache",
                })
                .then(({data}) => {
                    this.$router.push(`/layouts/-/${data.randomLayoutIDs[0]}`);
                })
                .catch((err) => {
                    this.$snackbar.error(err);
                });
        },
        logout() {
            return this.$auth.logout("social")
                .then(() => {
                    this.$router.push("/logged-out");
                })
                .catch((err) => {
                    this.$snackbar.error(err);
                });
        },
        accept() {
            this.loading.accept = true;
            this.$apollo
                .mutate({
                    mutation: updateAuth,
                    variables: {
                        accepts: true,
                    },
                })
                .then(({data}) => {
                    this.loading.accept = false;
                    if (data.updateAuth) {
                        if (data.updateAuth.has_accepted === true) {
                            this.accepts = true;
                            this.acceptDialog = false;
                            this.backupCode = null;
                        }
                    }
                })
                .catch((err) => {
                    this.$snackbar.error(err);
                    this.loading.accept = false;
                });
        },
        copyCode() {
            navigator.clipboard
                .writeText(this.backupCode)
                .then(() => {
                    this.copyCodeSuccess = true;
                    setTimeout(() => {
                        this.copyCodeSuccess = false;
                    }, 2000);
                })
                .catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log("Something went wrong, unable to copy", e);
                });
        },
        copyId() {
            navigator.clipboard
                .writeText(this.$auth.user.id)
                .then(() => {
                    this.copyIdSuccess = true;
                    setTimeout(() => {
                        this.copyIdSuccess = false;
                    }, 2000);
                })
                .catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log("Something went wrong, unable to copy", e);
                });
        },
    },
};
</script>

<style lang="scss">
@import "~assets/default";
</style>

<style lang="scss" scoped>
//$border-radius: 20px;

.drawer {
    user-select: none;
    //border-radius: 0 $border-radius $border-radius 0 !important;

    .background {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: -5;

        transition: all .25s ease;
        transition-property: background-color;
        transition-duration: 0.2s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1),
        cubic-bezier(0.4, 0, 0.2, 1);
        transition-delay: 0s;
    }
}

.navbar {
    user-select: none;
    background: transparent;
    //border-radius: 0 0 $border-radius $border-radius !important;

    .title-icon {
        //border-radius: $icon-border-radius;
        height: fit-content;
        margin: auto;
    }

    .title-text {
        font-weight: 700;
        font-family: Arial, serif;
        font-size: 28px;
    }
}

.footer {
    user-select: none;
    //border-radius: $border-radius $border-radius 0 0 !important;
    box-shadow: 0px -2px 4px -1px rgb(0 0 0 / 20%), 0px -4px 5px 0px rgb(0 0 0 / 14%), 0px -1px 10px 0px rgb(0 0 0 / 12%) !important;
}

.splatter {
    position: fixed;
    transform: scale(0.9);

    &.splatter-1 {
        opacity: 0;
        rotate: (-73deg);
        animation: fadeIn 600ms, scaleIn 600ms, turnSplatter1 600ms;
        animation-iteration-count: 1;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
        animation-delay: 2100ms;

        transform-origin: left;

        min-height: 170vh;
        height: auto;
        min-width: 85vw;
        width: auto;
        left: 0;
        top: 5%;
    }

    &.splatter-2 {
        opacity: 0;
        rotate: (36deg);
        animation: fadeIn 600ms, scaleIn 600ms, turnSplatter2 600ms;
        animation-iteration-count: 1;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
        animation-delay: 1600ms;

        transform-origin: right;

        min-height: 130vh;
        height: auto;
        min-width: 75vw;
        width: auto;
        right: -6vw;
        top: 10%;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 0.6;
        }
    }

    @keyframes scaleIn {
        0% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1.0);
        }
    }

    @keyframes turnSplatter1 {
        0% {
            rotate: (-73deg);
        }
        100% {
            rotate: (-70deg);
        }
    }

    @keyframes turnSplatter2 {
        0% {
            rotate: (36deg);
        }
        100% {
            rotate: (35deg);
        }
    }

}

.splatter-wrapper {
    top: 0;
    left: 0;
    position: fixed;
}

// Cookie banner
.Cookie > * {
    margin: 0 !important;
    width: 100% !important;
}

.Cookie--base {
    background: unset !important;
    padding: unset !important;
}

.active-locale {
    background-color: rgba(255, 255, 255, 0.2);
}

</style>
