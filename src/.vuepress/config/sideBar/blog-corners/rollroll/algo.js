const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig([
    {
        title: "leetcode",
        icon: "storage",
        prefix: "leetcode/",
        children: require("./leetcode"),
    },
]);