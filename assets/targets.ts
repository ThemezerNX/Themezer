export const menus = [
    {
        icon: "mdi-home-outline",
        target: "homemenu",
        image: "ResidentMenu.jpg",
    },
    {
        icon: "mdi-lock-outline",
        target: "lockscreen",
        image: "Entrance.jpg",
    },
    {
        icon: "mdi-apps",
        target: "allapps",
        image: "Flaunch.jpg",
    },
    {
        icon: "mdi-cog-outline",
        target: "settings",
        image: "Set.jpg",
    },
    {
        icon: "mdi-account-multiple",
        target: "playerselect",
        image: "Psl.jpg",
    },
    {
        icon: "mdi-account-outline",
        target: "userpage",
        image: "MyPage.jpg",
    },
    {
        icon: "mdi-newspaper-variant-outline",
        target: "news",
        image: "Notification.jpg",
    },
];

export const targetIcon = (target: string) => menus.find((e) => e.target == target)?.icon;

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
