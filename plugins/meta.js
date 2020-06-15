import Vue from 'vue'

Vue.mixin({
	head() {
		return {
			title: this.metaTitle,
			meta: [
				{
					hid: 'description',
					name: 'description',
					content: this.metaDesc
				},
				{
					hid: 'og:title',
					name: 'og:title',
					property: 'og:title',
					content: this.metaTitle
				},
				{
					hid: 'og:description',
					name: 'og:description',
					property: 'og:description',
					content: this.metaDesc
				},
				{
					hid: 'og:image',
					name: 'og:image',
					property: 'og:image',
					content: this.metaImg
				}
			]
		}
	}
})
