<template>
    <v-tooltip v-model="copyLinkSuccess" top>
        <template v-slot:activator="{}">
            <v-tooltip v-model="tooltipActive" top>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-bind="attrs"
                        v-on="on"
                        class="button"
                        color="primary"
                        dark
                        fab
                        small
                        @click="share()"
                    >
                        <slot/>
                        <v-icon
                            :right="!!$slots.default"
                            style="margin-top: -3px; margin-left: 3px"
                        >{{ icon || 'mdi-share' }}
                        </v-icon
                        >
                    </v-btn>
                </template>
                <span>{{ tooltip || 'Share' }}</span>
            </v-tooltip>
        </template>
        <span>Copied!</span>
    </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        icon: {
            type: String,
            required: false,
            default: undefined
        },
        tooltip: {
            type: String,
            required: false,
            default: undefined
        },
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
            tooltipActive: false
        }
    },
    methods: {
        async share() {
            const data = {
                title: this.type ? `Themezer ${this.type}` : 'Themezer item',
                text: this.name
                    ? 'Check out ' +
                    (this.type ? `this ${this.type} ` : '') +
                    `'${this.name}'` +
                    (this.creator ? ` by ${this.creator}` : '') +
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
                    this.tooltipActive = false
                    this.copyLinkSuccess = true
                    setTimeout(() => {
                        this.copyLinkSuccess = false
                    }, 2000)
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err)
                    ;(this as any).$snackbar.error(
                        'Something went wrong, unable to copy'
                    )
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
