<template>
	<v-fade-transition>
		<div style="position: relative;">
			<v-fade-transition>
				<v-flex v-show="loading" class="holder">
					<v-progress-circular
						class="circle"
						indeterminate
						size="64"
					/>
					<!-- Text below loader -->
					<!-- <h1 v-show="message">Redirecting...</h1> -->
				</v-flex>
			</v-fade-transition>
			<div
				class="wrapper"
				:class="{ shadow: loading && shadow, 'ma-3': margin }"
			>
				<slot />
			</div>
		</div>
	</v-fade-transition>
</template>

<script>
export default {
	name: 'LoadingOverlay',
	props: {
		loading: {
			type: Boolean,
			required: false,
			default: true
		},
		shadow: {
			type: Boolean,
			required: false,
			default: true
		},
		margin: {
			type: Boolean,
			required: false,
			default: true
		}
	}
}
</script>

<style lang="scss" scoped>
@import '~assets/variables.scss';

.holder {
	width: 100%;
	min-height: 90vh;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	z-index: 3;
	border-radius: 10px;
	background: rgba(0, 0, 0, 0.5);
	// border-radius: 10px;
}

.wrapper {
	transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	&.shadow {
		box-shadow: 0 0 10px 6px #232323 inset;
	}
}

@keyframes bg-color {
	0% {
		color: $themezer-primary;
	}
	50% {
		color: $themezer-secondary;
	}
	100% {
		color: $themezer-primary;
	}
}

.circle {
	animation: bg-color 4s infinite;
	animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
}
</style>
