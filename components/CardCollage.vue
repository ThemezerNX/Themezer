<template>
    <div v-resize="onResize" class="collage">
        <div class="overlay-content" :style="marginTop">
            <div>
                <slot name="top"/>
            </div>
            <div>
                <slot name="center"/>
            </div>
            <div>
                <slot name="bottom"/>
            </div>
        </div>
        <div class="collage-row-wrapper row-animation" :style="dynamicStyle">
            <div class="collage-row-wrapper-inner" :style="dynamicStyleInnerWrapper">
                <div
                    class="collage-row collage-row-1"
                    :style="row1"
                ></div>
            </div>
            <div v-show="windowSize.y > 550" class="collage-row-wrapper-inner" :style="dynamicStyleInnerWrapper">
                <div
                    class="collage-row collage-row-2"
                    :style="row2"
                ></div>
            </div>
            <div v-show="windowSize.y > 805" class="collage-row-wrapper-inner" :style="dynamicStyleInnerWrapper">
                <div
                    class="collage-row collage-row-3"
                    :style="row3"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            windowSize: {
                x: 1920,
                y: 1080,
            },
            row1: {
                backgroundImage: `url(${require("@/assets/card_rows/row-1.png")})`,
            },
            row2: {
                backgroundImage: `url(${require("@/assets/card_rows/row-2.png")})`,
            },
            row3: {
                backgroundImage: `url(${require("@/assets/card_rows/row-3.png")})`,
            },
        };
    },
    mounted() {
        this.onResize();
    },
    methods: {
        onResize() {
            this.windowSize = {x: window.innerWidth, y: window.innerHeight};
        },
    },
    computed: {
        navbarHeight() {
            return this.$vuetify.breakpoint.mdAndUp
                ? "64px"
                : "56px";
        },
        marginTop() {
            return {
                marginTop:
                    this.windowSize.y < 500
                        ? "0px"
                        : `-${this.navbarHeight}`,
            };
        },
        dynamicStyle() {
            return {
                height: `calc(${this.heightPx} - ${this.navbarHeight})`,
            };
        },
        dynamicStyleInnerWrapper() {
            const newScale = 1920 / this.windowSize.x;
            return {
                transform: `scale(${newScale > 1 ? newScale : 1})`,
            };
        },
    },
    props: {
        heightPx: {
            type: String,
            required: false,
            default: undefined,
        },
    },
});
</script>

<style lang="scss" scoped>
@import '~assets/variables.scss';

* {
    text-shadow: 0 2px 10px black;
    user-select: none;
}

@keyframes fadeIn {
    100% {
        opacity: 0.60;
    }
}

@keyframes move-right {
    100% {
        transform: translateX(50%);
    }
}

@keyframes move-left {
    100% {
        transform: translateX(-50%);
    }
}

.collage {
    position: relative;
    left: 0;
    top: 0;
    margin: auto;
}

.overlay-content {
    position: absolute;
    z-index: 1;
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.overlay-content > div {
    text-align: center;
}

.collage-row-wrapper {
    position: relative;
    overflow: hidden;
    transform: rotate(-10deg) scale(1.2);
    padding-top: 70px;
}

.collage-row-wrapper-inner {
    margin-top: -32px;
    transform-origin: top;
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
}

.collage-row {
    position: absolute;
    opacity: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background-size: 50%;
    background-repeat: repeat-x;
}

.collage-row-1 {
    margin-top: 2%;
    animation: move-left 25s linear infinite, fadeIn 1000ms 2s ease-out 1 forwards;
}

.collage-row-2 {
    margin-top: 15%;
    margin-left: -100%;
    animation: move-right 50s linear infinite, fadeIn 1000ms 2.5s ease-out 1 forwards;
}

.collage-row-3 {
    margin-top: 28%;
    animation: move-left 40s linear infinite, fadeIn 1000ms 3.0s ease-out 1 forwards;
}
</style>
