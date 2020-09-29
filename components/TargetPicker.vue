<template>
	<v-container
		class="d-flex align-center"
		:fluid="$vuetify.breakpoint.smAndDown"
		:class="{ 'pa-10': !$vuetify.breakpoint.smAndDown }"
		style="height: 100%;"
	>
		<v-row style="height: 100%;" class="d-flex align-center">
			<v-col cols="12" style="align-self: flex-end;">
				<h1
					class="flex-grow-1 display-2 font-weight-medium text-center"
				>
					Choose A Menu
				</h1>
				<h3 class="flex-grow-1 text-center">
					to view {{ $parent.$data.type }}
				</h3>
			</v-col>
			<v-hover
				v-for="target in targets.menus"
				v-slot:default="{ hover }"
				:key="target.target"
			>
				<v-col
					cols="12"
					xs="12"
					sm="4"
					md="3"
					class="mx-auto"
					style="align-self: flex-start;"
				>
					<v-fade-transition>
						<v-card
							:elevation="hover ? 12 : 2"
							:class="{ 'on-hover': hover }"
							min-height="200"
							min-width="200"
							class="card d-flex align-center transition-fast-in-fast-out"
							:to="{
								path: `${$parent.$data.type}/${target.target}`,
								query: $route.query
							}"
						>
							<img
								class="thumbnail transition-fast-in-fast-out"
								alt="menu screenshot"
								:src="
									require(`@/assets/stock/360/${target.image}`)
								"
							/>
							<div class="display-2 flex-grow-1 text-center">
								<v-icon size="60">{{ target.icon }}</v-icon>
								<h6 style="z-index: 2; position: relative;">
									{{ target.title }}
								</h6>
							</div>
						</v-card>
					</v-fade-transition>
				</v-col>
			</v-hover>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import targets from '@/assets/targets'

export default Vue.extend({
	data() {
		return {
			targets: targets.find(
				(type) => type.name === this.$parent.$data.type
			)
		}
	}
})
</script>

<style lang="scss" scoped>
.card {
	border-radius: 10px !important;
	overflow: hidden;
	text-shadow: 0 0 5px black;
	.thumbnail {
		opacity: 0.3;
		left: 0;
		transform: scale(1.05);
		filter: brightness(0.4);
		position: absolute;
		width: 100%;
		height: 110%;
		object-fit: cover;
	}
}

.card.on-hover {
	// background: darken($themezer-primary, 15%) !important;
	transform: translateY(-5px);
	.thumbnail {
		opacity: 1;
		filter: brightness(0.6);
		transform: rotate(-10deg) scale(1.25);
	}
}
</style>
