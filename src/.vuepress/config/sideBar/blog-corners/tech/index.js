const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig([
    "",
    {
        title: "Android",
        icon: "android",
        prefix: "android/",
        children: require("./android")
    },
    {
        title: "各种折腾",
        icon: "customize",
        prefix: "tinkering/",
        children: require("./tinkering")
    },
]);