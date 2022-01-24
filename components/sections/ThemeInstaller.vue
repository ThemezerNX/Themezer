<template>
    <div style="text-align: center">
        <h3 style="position: relative;">
            NXThemes Installer
            <v-tooltip v-model="showTooltip" top>
                <template #activator="{ on }">
                    <v-btn
                        class="ml-1 pa-0 grey lighten-1"
                        height="14"
                        icon
                        rounded
                        style="position: absolute; top: 0; color: black;"
                        width="14"
                        @click="show = true"
                        v-on="on"
                    >
                        ?
                    </v-btn>
                </template>
                <span>{{ $t("whatIs.this") }}</span>
            </v-tooltip>
        </h3>
        <v-dialog v-model="show" max-width="400">
            <v-card>
                <v-card-title class="headline">
                    {{ $t("whatIs.nxthemeInstaller") }}
                </v-card-title>

                <v-card-text>
                    <i18n path="whatIs.nxthemeInstallerDescription">
                        <template #nxthemesInstaller>
                            <a
                                href="https://github.com/exelix11/SwitchThemeInjector/"
                                rel="noopener"
                                target="_blank"
                            >NXThemes Installer</a>
                        </template>
                        <template #id>
                            <span
                                class="text-overline"
                                style="font-size: 0.9rem !important;"
                            >({{ type === "theme" ? "t" : "p" }}{{ id }})</span>
                        </template>
                        <template #themezerNX>
                            <a
                                href="https://github.com/suchmememanyskill/themezer-nx/"
                                rel="noopener"
                                target="_blank"
                            >Themezer-NX</a>
                        </template>
                    </i18n>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="primary" rounded text @click="show = false">
                        {{ $t("close") }}
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
