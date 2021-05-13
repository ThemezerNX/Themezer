<template>
    <div style="text-align: center">
        <h3 style="position: relative;">
            NXTheme Installer
            <v-tooltip v-model="showTooltip" top>
                <template v-slot:activator="{ on }">
                    <v-btn
                        v-on="on"
                        class="ml-1 pa-0 grey lighten-1"
                        height="14"
                        icon
                        rounded
                        style="position: absolute; top: 0; color: black;"
                        width="14"
                        @click="show = true"
                    >
                        ?
                    </v-btn>
                </template>
                <span>What is this?</span>
            </v-tooltip>
        </h3>
        <v-dialog v-model="show" max-width="400">
            <v-card>
                <v-card-title class="headline"
                >What is the NXTheme Installer?
                </v-card-title
                >

                <v-card-text>
                    The
                    <a
                        href="https://github.com/exelix11/SwitchThemeInjector/"
                        rel="noopener"
                        target="_blank"
                    >
                        NXTheme Installer
                    </a>
                    is an homebrew app that runs on the switch itself and can be
                    used to install and manage themes. The IDs displayed on
                    Themezer can be used to install them directly. The ID
                    <span
                        class="text-overline"
                        style="font-size: 0.9rem !important;"
                    >
						        ({{ type === "theme" ? "t" : "p" }}{{ id }})</span
                    >can be input on the 'Download themes' tab in the app. Be
                    sure to select Themezer as the provider.
                    This ID can also be used in the search box of the
                    <a
                        href="https://github.com/suchmememanyskill/themezer-nx/"
                        rel="noopener"
                        target="_blank"
                    >
                        Themezer-NX homebrew app
                    </a>.
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="primary" rounded text @click="show = false">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div class="font-weight-light text-body-1 font-weight-medium">
			<span class="text-overline" style="font-size: 1.2rem !important;">
				{{ type === "theme" ? "t" : "p" }}{{ id }}
			</span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: {
        id: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            showTooltip: false,
            show: false,
        };
    },
});
</script>
