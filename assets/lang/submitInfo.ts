export default [
    {
        title: "Screenshots",
        content: "You are REQUIRED to upload a SCREENSHOT for every theme. Only the background image is NOT sufficient.",
    },
    {
        title: "What's special about Themezer?",
        content: "Themezer extracts everything that is uploaded to the website. This has a few benefits:",
        list: [
            {
                title: "Themes/Packs",
                content: "By extracting an NXTheme, the contents can be modified easily, without the need to upload a new NXTheme file. After you change something on a theme's or pack's edit page (accessible after submitting), the theme is rebuilt with the changes.",
            },
            {
                title: "Layouts",
                content: "Another great thing is that Themezer can detect what layout is used in a theme. This way, if Nintendo updates the home menu with breaking changes, all themes can be updated at once when the layout they use is updated. People can still upload themes with a custom layout, but those themes won't have these benefits.",
            },
        ],
    },
    {
        title: "Themezer does not detect my theme's layout",
        content: "If Themezer doesn't recognize the layout, you should select it in the available dropdown. Make sure it is the exact same layout or else you might lose some features! For example, if you've made a change to the position of a button, the change will be discarded if you select the original version of the layout you used in the dropdown.",
    },
    {
        title: "FAQ",
        list: [
            {
                title: "I am not the original author of this theme/pack",
                content:
                    "Unfortunately you may not submit it, because it will be linked to your account. Ask the original creator to upload it.",
            },
            {
                title: "The layout I use is not available on Themezer",
                content:
                    "Consider uploading it to the Layouts GitHub repository (see the 'Layout' submit page in the menu).",
            },
            {
                title: "I have made minor modification to another layout",
                content:
                    "Consider adding a customization option to the original in the Layouts GitHub repository (see the 'Layout' submit page in the menu). If you don't want to, make sure to change the 'ID' of the layout json file. Else Themezer will force-select the original layout.",
            },
            {
                title:
                    "I made a custom layout that I don't want to submit to the Layouts repository",
                content:
                    "Uhm... why not? Others can make use of it more easily and, most important of all, it's free! Anyway, feel free to submit it.",
            },
        ],
    },
];