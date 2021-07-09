const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig([
    {
        title: "架构迷思",
        icon: "map",
        prefix: "arch/",
        children: require("./arch")
    },
    {
        title: "踩坑记录",
        icon: "debug",
        prefix: "traps/",
        children: require("./traps")
    },
    {
        title: "音视频开发",
        icon: "debug",
        prefix: "media-dev/",
        children: require("./media-dev")
    },
    "itemdecoration-实战之-girdspacingitemdecoration（二）",
    "itemdecoration-实战之-girdspacingitemdecoration（一）",
    "翻译文章——在-android-studio-3-3-中迁移-gradle-到-kotlin-dsl",
    "使用-buildsrcversions-轻松管理-gradle-依赖",
]);