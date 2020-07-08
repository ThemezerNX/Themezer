<template>
	<v-tooltip v-model="copyLinkSuccess" top>
		<template v-slot:activator="{}">
			<v-tooltip v-model="tooltip" top>
				<template v-slot:activator="{ on, attrs }">
					<v-btn
						class="button"
						dark
						small
						fab
						color="primary"
						v-bind="attrs"
						v-on="on"
						@click="share()"
					>
						<v-icon>mdi-share-variant</v-icon>
					</v-btn>
				</template>
				<span>Share</span>
			</v-tooltip>
		</template>
		<span>Copied!</span>
	</v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		type: {
			type: String,
			required: false,
			default: undefined
		},
		name: {
			type: String,
			required: false,
			default: undefined
		},
		creator: {
			type: String,
			required: false,
			default: undefined
		}
	},
	data() {
		return {
			copyLinkSuccess: false,
			tooltip: false
		}
	},
	methods: {
		async share() {
			const data = {
				title: this.type ? `Themezer ${this.type}` : 'Themezer item',
				text: this.name
					? 'Check out ' +
					  (this.type ? `the ${this.type} ` : '') +
					  `'${this.name}'` +
					  ` by ${this.creator}` +
					  ` on Themezer!`
					: undefined,
				url: window.location.href
			}
			const navigator: any = window.navigator
			if (navigator.share) {
				try {
					await navigator.share(data)
				} catch (err) {
					// eslint-disable-next-line no-console
					console.error(err)
					this.copyLink()
				}
			} else {
				this.copyLink()
			}
		},
		copyLink() {
			navigator.clipboard
				.writeText(window.location.href)
				.then(() => {
					this.tooltip = false
					this.copyLinkSuccess = true
					setTimeout(() => {
						this.copyLinkSuccess = false
					}, 2000)
				})
				.catch((e) => {
					// eslint-disable-next-line no-console
					console.log('Something went wrong, unable to copy', e)
				})
		}
	}
})
</script>

<style lang="scss" scoped>
.button {
	padding-right: 3px;
	background-color: #555;
}
</style>
