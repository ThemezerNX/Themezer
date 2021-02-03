<template>
    <v-app dark>
        <v-navigation-drawer
            v-if="true"
            v-model="drawer"
            app
            class="drawer"
            clipped
            fixed
        >
            <div
                :style="
					$store.state.profileColor
						? `background-color: ${$store.state.profileColor} !important;`
						: ''
				"
                class="background"
            />
            <v-list nav rounded>
                <v-list-item
                    v-if="!$auth.loggedIn"
                    class="my-2"
                    link
                    router
                    two-line
                    @click="$auth.loginWith('social')"
                >
                    <v-list-item-avatar>
                        <v-icon large>
                            mdi-account-circle
                        </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>
                            Login / register
                        </v-list-item-title>
                    </v-list-item-content>
                    <v-icon>mdi-login</v-icon>
                </v-list-item>
                <v-list-group v-if="$auth.loggedIn" no-action>
                    <template v-slot:activator>
                        <v-list-item-avatar>
                            <img
                                v-if="$auth.loggedIn"
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
                            <v-list-item-title>
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
                        <v-list-item-title>My Profile</v-list-item-title>
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                    <v-list-item class="ml-11 pl-5" dense @click="logout()">
                        <v-list-item-title>Logout</v-list-item-title>
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
                        <template v-slot:activator>
                            <v-list-item-action>
                                <v-icon v-text="item.icon"/>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.title"/>
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
                                    class="text-capitalize"
                                    v-text="type.title"
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
                            <v-list-item-title v-text="item.title"/>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar
            :style="
				$store.state.profileColor
					? `background-color: ${$store.state.profileColor} !important;`
					: ''
			"
            app
            class="navbar"
            clipped-left
            fixed
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <NuxtLink class="title-link mx-6" to="/">
                <v-toolbar-title class="d-flex title-text">
                    <v-img
                        class="mr-4"
                        contain
                        src="/icon-filled-64.png"
                        style="border-radius: 5px;"
                        width="32"
                    />
                    {{ title }}
                </v-toolbar-title>
            </NuxtLink>
            <v-toolbar-items class="d-none d-sm-flex">
                <v-btn
                    v-for="target in targets"
                    :key="target.name"
                    :depressed="true"
                    :to="`/${target.name}`"
                    style="background-color: transparent"
                >
                    {{ target.title }}
                    <v-icon
                        :style="`margin-top: ${target.margin_top};`"
                        right
                    >{{ target.icon }}
                    </v-icon
                    >
                </v-btn>
            </v-toolbar-items>
            <v-spacer/>
            <v-toolbar-items>
                <v-menu bottom left offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            v-bind="attrs"
                            v-on="on"
                            :depressed="true"
                            style="background-color: transparent"
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
                                <v-list-item-title v-text="item.title"/>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-app-bar>

        <img alt="" v-show="true" :src="require('~/assets/ink_splatter/550393.svg')" class="splatter splatter-2"/>
        <img alt="" v-show="true" :src="require('~/assets/ink_splatter/550391.svg')" class="splatter splatter-1"/>

        <v-main>
            <nuxt/>
        </v-main>

        <v-footer absolute app inset>
            <span class="pr-3">&copy; {{ new Date().getFullYear() }} Themezer</span>
            <nuxt-link class="pr-3" to="/about">About</nuxt-link>
            <a href="https://status.themezer.net/" target="_blank">Status</a>
        </v-footer>
        <v-dialog
            v-if="$auth.loggedIn && $auth.user"
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
                            <span>Welcome to Themezer!</span>
                        </v-card-title>

                        <v-card-text>
                            <p class="mb-4">
                                Now you can finally upload your themes! But...
                                there are a few rules here on Themezer:
                            </p>

                            <h1 class="mb-2">
                                Terms of Service
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
                                    Accept
                                    <v-icon right>mdi-arrow-right</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-card-text>
                    </v-window-item>
                    <v-window-item :value="1">
                        <v-card-title
                            class="title font-weight-regular justify-space-between"
                        >
                            <span>Backup Code</span>
                        </v-card-title>

                        <v-card-text>
                            In order to ensure you retain access to you Themezer
                            account if anything happens to your Discord account,
                            here is your creator ID and a backup code you can
                            use in order to restore your account and connect a
                            new Discord account. Be sure to store this backup
                            code somewhere safe! The creator ID can also be
                            found in the url of the creator page of your
                            previous Themezer account. To restore your account,
                            visit the about page.
                            <div>
                                THIS IS THE ONLY TIME YOU CAN VIEW THIS BACKUP
                                CODE!
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
                                    <template v-slot:activator="{ attrs }">
                                        <v-btn
                                            v-bind="attrs"
                                            class="align-self-center ml-2"
                                            rounded
                                            @click="copyId"
                                        >copy
                                        </v-btn
                                        >
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
                                    <template v-slot:activator="{ attrs }">
                                        <v-btn
                                            v-bind="attrs"
                                            class="align-self-center ml-2"
                                            rounded
                                            @click="copyCode"
                                        >copy
                                        </v-btn
                                        >
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
                                    Previous
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
                                    Finish
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
                        This website uses cookies to ensure you get the best experience.
                        By continuing the use of this website you agree to our use of cookies.
                        <template v-slot:actions="">
                            <v-btn
                                text
                                color="primary"
                                rounded
                                to="/cookie-policy"
                            >
                                Cookie Policy
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="props.accept"
                                rounded
                            >
                                Dismiss
                            </v-btn>
                        </template>
                    </v-banner>
                </div>
            </cookie-law>
        </client-only>
    </v-app>
