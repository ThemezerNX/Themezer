<template>
    <v-fade-transition>
        <div ref="divdiv" :style="minLoaderHeight !== '' ? `min-height: ${minLoaderHeight}` : ''"
             style="position: relative;">
            <v-fade-transition>
                <v-flex
                    v-show="loading"
                    :class="{
                        dim: dim
                    }"
                    class="holder"
                >
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
                class="wrapper transition-eases"
            >
                <slot/>
            </div>
        </div>
    </v-fade-transition>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: "LoadingOverlay",
    props: {
        loading: {
            type: Boolean,
            required: false,
            default: true,
        },
        shadow: {
            type: Boolean,
            required: false,
            default: true,
        },
        dim: {
            type: Boolean,
            required: false,
            default: true,
        },
        margin: {
            type: Boolean,
            required: false,
            default: true,
        },
        minLoaderHeight: {
            type: String,
            required: false,
            default: "100%",
        },
    },
    watch: {
        loading(nowLoading) {
            if (!nowLoading) {
                setTimeout(() => {
                    // this.$refs.divdiv.style.height = "";
                }, 200);
            }
        },
    },
});
</script>

<style lang="scss" scoped>
@import 'assets/variables.scss';

.holder {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 3;
    border-radius: 20px;

    &.dim {
        background: rgba(0, 0, 0, 0.3);
    }
}

.wrapper {
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
