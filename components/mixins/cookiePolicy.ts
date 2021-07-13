import Vue from "vue";

export default Vue.extend({
    computed: {
        cookiePolicy() {
            return [
                {
                    content: "Last modified: February 2, 2021",
                },
                {
                    title: "What are cookies?",
                    content:
                        "This site uses cookies which are saved on your computer to improve your experience or serve for analytical and/or advertising purposes. This page describes what information they gather, how we use it and why we need to store them. We will also share how you can prevent these cookies from being stored however this may break certain elements of Themezer's functionality.",
                },
                {
                    title: "Consent",
                    content:
                        "By using our website, you hereby consent to our Privacy Policy and agree to its terms.",
                },
                {
                    title: "How We Use Cookies",
                    content:
                        "We use cookies for a variety of reasons detailed below. Unfortunately there is no industry standard for disabling cookies without completely disabling the functionality and features they add. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.",
                },
                {
                    title: "Disabling Cookies",
                    content:
                        "You can prevent the setting of cookies by changing the settings of your browser. Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features, therefore it is recommended that you do not disable them.",
                    list: [
                        {
                            title: "How to disable cookies",
                            title_to: "https://www.cookiesandyou.com/disable-cookies/windows/chrome/",
                        },
                    ],
                },
                {
                    title: "The Cookies We Set",
                    content: "These cookies are required for our website to function properly.",
                    list: [
                        {
                            title: "Login related cookies",
                            content: "We use cookies to save your login status. This prevents you from having to log in again on every visit. These cookies are normally removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.",
                        },
                        {
                            title: "Site preferences cookies",
                            content: "In order to provide you with a great experience we provide the functionality to set preferences for how this site runs when you use it. In order to remember your preferences we need to set cookies that contain your preferences.",
                        },
                    ],
                },
                {
                    title: "Third Party Cookies",
                    content:
                        "In some special cases we also use cookies provided by third parties. The following section details which third party cookies you might encounter through this site.",
                    list: [
                        {
                            title: "Analytical cookies",
                            content: "This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit, which we use to make improvements.",
                        },
                    ],
                },
                {
                    title: this.$t("moreInfo.title"),
                    content: this.$t("moreInfo.content"),
                    list: [
                        {
                            title: this.$t("moreInfo.contact"),
                            title_to: "/contact",
                        },
                    ],
                },
            ];
        },
    },
});