</template>

<script>
import {updateAuth} from '@/graphql/Creator.gql'
import {randomPackIDs} from '@/graphql/Pack.gql'
import {randomThemeIDs} from '@/graphql/Theme.gql'
import {randomLayoutIDs} from '@/graphql/Layout.gql'
import targets from '@/assets/targets'
import tos from '~/assets/lang/termsOfService'

export default {
    data() {
        return {
            targets,
            title: process.env.APP_TITLE,
            drawer: false,
            error: null,
            items: [
                {
                    header: 'Download',
                    icon: 'mdi-download',
                    class: 'd-flex d-sm-none'
                },
                {
                    divider: true,
                    inset: true,
                    class: 'd-flex d-sm-none'
                },
                ...targets,
                {
                    header: 'Submit:',
                },
                {
                    divider: true,
                    inset: true
                },
                {
                    icon: 'mdi-format-color-fill',
                    title: 'Theme/Pack',
                    to: '/submit/theme'
                },
                {
                    icon: 'mdi-code-json',
                    title: 'Layout',
                    to: '/submit/layout'
                },
                {
                    header: 'Tools:',
                },
                {
                    divider: true,
                    inset: true
                },
                {
                    icon: 'mdi-image-edit-outline',
                    title: 'Overlay Creator',
                    to: '/tools/overlaycreator'
                },
                {
                    icon: 'mdi-web',
                    title: 'Online Theme Creator',
                    href: 'https://exelix11.github.io/SwitchThemeInjector/v2/'
                },
                {
                    icon: 'mdi-application',
                    title: 'Themezer NX App',
                    href:
                        'https://github.com/suchmememanyskill/themezer-nx/releases'
                },
                {
                    header: 'Guides:',
                },
                {
                    divider: true,
                    inset: true
                },
                {
                    icon: 'mdi-help-circle-outline',
                    title: 'Installing Themes',
                    href:
                        'https://nh-server.github.io/switch-guide/extras/theming/#installing-a-theme'
                },
                {
                    icon: 'mdi-help-circle-outline',
                    title: 'Creating Themes/Fonts',
                    href:
                        'https://nh-server.github.io/switch-guide/extras/theming/'
                },
                {
                    icon: 'mdi-help-circle-outline',
                    title: 'Creating Layouts',
                    href:
                        'https://github.com/FuryBaguette/SwitchLayoutEditor/wiki'
                },
                {
                    divider: true,
                    inset: true
                },
                {
                    icon: 'mdi-information-outline',
                    title: 'About',
                    to: '/about'
                },
                {
                    icon: 'mdi-timeline-clock-outline',
                    title: 'Status',
                    href: 'https://status.themezer.net/'
                }
            ],
            randomMenuItems: [
                {
                    icon: 'mdi-package-variant-closed',
                    title: 'Random Pack',
                    function: this.randomPack
                },
                {
                    icon: 'mdi-format-color-fill',
                    title: 'Random Theme',
                    function: this.randomTheme
                },
                {
                    icon: 'mdi-code-json',
                    title: 'Random Layout',
                    function: this.randomLayout
                }
            ],
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
                accept: false
            }
        }
    },
    computed: {
        avatar() {
            if (this.$auth.loggedIn && this.$auth.user.avatar) {
                return `avatars/${this.$auth.user.id}/${this.$auth.user.avatar}`
            } else if (this.$auth.loggedIn) {
                return `embed/avatars/${parseInt(
                    this.$auth.user.discriminator
                ) % 5}.png`
            } else return null
        }
    },
    watch: {
        acceptDialog() {
            setTimeout(() => {
                this.countdownFinished = true
            }, 10000)
        },
        step(n) {
            if (n === 1) {
                setTimeout(() => {
                    this.backupCountdownFinished = true
                }, 10000)
            }
        }
    },
    mounted() {
        if (this.$auth.loggedIn) {
            this.loading.accept = true
            this.$apollo
                .mutate({
                    mutation: updateAuth
                })
                .then(({data}) => {
                    this.loading.accept = false
                    if (data.updateAuth) {
                        if (data.updateAuth.has_accepted === true) {
                            this.accepts = true
                        } else {
                            this.accepts = false
                            this.acceptDialog = true
                            this.backupCode = data.updateAuth.backup_code
                        }
                    }
                })
                .catch((err) => {
                    this.$snackbar.error(err)

                    this.loading.accept = false
                })
        }
    },
    methods: {
        randomPack() {
            this.$apollo
                .query({
                    query: randomPackIDs,
                    fetchPolicy: 'no-cache'
                })
                .then(({data}) => {
                    this.$router.push(`/packs/${data.randomPackIDs[0]}`)
                })
                .catch((err) => {
                    this.$snackbar.error(err)
                })
        },
        randomTheme() {
            this.$apollo
                .query({
                    query: randomThemeIDs,
                    fetchPolicy: 'no-cache'
                })
                .then(({data}) => {
                    this.$router.push(`/themes/_/${data.randomThemeIDs[0]}`)
                })
                .catch((err) => {
                    this.$snackbar.error(err)
                })
        },
        randomLayout() {
            this.$apollo
                .query({
                    query: randomLayoutIDs,
                    fetchPolicy: 'no-cache'
                })
                .then(({data}) => {
                    this.$router.push(`/layouts/_/${data.randomLayoutIDs[0]}`)
                })
                .catch((err) => {
                    this.$snackbar.error(err)
                })
        },
        logout() {
            this.error = null
            return this.$auth.logout('social').catch((e) => {
                this.error = e.response.data
            })
        },
        accept() {
            this.loading.accept = true
            this.$apollo
                .mutate({
                    mutation: updateAuth,
                    variables: {
                        accepts: true
                    }
                })
                .then(({data}) => {
                    this.loading.accept = false
                    if (data.updateAuth) {
                        if (data.updateAuth.has_accepted === true) {
                            this.accepts = true
                            this.acceptDialog = false
                            this.backupCode = null
                        }
                    }
                })
                .catch((err) => {
                    this.$snackbar.error(err)
                    this.loading.accept = false
                })
        },
        copyCode() {
            navigator.clipboard
                .writeText(this.backupCode)
                .then(() => {
                    this.copyCodeSuccess = true
                    setTimeout(() => {
                        this.copyCodeSuccess = false
                    }, 2000)
                })
                .catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log('Something went wrong, unable to copy', e)
                })
        },
        copyId() {
            navigator.clipboard
                .writeText(this.$auth.user.id)
                .then(() => {
                    this.copyIdSuccess = true
                    setTimeout(() => {
                        this.copyIdSuccess = false
                    }, 2000)
                })
                .catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log('Something went wrong, unable to copy', e)
                })
        }
    }
}
</script>

