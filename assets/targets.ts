export const menus = [
    {
        icon: "mdi-home-outline",
        title: "Home Menu",
        target: "homemenu",
        image: "ResidentMenu.jpg",
    },
    {
        icon: "mdi-lock-outline",
        title: "Lockscreen",
        target: "lockscreen",
        image: "Entrance.jpg",
    },
    {
        icon: "mdi-apps",
        title: "All Apps",
        target: "allapps",
        image: "Flaunch.jpg",
    },
    {
        icon: "mdi-cog-outline",
        title: "Settings",
        target: "settings",
        image: "Set.jpg",
    },
    {
        icon: "mdi-account-multiple",
        title: "Player Select",
        target: "playerselect",
        image: "Psl.jpg",
    },
    {
        icon: "mdi-account-outline",
        title: "User Page",
        target: "userpage",
        image: "MyPage.jpg",
    },
    {
        icon: "mdi-newspaper-variant-outline",
        title: "News",
        target: "news",
        image: "Notification.jpg",
    },
];

export default [
    {
        name: "packs",
        title: "Packs",
        icon: "mdi-package-variant-closed",
        class: "d-sm-none",
        to: "/packs",
    },
    {
        name: "themes",
        title: "Themes",
        icon: "mdi-format-color-fill",
        class: "d-sm-none",
        margin_top: "4px",
        menus: [...menus],
    },
    {
        name: "layouts",
        title: "Layouts",
        icon: "mdi-code-json",
        class: "d-sm-none",
        menus: [...menus],
    },
];
