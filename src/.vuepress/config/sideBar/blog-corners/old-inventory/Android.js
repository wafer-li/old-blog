const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig([
    {
        title: "Retrofit",
        icon: "storage",
        prefix: "Retrofit/",
        children: require("./Retrofit"),
    },
    {
        title: "MaterailDrawer",
        icon: "storage",
        prefix: "MaterailDrawer/",
        children: require("./MaterailDrawer"),
    },
    {
        title: "AndroidStudio",
        icon: "storage",
        prefix: "AndroidStudio/",
        children: require("./AndroidStudio"),
    },
    {
        title: "Volley",
        icon: "storage",
        prefix: "Volley/",
        children: require("./Volley"),
    },
    "Android 官方 Navigation Drawer",
    "Android 获取屏幕尺寸",
    "ToolBar",
    "Create Asserts Folder",
    "Android 多个 icon 问题",
    "Genymotion Problems and Solutions",
    "Android Gradle 介绍",
    "RecyclerView",
    "Butter Knife",
    "Splash Screen",
    "AsyncTask with Callback",
    "TextInputLayout 使用",
    "动态加载 Fragment",
    "Style 和 Theme 的简明对比",
]);