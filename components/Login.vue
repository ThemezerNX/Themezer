<template>
	<v-dialog
		v-model="show"
		:persistent="step === 2 || step === 3"
		max-width="500"
		class="mx-auto"
	>
		<v-card>
			<v-card-title
				class="title font-weight-regular justify-space-between"
			>
				<span>{{ currentTitle }}</span>
			</v-card-title>

			<form @submit.prevent>
				<v-window v-model="step" touchless>
					<v-progress-linear
						v-if="loading"
						v-model="loadingValue"
						:active="loading"
						:indeterminate="true"
						absolute
						top
						color="green"
					></v-progress-linear>
					<v-window-item :value="0">
						<v-card-text>
							<v-text-field
								v-model="email"
								autocomplete="on"
								label="E-mail"
								:error-messages="emailLoginErrors"
								required
								type="email"
								@blur="$v.email.$touch()"
							></v-text-field>
							<v-text-field
								v-model="password"
								autocomplete="on"
								label="Password"
								:error-messages="passwordLoginErrors"
								required
								type="password"
								@input="
									$v.password.$touch()
									passwordError = ''
								"
								@blur="$v.password.$touch()"
							></v-text-field>
						</v-card-text>
					</v-window-item>
					<v-window-item :value="1">
						<v-card-text>
							<v-text-field
								v-model="username"
								autocomplete="off"
								label="Username"
								counter
								maxlength="20"
								minlength="4"
								:error-messages="
									step === 1 ? usernameErrors : null
								"
								required
								@input="$v.username.$touch()"
								@blur="$v.username.$touch()"
							></v-text-field>
							<v-text-field
								v-model="email"
								label="Email"
								:error-messages="
									step === 1 ? emailErrors : null
								"
								required
								placeholder="john.smith@example.com"
								type="email"
								@blur="$v.email.$touch()"
							></v-text-field>
							<span class="caption grey--text text--darken-1"
								>This is the e-mail you will use to login to
								your {{ APP_TITLE }} account</span
							>
							<v-text-field
								v-model="password"
								autocomplete="new-password"
								label="Password"
								counter
								minlength="6"
								:error-messages="
									step === 1 ? passwordErrors : null
								"
								required
								type="password"
								@input="$v.password.$touch()"
								@blur="$v.password.$touch()"
							></v-text-field>
							<v-text-field
								v-model="repeatPassword"
								autocomplete="new-password"
								:error-messages="
									step === 1 ? repeatPasswordErrors : null
								"
								label="Confirm Password"
								required
								type="password"
								@input="$v.repeatPassword.$touch()"
								@blur="$v.repeatPassword.$touch()"
							></v-text-field>
							<span class="caption grey--text text--darken-1"
								>Please enter a password for your account</span
							>
						</v-card-text>
					</v-window-item>

					<v-window-item :value="2">
						<div class="pa-4 text-center">
							<Icon class="logo" height="100" width="auto" />
							<h3 class="title font-weight-light mb-2">
								Welcome to {{ APP_TITLE }} {{ username }}!
							</h3>
							<span class="caption grey--text"
								>Thanks for signing up!</span
							>
						</div>
					</v-window-item>

					<v-window-item :value="3">
						<div class="pa-4 text-center">
							<Icon class="logo" height="100" width="auto" />
							<h3 class="title font-weight-light mb-2">
								Welcome back!
							</h3>
							<!-- <span class="caption grey--text"
                                >Thanks for signing up!</span
                            > -->
						</div>
					</v-window-item>

					<v-window-item :value="401">
						<div class="pa-4 text-center">
							<Icon class="logo" height="100" width="auto" />
							<h3 class="title font-weight-light mb-2">
								You (apparantly) weren't logged in properly
							</h3>
							<span class="caption grey--text"
								>Please refresh this page and try again</span
							>
						</div>
					</v-window-item>

					<v-window-item :value="403">
						<div class="pa-4 text-center">
							<Icon class="logo" height="100" width="auto" />
							<h3 class="title font-weight-light mb-2">
								An authentication error occured
							</h3>
							<span class="caption grey--text"
								>Please refresh this page and try again</span
							>
						</div>
					</v-window-item>
				</v-window>

				<v-divider></v-divider>

				<v-card-actions>
					<v-btn
						:text="step !== 2"
						:color="step === 2 ? 'primary' : ''"
						@click="
							step === 0
								? step++
								: step === 2 || step === 3
								? logout()
								: (step = 0)
						"
						>{{
							step === 0
								? 'Register'
								: step === 2 || step === 3
								? 'Logout'
								: 'Back'
						}}</v-btn
					>
					<v-spacer />
					<v-btn
						color="primary"
						depressed
						:type="step === 0 || step === 1 ? 'submit' : 'button'"
						:disabled="step === 2 || $v.$invalid"
						@click="step === 0 || step === 1 ? submit() : null"
						>{{
							step === 0
								? 'Login'
								: step === 1
								? 'Register'
								: 'Next'
						}}
					</v-btn>
				</v-card-actions>
			</form>
		</v-card>
	</v-dialog>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
	required,
	sameAs,
	minLength,
	maxLength,
	email
} from 'vuelidate/lib/validators'
import Icon from '@/static/icon.png'
import UserQueries from '@/graphql/User.gql'

