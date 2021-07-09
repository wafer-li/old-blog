const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig([
    {
        title: "Head First 设计模式",
        icon: "note",
        prefix: "head-first-design-pattern/",
        children: require("./head-first-design-pattern")
    },
    {
        title: "Algorithm 第四版",
        icon: "note",
        prefix: "algorithm-4th-edition/",
        children: require("./algorithm-4th-edition")
    },
    "编写可读代码的艺术 笔记",
    "Clean Code",
]);