module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    extends: [
        '@nuxtjs/eslint-config-typescript',
        'prettier',
        'prettier/vue',
        // 'plugin:prettier/recommended',
        'plugin:nuxt/recommended'
    ],
    plugins: [
        'prettier'
    ],
    rules: {
        "space-before-function-paren": "off",
        // Still, only use this if you know what you're doing:
        "vue/no-v-html": "off"
    }
}
