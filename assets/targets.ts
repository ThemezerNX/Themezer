export const menus = [
    {
        icon: "mdi-home-outline",
        target: "homemenu",
        langKey: "homemenu",
        image: "ResidentMenu.jpg",
    },
    {
        icon: "mdi-lock-outline",
        target: "lockscreen",
        langKey: "lockscreen",
        image: "Entrance.jpg",
    },
    {
        icon: "mdi-apps",
        target: "allapps",
        langKey: "allapps",
        image: "Flaunch.jpg",
    },
    {
        icon: "mdi-cog-outline",
        target: "settings",
        langKey: "settings",
        image: "Set.jpg",
    },
    {
        icon: "mdi-account-multiple",
        target: "playerselect",
        langKey: "playerselect",
        image: "Psl.jpg",
    },
    {
        icon: "mdi-account-outline",
        target: "userpage",
        langKey: "userpage",
        image: "MyPage.jpg",
    },
    {
        icon: "mdi-newspaper-variant-outline",
        target: "news",
        langKey: "news",
        image: "Notification.jpg",
    },
];

export const targetIcon = (target: string) => menus.find((e) => e.target == target)?.icon;

export default [
    {
        langKey: "pack",
        name: "packs",
        icon: "mdi-package-variant-closed",
        class: "d-md-none",
        to: "/packs",
    },
    {
        langKey: "theme",
        name: "themes",
        icon: "mdi-format-color-fill",
        class: "d-md-none",
        margin_top: "4px",
        menus: [...menus],
    },
    {
        langKey: "layout",
        name: "layouts",
        icon: "mdi-code-json",
        class: "d-md-none",
        menus: [...menus],
    },
];
