<template>
    <v-layout align-center column justify-center pa-3>
        <v-card class="box" max-width="600" style="border-radius: 20px;">
            <v-card-title class="headline">
                {{ $t("about") }}
            </v-card-title>
            <v-card-text>
                <p>
                    {{ $t("themezerIntro") }}
                </p>
                <p>
                    <i18n path="abouts.sourceCode">
                        <template v-slot:githubHref>
                            <a
                                href="https://github.com/ThemezerNX"
                                rel="noopener"
                                target="_blank"
                                title="discord"
                            >ThemezerNX GitHub</a>
                        </template>
                    </i18n>
                </p>
                <p>
                    <i18n path="abouts.certifiedBadge">
                        <template v-slot:certifiedBadge>
                            <CertifiedBadge inline/>
                        </template>
                    </i18n>
                </p>
                <p class="mt-4">
                    {{ $t("restore.prompt") }}
                    <v-btn
                        color="primary"
                        rounded
                        text
                        @click="restoreDialog = true"
                    >
                        {{ $t("clickHere") }}
                    </v-btn>
                </p>
                <p>
                    {{ $t("abouts.notAffiliated") }}
                </p>
                <hr class="mb-2"/>
                <span class="pr-3">&copy; {{ new Date().getFullYear() }} Themezer</span>
                <nuxt-link class="pr-3" to="/contact">{{ $t("contact") }}</nuxt-link>
                <nuxt-link class="pr-3" to="/terms-of-service">{{ $t("termsOfService") }}</nuxt-link>
                <nuxt-link class="pr-3" to="/privacy-policy">{{ $t("privacyPolicy") }}</nuxt-link>
                <nuxt-link class="pr-3" to="/cookie-policy">{{ $t("cookiePolicy") }}</nuxt-link>
                <a href="https://stats.uptimerobot.com/zx1G5uROYn" rel="noopener" target="_blank">{{ $t("status") }}</a>
            </v-card-text>
        </v-card>
        <v-dialog v-model="restoreDialog" class="mx-auto" max-width="800">
            <v-card>
                <v-card-title
                    class="title font-weight-regular justify-space-between"
                >
                    <span>{{ $t("restore.title") }}</span>
                    <v-spacer></v-spacer>

                    <v-btn icon rounded @click="restoreDialog = false">
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    {{ $t("restore.description") }}
                    <v-form v-model="restoreValid">
                        <v-text-field
                            v-model="creatorId"
                            :disabled="!$auth.loggedIn"
                            :error-messages="
								!$auth.loggedIn
									? [$t('loginRequired')]
									: []
							"
                            :rules="[
								rules.required,
								rules.creatorId,
								rules.notOwnCreatorId
							]"
                            class="mt-5"
                            :label="$t('restore.previousId')"
                            outlined
                            prepend-icon="mdi-identifier"
                            rounded
                        ></v-text-field>
                        <v-text-field
                            v-model="backupCode"
                            :append-icon="
								showBackupCode ? 'mdi-eye-off' : 'mdi-eye'
							"
                            :disabled="!$auth.loggedIn"
                            :error-messages="
								!$auth.loggedIn
									? [$t('loginRequired')]
									: []
							"
                            :rules="[rules.required]"
                            :type="showBackupCode ? 'text' : 'password'"
                            :label="$t('restore.backupCode')"
                            outlined
                            prepend-icon="mdi-key-variant"
                            rounded
                            @click:append="
								() => (showBackupCode = !showBackupCode)
							"
                        ></v-text-field>
                        <v-flex class="d-flex">
                            <v-spacer/>
                            <v-btn
                                :disabled="!restoreValid"
                                :loading="loading.restore"
                                color="secondary"
                                rounded
                                @click.prevent="restore()"
                            >
                                {{ $t("restore.confirmRestore") }}
                                <v-icon right>mdi-backup-restore</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import Vue from 'vue'
import rules from '@/components/mixins/rules'
import {restoreAccount} from '@/graphql/Creator.gql'

export default Vue.extend({
    components: {
        CertifiedBadge: () => import('@/components/badges/CertifiedBadge.vue')
    },
    mixins: [rules],
    data() {
        return {
            restoreDialog: false,
            restoreValid: false,
            showBackupCode: false,
            creatorId: null,
            backupCode: null,
            loading: {
                restore: false
            }
        }
    },
    methods: {
        restore() {
            this.loading.restore = true
            this.$apollo
                .mutate({
                    mutation: restoreAccount,
                    variables: {
                        creator_id: this.creatorId,
                        backup_code: this.backupCode
                    }
                })
                .then(({data}) => {
                    this.loading.restore = false
                    if (data.restoreAccount) {
                        this.$snackbar.message(this.$t("restore.success"))
                    } else {
                        this.$snackbar.error(this.$t("restore.success"))
                    }
                })
                .catch((err) => {
                    this.$snackbar.error(err)
                    this.loading.accept = false
                })
        }
    },
    head() {
        const metaTitle = this.$t("about")

        const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true })
        return {
            htmlAttrs: {
                ...i18nHead.htmlAttrs
            },
            link: [
                ...i18nHead.link
            ],
            title: metaTitle,
            meta: [
                ...i18nHead.meta,
                {
                    hid: 'og:title',
                    name: 'og:title',
                    property: 'og:title',
                    content: metaTitle
                }
            ]
        }
    }
})
</script>