export default {
	name: 'Login',
	components: {
		Icon
	},
	mixins: [validationMixin],
	props: {
		value: Boolean
	},
	data() {
		return {
			APP_TITLE: process.env.APP_TITLE,
			username: '',
			email: '',
			password: '',
			repeatPassword: '',
			passwordError: '',
			Error: '',
			loading: false,
			loadingValue: 0,
			step: 0
		}
	},
	computed: {
		currentTitle() {
			switch (this.step) {
				case 0:
					return 'Login'
				case 1:
					return 'Sign-up'
				case 2:
					return 'Account created'
				case 3:
					return 'Welcome'
				case 401:
					return 'Error, please try again (later)'
				case 403:
					return this.Error
				default:
					return 'Error, please refresh'
			}
		},
		show: {
			get() {
				return this.value
			},
			set(value) {
				this.$emit('input', value)
			}
		},
		clientValidation() {
			return this.step === 0
				? {
						email: {
							required,
							email,
							isEmailRegistered(email) {
								return new Promise((resolve) => {
									this.$apollo
										.query({
											query: UserQueries.emailAvailable,
											variables: {
												email
											}
										})
										.then((res) => {
											resolve(!res.data.emailAvailable)
										})
								})
							}
						},
						password: {
							required,
							passwordIncorrect() {
								if (this.$v.$dirty) {
									const error = this.passwordError

									if (error) {
										return false
									} else {
										return true
									}
								} else {
									return true
								}
							}
						}
				  }
				: {
						username: {
							required,
							minlength: minLength(4),
							maxlength: maxLength(20)
						},
						email: {
							required,
							email,
							isEmailAvailable(email) {
								return new Promise((resolve) => {
									this.$apollo
										.query({
											query: UserQueries.emailAvailable,
											variables: {
												email
											}
										})
										.then((res) => {
											resolve(res.data.emailAvailable)
										})
								})
							}
						},
						password: { required, minLength: minLength(6) },
						repeatPassword: {
							sameAsPassword: sameAs('password')
						}
				  }
		},
		usernameErrors() {
			const errors = []
			if (!this.$v.username.$dirty) return errors
			!this.$v.username.minlength &&
				errors.push('Username must be at least 4 characters long')
			!this.$v.username.maxlength &&
				errors.push('Username must be at most 20 characters long')
			!this.$v.username.required && errors.push('Username is required')
			return errors
		},
		emailLoginErrors() {
			const errors = []
			if (!this.$v.email.$dirty) return errors
			!this.$v.email.email && errors.push('Must be valid e-mail')
			!this.$v.email.required && errors.push('E-mail is required')
			!this.$v.email.isEmailRegistered &&
				errors.push('E-mail is not registered yet')
			return errors
		},
		emailErrors() {
			const errors = []
			if (!this.$v.email.$dirty) return errors
			!this.$v.email.email && errors.push('Must be valid e-mail')
			!this.$v.email.required && errors.push('E-mail is required')
			!this.$v.email.isEmailAvailable &&
				errors.push('E-mail already in use')
			return errors
		},
		passwordLoginErrors() {
			const errors = []
			if (!this.$v.password.$dirty) return errors
			!this.$v.password.required && errors.push('Password is required.')
			!this.$v.password.passwordIncorrect &&
				errors.push(this.passwordError)
			return errors
		},
		passwordErrors() {
			const errors = []
			if (!this.$v.password.$dirty) return errors
			!this.$v.password.minLength &&
				errors.push('Password must be at least 6 characters long')
			!this.$v.password.required && errors.push('Password is required')
			return errors
		},
		repeatPasswordErrors() {
			const errors = []
			if (!this.$v.repeatPassword.$dirty) return errors
			!this.$v.repeatPassword.sameAsPassword &&
				errors.push('Passwords do not match')
			return errors
		}
	},
	validations() {
		return this.clientValidation
	},
	methods: {
		clear() {
			this.username = ''
			this.email = ''
			this.password = ''
			this.repeatPassword = ''
			this.passwordError = ''
			this.registerError = ''
			this.$v.$reset()
		},
		logout() {
			this.$apollo
				.mutate({
					mutation: UserQueries.logout
				})
				.then(() => {
					this.$router.go()
					this.step = 0
				})
				.catch((error) => {
					const parsedError = JSON.parse(JSON.stringify(error))
					if (
						parsedError.graphQLErrors &&
						parsedError.graphQLErrors.length > 0 &&
						parsedError.graphQLErrors.statusCode === 401
					) {
						this.step = 401
					} else this.step = -1
				})
		},
		submit() {
			this.$v.$touch()
			if (this.step === 0) {
				this.$apollo
					.mutate({
						mutation: UserQueries.login,
						variables: {
							email: this.email,
							password: this.password
						}
					})
					.then(() => {
						this.step = 3
						const self = this
						setTimeout(() => {
							this.$router.go()
							self.show = false
							setTimeout(() => {
								self.step = 0
								this.clear()
							}, 2000)
						}, 3000)
					})
					.catch((error) => {
						const parsedError = JSON.parse(JSON.stringify(error))
						if (
							parsedError.graphQLErrors &&
							parsedError.graphQLErrors.length > 0 &&
							parsedError.graphQLErrors[0].message
						) {
							const thisError = parsedError.graphQLErrors[0]

							if (thisError.statusCode === 1002) {
								this.passwordError = thisError.message
							} else {
								this.Error = thisError.message
								this.step = 403
							}
						}
						this.$v.$touch()
					})
			} else {
				this.$apollo
					.mutate({
						mutation: UserQueries.register,
						variables: {
							username: this.username,
							email: this.email,
							password: this.password
						}
					})
					.then(() => {
						this.step = 2
						const self = this
						setTimeout(() => {
							this.$router.go()
							self.show = false
							setTimeout(() => {
								self.step = 0
								this.clear()
							}, 2000)
						}, 6000)
					})
					.catch((error) => {
						const parsedError = JSON.parse(JSON.stringify(error))
						if (
							parsedError.graphQLErrors &&
							parsedError.graphQLErrors.length > 0 &&
							parsedError.graphQLErrors[0].message
						) {
							this.Error = parsedError.graphQLErrors[0].message
							this.step = 403
						}
						this.$v.$touch()
					})
			}
		}
	}
}
</script>