<style lang="scss">
@import 'assets/variables.scss';

$border-radius: 10px;

html {
    word-break: break-word !important;
    background: #272727;
}

.page-enter-active,
.page-leave-active {
    transition-property: opacity;
    transition-timing-function: ease-out;
    transition-duration: 50ms;
}

.row {
    margin: 0 -12px !important;
}

.page-enter,
.page-leave-to {
    opacity: 0;
}

.v-list-group__header.v-list-item {
    margin-bottom: 8px !important;
}

.v-menu__content {
    .v-card {
        background-color: #424242 !important;
    }
}

.v-card {
    border-radius: $border-radius !important;
}

.v-card__subtitle,
.v-card__text,
.v-card__title {
    word-break: break-word !important;
}

.v-slide-group__content {
    padding-top: 6px;
    padding-bottom: 6px;
}

.v-slide-group__wrapper {
    touch-action: inherit !important;
}

.smAndDown .v-slide-group__prev,
.smAndDown .v-slide-group__next {
    min-width: unset;
    max-width: fit-content;
}

.v-parallax__image-container {
    background: url('/images/diagonal_joycon-180.png') #333;
    background-repeat: repeat;
    animation: flow 45s linear infinite;
}

.card .v-image__image--preload,
.placeholder {
    background: url('/images/diagonal_joycon-180.png') #333;
    background-repeat: repeat;
    animation: flow 8s linear infinite;
}

