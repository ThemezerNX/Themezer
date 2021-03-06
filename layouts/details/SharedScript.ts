import Vue from "vue";
import urlParser from "~/components/mixins/urlParser";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

export default Vue.extend({
    components: {
        LoadingOverlay,
    },
    mixins: [urlParser],
    data: () => {
        return {
            landscape: false,
            show: false,
        };
    },
    mounted() {
        window.addEventListener(
            "orientationchange",
            this.handleOrientationChange,
        );
        this.handleOrientationChange();
    },
    methods: {
        handleOrientationChange() {
            const orientation = window.screen.orientation.type;
            if (orientation === "portrait-primary") {
                this.landscape = false;
            } else if (orientation === "landscape-primary") {
                this.landscape = true;
            }
        },
    },
});
