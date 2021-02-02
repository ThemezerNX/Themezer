<template>
    <TargetPicker/>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
    components: {
        TargetPicker: () => import('@/components/TargetPicker.vue')
    },
    data() {
        return {
            type: 'layouts'
        }
    },
    head() {
        const metaTitle = 'Layouts'
        const metaDesc = 'Discover unique layouts to style menus to your hearts content!'
        const metaImg = null

        return {
            title: metaTitle,
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: metaDesc
                },
                {
                    hid: 'og:title',
                    name: 'og:title',
                    property: 'og:title',
                    content: metaTitle
                },
                {
                    hid: 'og:description',
                    name: 'og:description',
                    property: 'og:description',
                    content: metaDesc
                },
                {
                    hid: 'og:image',
                    name: 'og:image',
                    property: 'og:image',
                    content: metaImg
                }
            ]
        }
    }
})
</script>
