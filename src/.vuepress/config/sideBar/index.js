const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig({
    "/blog-corners/tech/": require("./blog-corners/tech"),
    "/blog-corners/learning-notes/": require("./blog-corners/learning-notes"),
    "/blog-corners/langroad/": require("./blog-corners/langroad"),
    "/blog-corners/rollroll/": require("./blog-corners/rollroll"),
    "/blog-corners/talk/": require("./blog-corners/talk"),
    "/blog-corners/old-inventory/": require("./blog-corners/old-inventory"),

    "/": [
        "/",
        "/about"
    ]
});
