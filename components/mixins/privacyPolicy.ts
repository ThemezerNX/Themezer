import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            privacyPolicy: [
                {
                    content: "Last modified: February 2, 2021",
                },
                {
                    content:
                        "This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Themezer. This policy is not applicable to any information collected offline or via channels other than this website.",
                },
                {
                    title: "Consent",
                    content:
                        "By using our website, you hereby consent to our Privacy Policy and agree to its terms.",
                },
                {
                    title: "Information we collect",
                    content:
                        "Themezer collects no sensitive personal data. We only store data related to authentication. A list of our third-parties:",
                    list: [
                        {
                            title: "Discord Inc.",
                            content: "Our website uses authentication services (OAuth2) from Discord Inc. Your Discord username, id and profile picture url are saved and used identification on our website.",
                        },
                        {
                            title: "Cloudflare, Inc.",
                            content: "Our website is proxied through Cloudflare servers to provide a better user experience. No data from Cloudflare about your visits is saved on our servers.",
                        },
                        {
                            title: "Google, Inc.",
                            content: "Our website makes use of Google Analytics. Data about your visits is not stored on our servers. Google Analytics collects anonymous data about visits to our website, such as country of origin, date and time of the visit, time spent on pages, etc. For a full overview of the data that is collected, we recommend you to consult the respective Google Analytics Privacy Policy. Google Analytics creates cookies on our website.",
                        },
                    ],
                },
                {
                    title: "Third Party Privacy Policies",
                    content:
                        "Themezer's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-parties for more detailed information. It may include their practices and instructions about how to opt-out of certain options.",
                },
                {
                    title: "Cookies and Web Beacons",
                    content: "Like any other website, Themezer uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information. For a complete overview of what we use cookies for, please read our",
                    list: [
                        {
                            title: "Cookie Policy",
                            title_to: "/cookie-policy",
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
            ],
        };
    },
});