.placeholder {
    border-radius: $border-radius;
}

.box_fill .v-image__image--preload,
.box .v-image__image--preload {
    background: url('/images/diagonal_joycon-180.png') #333;
    background-repeat: repeat;
    animation: flow 30s linear infinite;
}

.v-autocomplete__content.v-menu__content {
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
    border-radius: $border-radius !important;
}

.v-select.v-input--dense .v-input__append-inner {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: -15px;
}

.v-select.v-input--dense .v-chip {
    margin: 4px 0 !important;
}

//For some reason this is missing in a build
.v-btn__content .v-icon--left,
.v-btn__content .v-icon--right {
    font-size: 18px !important;
    height: 18px !important;
    width: 18px !important;
}

@keyframes flow {
    from {
        background-position: bottom left;
    }
    to {
        background-position: top right;
    }
}

.box {
    background-color: #1e1e1e;
    border-radius: $border-radius !important;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);

    &_fill {
        @extend .box;
        min-height: 100%;
    }

    .overlay-image {
        background-size: contain;
        background-position: center;
        border-radius: $border-radius;
    }

    .box_text {
        margin-left: 8px;
        margin-right: 8px;
    }

    h2.box_text {
        margin-top: 16px;
    }
}

::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #1e1e1e;
}

::-webkit-scrollbar {
    width: 6px;
    background-color: #1e1e1e;
}

::-webkit-scrollbar-thumb {
    background-color: #4e4e4e;
}
</style>

<style lang="scss" scoped>
.drawer {
    user-select: none;

    .background {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: -5;

        transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1) background-color;
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

    .title-link {
        text-decoration: none;
    }

    .title-text {
        color: white !important;
    }
}

.splatter {

    top: 0;
    position: fixed;

    &.splatter-1 {
        opacity: 0;
        transform: scale(0.9);
        rotate: (-75deg);
        animation: fadeIn 600ms, scaleIn 600ms, turnSplatter1 600ms;
        animation-iteration-count: 1;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
        animation-delay: 2100ms;

        min-height: 800px;
        height: 120vh;
        min-width: 100vw;
        left: -20vw;
    }

    &.splatter-2 {
        opacity: 0;
        transform: scale(0.9);
        rotate: (40deg);
        animation: fadeIn 600ms, scaleIn 600ms, turnSplatter2 600ms;
        animation-iteration-count: 1;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
        animation-delay: 1600ms;

        height: 120vh;
        min-height: 800px;
        min-width: 60vw;
        right: -6vw;
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 0.9;
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
            rotate: (-75deg);
        }
        100% {
            rotate: (-70deg);
        }
    }

    @keyframes turnSplatter2 {
        0% {
            rotate: (40deg);
        }
        100% {
            rotate: (35deg);
        }
    }

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

</style>
