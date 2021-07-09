const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig([
    "",
    {
        title: "卷卷算法",
        icon: "script",
        prefix: "algo/",
        children: require("./algo"),
    },
    {
        title: "卷卷面经",
        icon: "script",
        prefix: "interview/",
        children: require("./interview"),
    },
]);