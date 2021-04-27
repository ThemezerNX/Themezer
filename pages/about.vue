<template>
    <v-layout align-center column justify-center pa-3>
        <v-card max-width="600" style="border-radius: 20px;">
            <v-card-title class="headline">
                About
            </v-card-title>
            <v-card-text>
                <p>
                    Themezer is a site for Nintendo Switch Themes and Layouts.
                    Source Code for the project can be found on the
                    <a
                        href="https://github.com/ThemezerNX"
                        rel="noopener"
                        target="_blank"
                        title="discord"
                    >ThemezerNX GitHub</a
                    >.
                </p>
                <p>
                    If you have any questions, please join the
                    <a
                        href="https://discord.gg/nnm8wyM"
                        rel="noopener"
                        target="_blank"
                        title="discord"
                    >Discord server</a
                    >.
                </p>
                <p>
                    Found a bug or have a suggestion?
                    <a
                        href="https://github.com/ThemezerNX/Themezer/issues"
                        rel="noopener"
                        target="_blank"
                        title="contribute"
                    >Create an issue on GitHub</a
                    >.
                </p>
                <p>
                    What does the
                    <CertifiedBadge inline/>
                    badge mean? It means that the
                    nxtheme you download is updated automatically whenever there
                    are changes made to the layout or theme itself.
                </p>
                <p class="mt-4">
                    Need to restore your Themezer account?
                    <v-btn
                        color="primary"
                        rounded
                        text
                        @click="restoreDialog = true"
                    >Click here
                    </v-btn
                    >
                </p>
                <p>
                    Themezer is in no way affiliated with Nintendo.
                </p>
                <hr class="mb-2"/>
                <span class="pr-3">&copy; {{ new Date().getFullYear() }} Themezer</span>
                <nuxt-link class="pr-3" to="/contact">Contact</nuxt-link>
                <nuxt-link class="pr-3" to="/terms-of-service">Terms of Service</nuxt-link>
                <nuxt-link class="pr-3" to="/privacy-policy">Privacy Policy</nuxt-link>
                <nuxt-link class="pr-3" to="/cookie-policy">Cookie Policy</nuxt-link>
                <a href="https://stats.uptimerobot.com/zx1G5uROYn" rel="noopener" target="_blank">Status</a>
            </v-card-text>
        </v-card>
        <v-dialog v-model="restoreDialog" class="mx-auto" max-width="800">
            <v-card>
                <v-card-title
                    class="title font-weight-regular justify-space-between"
                >
                    <span>Restore Account</span>
                    <v-spacer></v-spacer>

                    <v-btn icon rounded @click="restoreDialog = false">
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    Back when you created your Themezer account, you were
                    informed of a backup code you could use if you ever lost
                    access to your Discord account. You can use it here to
                    regain access to your Themezer account. The Discord account
                    you are currently logged in with will be linked to your
                    previous Themezer data. Make sure to update your layouts
                    with your new creator ID afterwards!
                    <v-form v-model="restoreValid">
                        <v-text-field
                            v-model="creatorId"
                            :disabled="!$auth.loggedIn"
                            :error-messages="
								!$auth.loggedIn
									? ['You have to be logged in first']
									: []
							"
                            :rules="[
								rules.required,
								rules.creatorId,
								rules.notOwnCreatorId
							]"
                            class="mt-5"
                            label="Previous Creator ID"
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
									? ['You have to be logged in first']
									: []
							"
                            :rules="[rules.required]"
                            :type="showBackupCode ? 'text' : 'password'"
                            label="Backup Code"
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
                                Restore
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
import {restoreAccount} from '@/graphql/Creator.gql'

export default Vue.extend({
    components: {
        CertifiedBadge: () => import('@/components/badges/CertifiedBadge.vue')
    },
    data() {
        return {
            restoreDialog: false,
            restoreValid: false,
            showBackupCode: false,
            creatorId: null,
            backupCode: null,
            rules: {
                required: (value) => !!value || 'Required',
                creatorId: (value) =>
                    !value || (!isNaN(value) ? true : 'Invalid ID'),
                notOwnCreatorId: (value) =>
                    !value ||
                    (!(this.$auth.user.id === value)
                        ? true
                        : 'This is your current ID')
            },
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
                        this.$snackbar.message('Restored successfully!')
                    } else {
                        this.$snackbar.error(
                            new Error('Creator ID or Backup Code invalid!')
                        )
                    }
                })
                .catch((err) => {
                    this.$snackbar.error(err)
                    this.loading.accept = false
                })
        }
    },
    head() {
        const metaTitle = 'About'

        return {
            title: metaTitle,
            meta: [
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
