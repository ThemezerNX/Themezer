<template>
    <v-tooltip v-model="copyLinkSuccess" top>
        <template #activator="{}">
            <v-tooltip v-model="tooltipActive" top>
                <template #activator="{ on, attrs }">
                    <v-btn
                        class="button"
                        color="primary"
                        dark
                        fab
                        small
                        v-bind="attrs"
                        @click="share()"
                        v-on="on"
                    >
                        <slot/>
                        <v-icon
                            :right="!!$slots.default"
                            style="margin-top: -3px; margin-left: 3px"
                        >
                            {{ icon || "mdi-share" }}
                        </v-icon>
                    </v-btn>
                </template>
                <span>{{ tooltip || $t("item.share") }}</span>
            </v-tooltip>
        </template>
        <span>{{ $t("copySuccess") }}</span>
    </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: {
        icon: {
            type: String,
            required: false,
            default: undefined,
        },
        tooltip: {
            type: String,
            required: false,
            default: undefined,
        },
        type: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        creator: {
            type: String,
            required: false,
            default: undefined,
        },
    },
    data() {
        return {
            copyLinkSuccess: false,
            tooltipActive: false,
        };
    },
    methods: {
        async share() {
            const type = this.$tc(this.type);
            const translationKey = "item.share" + this.type.charAt(0).toUpperCase() + this.type.slice(1);
            const data = {
                title: this.type ? `Themezer ${type}` : `Themezer ${this.$tc("item.item")}`,
                text: this.$t(translationKey, {
                    type: type.toLowerCase(),
                    name: this.name,
                    creator: this.creator,
                }),
                url: window.location.href,
            };
            const navigator: any = window.navigator;
            if (navigator.share) {
                try {
                    await navigator.share(data);
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                    this.copyLink();
                }
            } else {
                this.copyLink();
            }
        },
        copyLink() {
            navigator.clipboard
                .writeText(window.location.href)
                .then(() => {
                    this.tooltipActive = false;
                    this.copyLinkSuccess = true;
                    setTimeout(() => {
                        this.copyLinkSuccess = false;
                    }, 2000);
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err)
                    ;(this as any).$snackbar.error(
                        "Something went wrong, unable to copy",
                    );
                });
        },
    },
});
</script>

<style lang="scss" scoped>
.button {
    padding-right: 3px;
    background-color: #555;
}
</style>
