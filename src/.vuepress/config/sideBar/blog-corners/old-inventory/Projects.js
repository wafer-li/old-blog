const { sidebarConfig } = require("vuepress-theme-hope");

module.exports = sidebarConfig([
    {
        title: "MdzzProject",
        icon: "storage",
        prefix: "MdzzProject/",
        children: require("./MdzzProject"),
    },
    {
        title: "BigInovation",
        icon: "storage",
        prefix: "BigInovation/",
        children: require("./BigInovation"),
    },
]);