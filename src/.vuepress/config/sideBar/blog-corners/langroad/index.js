const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig([
    "",
    {
        title: "日语",
        icon: "language",
        prefix: "Japanese/",
        children: require("./Japanese"),
    },
    {
        title: "Python",
        icon: "python",
        prefix: "Python/",
        children: require("./Python"),
    },
    {
        title: "Java",
        icon: "java",
        prefix: "Java/",
        children: require("./Java"),
    },
    {
        title: "Kotlin",
        icon: "code",
        prefix: "Kotlin/",
        children: require("./Kotlin"),
    },
    {
        title: "Scala",
        icon: "code",
        prefix: "Scala/",
        children: require("./Scala"),
    },
    {
        title: "CSharp",
        icon: "code",
        prefix: "CSharp/",
        children: require("./CSharp"),
    },
]);