<template>
	<v-fade-transition>
		<v-flex class="holder">
			<v-progress-circular class="circle" indeterminate size="64" />
		</v-flex>
	</v-fade-transition>
</template>

<script>
export default {
	name: 'LoadingOverlay'
}
</script>

<style lang="scss" scoped>
.holder {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

@keyframes bg-color {
	0% {
		color: $themezer-magenta;
	}
	50% {
		color: $themezer-aqua;
	}
	100% {
		color: $themezer-magenta;
	}
}

.circle {
	animation: bg-color 4s infinite;
	animation-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
}
</style>
