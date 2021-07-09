const { navbarConfig } = require("vuepress-theme-hope");

module.exports = navbarConfig(
    [
        { text: "主页", icon: "home", link: "/" },
        {
            text: "专栏",
            icon: "book",
            prefix: "/blog-corners/",
            items: [
                { text: "技术开发", icon: "generic", link: "tech/" },
                { text: "学习笔记", icon: "read", link: "learning-notes/" },
                { text: "语言之路", icon: "blog", link: "langroad/" },
                { text: "卷卷", icon: "note", link: "rollroll/" },
                { text: "杂谈", icon: "article", link: "talk/" },
                { text: "旧文仓库", icon: "storage", link: "old-inventory/" },
            ]
        },
    ]
)
