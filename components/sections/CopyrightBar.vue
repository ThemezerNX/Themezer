<template>
    <div>
        {{ $t("abouts.notAffiliated") }}<br>
        <span class="pr-3">&copy; {{ new Date().getFullYear() }} Themezer</span>
        <nuxt-link class="pr-3" to="/about" v-if="$route.path !== '/about'">{{ $t("about") }}</nuxt-link>
        <nuxt-link class="pr-3" to="/contact" v-if="$route.path !== '/contact'">{{ $t("contact") }}</nuxt-link>
        <nuxt-link class="pr-3" to="/terms-of-service" v-if="$route.path !== '/terms-of-service'">{{ $t("termsOfService") }}</nuxt-link>
        <nuxt-link class="pr-3" to="/privacy-policy" v-if="$route.path !== '/privacy-policy'">{{ $t("privacyPolicy") }}</nuxt-link>
        <nuxt-link class="pr-3" to="/cookie-policy" v-if="$route.path !== '/cookie-policy'">{{ $t("cookiePolicy") }}</nuxt-link>
        <a href="https://stats.uptimerobot.com/zx1G5uROYn" rel="noopener" target="_blank">{{ $t("status") }}</a>
    </div>
</template>

<script>
export default {
    name: "CopyrightBar",
};
</script>

<style scoped>

</style>
