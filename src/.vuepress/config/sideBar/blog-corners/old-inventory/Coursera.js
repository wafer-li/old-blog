const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig([
    {
        title: "Algorithm",
        icon: "storage",
        prefix: "Algorithm/",
        children: require("./Algorithm"),
    },
    {
        title: "Scala",
        icon: "storage",
        prefix: "Scala/",
        children: require("./Scala"),
    },
]);