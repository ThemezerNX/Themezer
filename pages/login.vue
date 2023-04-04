<template>
    <PageBlank center-content-vertical>
        <v-card outlined elevation="10" min-height="200px">
            <v-window v-model="action" style="min-width: 500px">
                <v-window-item value="start">
                    <div class="d-flex">
                        <v-btn
                            class="pa-14"
                            height="100%"
                            tile
                            color="transparent"
                            width="50%"
                            @click="action = 'login'"
                            elevation="0"
                        >
                            <div class="d-flex flex-column">
                                <v-icon size="150">mdi-login</v-icon>
                                <h1 class="pt-4">
                                    {{ $t("login") }}
                                </h1>
                            </div>
                        </v-btn>
                        <v-divider vertical style="width: 50px;"/>
                        <v-btn
                            class="pa-14"
                            height="100%"
                            tile
                            color="transparent"
                            width="50%"
                            @click="action = 'register'"
                            elevation="0"
                        >
                            <v-flex class="d-flex flex-column">
                                <v-icon size="150">mdi-account-plus-outline</v-icon>
                                <h1 class="pt-4">
                                    {{ $t("register") }}
                                </h1>
                            </v-flex>
                        </v-btn>
                    </div>
                </v-window-item>

                <v-window-item value="login">
                    <v-stepper v-model="loginStep" style="background: transparent">
                        <v-stepper-header>
                            <v-stepper-step
                                :complete="loginStep > 1"
                                step="1"
                            >
                                Enter Credentials
                            </v-stepper-step>

                            <v-divider></v-divider>

                            <v-stepper-step
                                :complete="loginStep > 2"
                                step="2"
                            >
                                Logged In
                            </v-stepper-step>
                        </v-stepper-header>

                        <v-stepper-items>
                            <v-stepper-content step="1">
                                <v-form class="pa-1">
                                    <v-text-field
                                        v-model="loginDetails.email"
                                        :label="$tc('auth.username')"
                                        filled
                                        outlined
                                    />
                                    <v-text-field
                                        v-model="loginDetails.password"
                                        :label="$tc('auth.password')"
                                        filled
                                        outlined
                                        type="password"
                                    />
                                </v-form>

                                <v-card-actions>
                                    <v-btn
                                        text
                                        @click="action = 'start';"
                                    >
                                        Cancel
                                    </v-btn>

                                    <v-spacer/>

                                    <v-btn
                                        color="primary"
                                        @click="loginStep = 2; login();"
                                    >
                                        Continue
                                    </v-btn>
                                </v-card-actions>
                            </v-stepper-content>

                            <v-stepper-content step="2" class="text-center">
                                <v-scale-transition leave-absolute>
                                    <v-progress-circular
                                        v-show="loading.login"
                                        indeterminate
                                        color="secondary"
                                        size="64"
                                        width="6"
                                    ></v-progress-circular>
                                </v-scale-transition>
                                <v-scale-transition hide-on-leave origin="center">
                                    <!--                                    <v-img-->
                                    <!--                                        :src="require('@/static/icon.png')"-->
                                    <!--                                        class="collage-title-image ma-auto"-->
                                    <!--                                        contain-->
                                    <!--                                        width="128"-->
                                    <!--                                    />-->
                                    <v-progress-circular
                                        :rotate="-90"
                                        v-show="!loading.login"
                                        :value="loading.loginLeaveCountdown"
                                        color="primary"
                                        size="64"
                                        width="6"
                                    >
                                        <v-icon size="65" color="primary">
                                            mdi-check-underline-circle
                                        </v-icon>
                                    </v-progress-circular>
                                </v-scale-transition>
                            </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>
                </v-window-item>

                <v-window-item value="register">
                    <v-stepper v-model="registerStep">
                        <v-stepper-header>
                            <v-stepper-step
                                :complete="registerStep > 1"
                                step="1"
                            >
                                Name of step 1
                            </v-stepper-step>

                            <v-divider></v-divider>

                            <v-stepper-step
                                :complete="registerStep > 2"
                                step="2"
                            >
                                Name of step 2
                            </v-stepper-step>

                            <v-divider></v-divider>

                            <v-stepper-step step="3">
                                Name of step 3
                            </v-stepper-step>
                        </v-stepper-header>

                        <v-stepper-items>
                            <v-stepper-content step="1">
                                <v-card
                                    class="mb-12"
                                    color="grey lighten-1"
                                    height="200px"
                                ></v-card>

                                <v-btn
                                    text
                                    @click="action = 'start';"
                                >
                                    Cancel
                                </v-btn>

                                <v-btn
                                    color="primary"
                                    @click="registerStep = 2"
                                >
                                    Continue
                                </v-btn>
                            </v-stepper-content>

                            <v-stepper-content step="2">
                                <v-card
                                    class="mb-12"
                                    color="grey lighten-1"
                                    height="200px"
                                ></v-card>

                                <v-btn
                                    text
                                    @click="action = 'start';"
                                >
                                    Cancel
                                </v-btn>

                                <v-btn
                                    color="primary"
                                    @click="registerStep = 3"
                                >
                                    Continue
                                </v-btn>
                            </v-stepper-content>

                            <v-stepper-content step="3">
                                <v-card
                                    class="mb-12"
                                    color="grey lighten-1"
                                    height="200px"
                                ></v-card>

                                <v-btn
                                    text
                                    @click="action = 'start';"
                                >
                                    Cancel
                                </v-btn>

                                <v-btn
                                    color="primary"
                                    @click="registerStep = 1"
                                >
                                    Continue
                                </v-btn>
                            </v-stepper-content>
                        </v-stepper-items>
                    </v-stepper>
                </v-window-item>
            </v-window>
        </v-card>
    </PageBlank>
</template>

<script>

export default {
    data() {
        return {
            APP_TITLE: process.env.APP_TITLE,
            action: "start",
            registerStep: 1,
            loginStep: 1,
            leftExpanded: false,
            rightExpanded: false,
            loginDetails: {
                email: "",
                password: "",
            },
            registerDetails: {
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
            },
            loading: {
                login: false,
                loginLeaveCountdown: 100,
                register: false,
            },
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (vm.$auth.isAuthenticated) {
                next("/");
            } else {
                next();
            }
        });
    },
    methods: {
        login() {
            this.loading.login = true;
            this.$auth.login(this.loginDetails.email, this.loginDetails.password)
                .then(() => {
                    this.loading.login = false;

                    const loadingCountdownInterval = setInterval(() => {
                        this.loading.loginLeaveCountdown -= 10;
                        if (this.loading.loginLeaveCountdown <= -20) {
                            clearInterval(loadingCountdownInterval);
                            this.$router.push("/");
                        }
                    }, 300);
                })
                .catch((error) => {
                    // todo
                    this.loading.login = false;
                });
        },
    },
};
</script>
