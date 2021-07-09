const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig([
    {
        title: "gpg",
        icon: "repo",
        prefix: "gpg/",
        children: require("./gpg"),
    },
    {
        title: "live",
        icon: "actions",
        prefix: "live/",
        children: require("./live"),
    },
    {
        title: "hexo",
        icon: "blog",
        prefix: "hexo/",
        children: require("./hexo"),
    },
    "好用的工具",
    "windows 自动更新走代理",
    "局域网内网服务器简易开启方法",
]);